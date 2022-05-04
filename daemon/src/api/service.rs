use std::env;

use crate::corekey::CoreAuthorization;
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

#[rocket::post("/service", data = "<config>")]
pub async fn create(
    _auth: CoreAuthorization,
    config: Json<CreateConfig>,
    docker: &rocket::State<bollard::Docker>,
) -> Value {
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

            while let Some(Ok(x)) = image_stream.next().await {
                if let (Some(status), Some(progress)) = (&x.status, &x.progress) {
                    rocket::info_!("{} {}", status, progress);
                }
            }

            rocket::info_!("Pulled image {}", raw.image);

            let id: u64 = rand::random();
            let path = env::current_dir()
                .unwrap()
                .join("binds")
                .join(id.to_string());

            fs::create_dir(&path).await.unwrap();

            let container = docker
                .create_container(
                    Some(container::CreateContainerOptions {
                        name: id.to_string(),
                    }),
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
                .await
                .unwrap();

            rocket::info_!("Created container {:?}", container);

            json!({ "container_id": id })
        }
    }
}
