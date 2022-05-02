use std::collections::HashMap;

use crate::corekey::CoreAuthorization;
use bollard::{container, image};
use futures::StreamExt;
use rocket::serde::json::Json;
use serde::*;
use serde_json::{json, Value};

fn yes() -> bool {
    true
}

#[derive(Deserialize)]
pub struct RawParams {
    image: String,

    // unix
    cmd: Vec<String>,
    shell: Option<Vec<String>>,
    user: Option<String>,
    working_dir: Option<String>,

    // stdio
    #[serde(default = "yes")]
    open_stdin: bool,
    #[serde(default = "yes")]
    tty: bool,

    // networking
    hostname: Option<String>,
    exposed_ports: Option<HashMap<String, HashMap<(), ()>>>,
    network_disabled: Option<bool>,
}

impl Into<container::Config<String>> for RawParams {
    fn into(self) -> container::Config<String> {
        container::Config {
            image: Some(self.image),
            cmd: Some(self.cmd),
            shell: self.shell,
            user: self.user,
            working_dir: self.working_dir,
            open_stdin: Some(self.open_stdin),
            tty: Some(self.tty),
            hostname: self.hostname,
            exposed_ports: self.exposed_ports,
            network_disabled: self.network_disabled,
            ..Default::default()
        }
    }
}

#[derive(Deserialize)]
#[serde(tag = "type", content = "params", rename_all = "snake_case")]
pub enum CreateConfig {
    Raw(RawParams),
}

#[rocket::post("/docker/container", data = "<config>")]
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

            let container = docker
                .create_container::<&str, String>(None, raw.into())
                .await
                .unwrap();

            rocket::info_!("Created container {:?}", container);

            json!({ "container_id": container.id, })
        }
    }
}
