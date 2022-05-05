use std::env;

use super::error::Error;
use crate::corekey::CoreAuthorization;
use crate::util;
use bollard::{
    container, image,
    models::{HostConfig, PortMap},
};
use futures::StreamExt;
use rocket::serde::json::Json;
use serde::*;
use serde_json::{json, Value};
use tokio::fs;

fn yes() -> bool {
    true
}

#[derive(Deserialize)]
pub struct RawParams {
    image: String,
    bind_dir: String,
    bind_contents: Option<String>,

    cmd: Option<Vec<String>>,
    shell: Option<Vec<String>>,
    user: Option<String>,
    working_dir: Option<String>,

    #[serde(default = "yes")]
    open_stdin: bool,
    #[serde(default = "yes")]
    tty: bool,

    hostname: Option<String>,
    port_map: Option<PortMap>,
    network_disabled: Option<bool>,
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
) -> Result<Value, Error> {
    match config.0 {
        CreateConfig::Raw(raw) => {
            rocket::info_!("Creating raw container");
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

            let id = rand::random::<u64>().to_string();
            let path = env::current_dir().unwrap().join("binds").join(&id);

            fs::create_dir(&path).await?;

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
                    file.unpack_in(&path).await?;
                }
            }

            let container = docker
                .create_container(
                    Some(container::CreateContainerOptions { name: &id }),
                    container::Config {
                        image: Some(raw.image),
                        cmd: raw.cmd,
                        shell: raw.shell,
                        user: raw.user,
                        working_dir: raw.working_dir,
                        open_stdin: Some(raw.open_stdin),
                        tty: Some(raw.tty),
                        hostname: raw.hostname,
                        network_disabled: raw.network_disabled,
                        host_config: Some(HostConfig {
                            binds: Some(vec![format!(
                                "{}:/{}",
                                path.to_str().unwrap(),
                                raw.bind_dir
                            )]),
                            port_bindings: raw.port_map,
                            ..Default::default()
                        }),
                        ..Default::default()
                    },
                )
                .await?;

            rocket::info_!("Created container {:?}", container);

            Ok(json!({ "container_id": id }))
        }
    }
}

#[derive(Deserialize)]
#[serde(tag = "op", rename_all = "snake_case")]
pub enum CtlCommand {
    Start,
    Stop,
    Restart,
    Kill,
}

#[rocket::post("/<id>/ctl", data = "<command>")]
pub async fn ctl(
    _auth: CoreAuthorization,
    command: Json<CtlCommand>,
    id: &str,
    docker: &rocket::State<bollard::Docker>,
) -> Result<(), Error> {
    match command.0 {
        CtlCommand::Start => docker.start_container::<&str>(id, None).await?,
        CtlCommand::Stop => docker.stop_container(id, None).await?,
        CtlCommand::Restart => docker.restart_container(id, None).await?,
        CtlCommand::Kill => docker.kill_container::<&str>(id, None).await?,
    };

    Ok(())
}
