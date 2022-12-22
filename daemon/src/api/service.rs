use super::error::Error;
use crate::corekey::CoreAuthorization;
use crate::util;
use bollard::{
    container, image,
    models::{HostConfig, PortMap},
    service,
};
use futures::StreamExt;
use rocket::serde::json::Json;
use serde::*;
use serde_json::json;
use std::collections::HashMap;
use std::fmt::Write;
use std::{env, path};
use tokio::{fs, io::AsyncWriteExt};

fn get_bind_dir(id: &str) -> path::PathBuf {
    env::current_dir().unwrap().join("binds").join(id)
}

fn get_managed_bind_dir(id: &str) -> path::PathBuf {
    env::current_dir().unwrap().join("managed_binds").join(id)
}

#[derive(Deserialize)]
pub struct RawParams {
    id: String,
    image: String,
    bind_dir: String,
    bind_contents: Option<String>,

    cmd: Option<Vec<String>>,
    shell: Option<Vec<String>>,
    user: Option<String>,
    working_dir: Option<String>,

    #[serde(default = "util::yes")]
    open_stdin: bool,
    #[serde(default = "util::yes")]
    tty: bool,

    hostname: Option<String>,
    port_map: Option<PortMap>,
    network_disabled: Option<bool>,

    max_cpu: Option<u64>,
    max_ram: Option<u64>,
}

#[derive(Deserialize)]
#[serde(tag = "type", content = "params", rename_all = "snake_case")]
pub enum CreateConfig {
    Raw(RawParams),
}

#[rocket::post("/", data = "<config>")]
pub async fn create(
    _auth: CoreAuthorization,
    config: Json<CreateConfig>,
    docker: &rocket::State<bollard::Docker>,
    http: &rocket::State<crate::client::HttpClient>,
) -> Result<serde_json::Value, Error> {
    match config.0 {
        CreateConfig::Raw(raw) => {
            rocket::info_!("Creating raw container with id {}", raw.id);
            rocket::info_!("Pulling image {}", raw.image);

            let mut image_stream = docker.create_image(
                Some(image::CreateImageOptions {
                    from_image: raw.image.clone(),
                    ..Default::default()
                }),
                None,
                None,
            );

            while let Some(x) = util::ortoro(image_stream.next().await)? {
                if let (Some(status), Some(progress)) = (&x.status, &x.progress) {
                    rocket::info_!("{} {}", status, progress);
                }
            }

            rocket::info_!("Pulled image {}", raw.image);

            let image_properties = docker.inspect_image(&raw.image).await?;
            let image_config = image_properties.config.unwrap();

            let bind_path = get_bind_dir(&raw.id);
            let managed_bind_path = get_managed_bind_dir(&raw.id);

            fs::create_dir_all(&bind_path).await?;
            fs::create_dir_all(&managed_bind_path).await?;

            if let Some(url) = raw.bind_contents {
                rocket::info_!("Downloading {}", url);

                let response = http
                    .0
                    .get(hyper::Uri::try_from(&url)?)
                    .await
                    .map_err(|x| Error::Other(Box::new(x)))?;

                let decoder = async_compression::tokio::bufread::GzipDecoder::new(
                    tokio_util::io::StreamReader::new(response.into_body().map(|result| {
                        result.map_err(|_| {
                            std::io::Error::new(std::io::ErrorKind::Other, "Hyper error")
                        })
                    })),
                );

                rocket::info_!("Unpacking {}", url);

                let mut archive = tokio_tar::Archive::new(decoder);
                let mut entries = archive.entries()?;

                while let Some(mut file) = util::ortoro(entries.next().await)? {
                    file.unpack_in(&bind_path).await?;
                }
            }

            fs::File::create(managed_bind_path.join("entrypoint.sh"))
                .await?
                .write_all(b"sh -c \"$1\"\n")
                .await?;

            let container = docker
                .create_container(
                    Some(container::CreateContainerOptions { name: &raw.id }),
                    container::Config {
                        image: Some(raw.image),
                        cmd: Some(vec![[
                            image_config.entrypoint.unwrap_or_default(),
                            raw.cmd.or(image_config.cmd).unwrap_or_default(),
                        ]
                        .concat()
                        .join(" ")]),
                        entrypoint: Some(vec!["sh".into(), "/.duxcore/entrypoint.sh".into()]),
                        shell: raw.shell,
                        user: raw.user,
                        working_dir: raw.working_dir,
                        open_stdin: Some(raw.open_stdin),
                        tty: Some(raw.tty),
                        hostname: raw.hostname,
                        network_disabled: raw.network_disabled,
                        host_config: Some(HostConfig {
                            memory: raw.max_ram.map(|x| x as i64),
                            cpu_quota: raw.max_cpu.map(|x| x as i64),
                            binds: Some(vec![
                                format!("{}:/{}:rw", bind_path.to_str().unwrap(), raw.bind_dir),
                                format!("{}:/.duxcore:ro", managed_bind_path.to_str().unwrap()),
                            ]),
                            port_bindings: raw.port_map,
                            ..Default::default()
                        }),
                        ..Default::default()
                    },
                )
                .await?;

            rocket::info_!("Created container {:?}", container);

            Ok(json!({
                "id": raw.id,
                "type": "raw",
                "internal_id": container.id,
            }))
        }
    }
}

#[derive(Deserialize, Serialize)]
#[serde(rename_all = "snake_case")]
pub enum CtlOperation {
    Start,
    Stop,
    Restart,
    Kill,
}

#[derive(Deserialize)]
pub struct CtlCommand {
    op: CtlOperation,
}

#[rocket::post("/<id>/ctl", data = "<command>")]
pub async fn ctl(
    _auth: CoreAuthorization,
    command: Json<CtlCommand>,
    id: &str,
    docker: &rocket::State<bollard::Docker>,
) -> Result<serde_json::Value, Error> {
    match command.op {
        CtlOperation::Start => docker.start_container::<&str>(id, None).await?,
        CtlOperation::Stop => docker.stop_container(id, None).await?,
        CtlOperation::Restart => docker.restart_container(id, None).await?,
        CtlOperation::Kill => docker.kill_container::<&str>(id, None).await?,
    };

    Ok(json!({
        "id": id,
        "op": command.op,
    }))
}

#[rocket::get("/<id>/stats")]
pub async fn stats(
    _auth: CoreAuthorization,
    id: &str,
    docker: &rocket::State<bollard::Docker>,
) -> Result<Json<container::Stats>, Error> {
    Ok(Json(
        docker
            .stats(
                id,
                Some(container::StatsOptions {
                    one_shot: false,
                    stream: false,
                }),
            )
            .next()
            .await
            .unwrap()?,
    ))
}

#[rocket::delete("/<id>")]
pub async fn delete(
    _auth: CoreAuthorization,
    id: &str,
    docker: &rocket::State<bollard::Docker>,
) -> Result<serde_json::Value, Error> {
    docker.remove_container(id, None).await?;

    fs::remove_dir_all(get_bind_dir(id)).await?;
    fs::remove_dir_all(get_managed_bind_dir(id)).await?;

    Ok(json!({
        "id": id,
    }))
}

#[rocket::get("/<id>")]
pub async fn info(
    _auth: CoreAuthorization,
    id: &str,
    docker: &rocket::State<bollard::Docker>,
) -> Result<Json<service::ContainerInspectResponse>, Error> {
    Ok(Json(docker.inspect_container(id, None).await?))
}

#[rocket::patch("/<id>/env", data = "<new_env>")]
pub async fn set_env(
    _auth: CoreAuthorization,
    new_env: Json<HashMap<String, String>>,
    id: &str,
) -> Result<serde_json::Value, Error> {
    let managed_bind_path = get_managed_bind_dir(id);

    let mut file = fs::File::create(managed_bind_path.join("entrypoint.sh")).await?;
    let mut result = String::new();

    write!(result, "env").unwrap();

    for (key, value) in &new_env.0 {
        result += " ";
        result += &snailquote::escape(&format!("{}={}", key, value));
    }

    write!(result, " sh -c \"$1\"\n").unwrap();

    file.write_all(result.as_bytes()).await?;

    Ok(json!({
        "id": id,
        "env": new_env.0,
    }))
}
