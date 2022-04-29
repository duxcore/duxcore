use crate::corekey::CoreAuthorization;
use crate::util;
use bollard::{container, image, models};
use futures::{StreamExt, TryStreamExt};
use rocket::data;
use rocket::serde::json::Json;
use serde::*;
use serde_json::{json, Value};

#[derive(Deserialize)]
pub struct ImageConfig {
    name: String,
}

#[rocket::post("/service/docker/remote", data = "<image_config>")]
pub async fn remote(
    _auth: CoreAuthorization,
    image_config: Json<ImageConfig>,
    docker: &rocket::State<bollard::Docker>,
) -> Value {
    rocket::info_!("Pulling image {}", image_config.name);

    let mut image_stream = docker.create_image(
        Some(image::CreateImageOptions {
            from_image: image_config.name.as_str(),
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

    rocket::info_!("Pulled image {}", image_config.name);

    let container = docker
        .create_container::<&str, &str>(
            None,
            container::Config {
                image: Some(&image_config.name),
                cmd: Some(vec!["/bin/echo", "hello world"]),
                ..Default::default()
            },
        )
        .await
        .unwrap();

    rocket::info_!("Created container {:?}", container);

    json!({ "service_id": container.id, })
}

#[rocket::post("/service/docker/raw", data = "<image_data>")]
pub async fn raw(
    _auth: CoreAuthorization,
    image_data: data::Data<'_>,
    docker: &rocket::State<bollard::Docker>,
) -> Value {
    // keeping `image_data`'s lifetime with some parallel magic
    // can't just use `Body::wrap_stream` because it wants the stream to be `'static`

    rocket::info_!("Redirecting image data...");

    let image: Vec<models::CreateImageInfo> = util::body_from_data(image_data, |body| {
        docker
            .create_image(
                Some(image::CreateImageOptions {
                    from_src: "-",
                    repo: "duxcore_daemon_raw",
                    tag: "1",
                    ..Default::default()
                }),
                Some(body),
                None,
            )
            .try_collect()
    })
    .await
    .unwrap()
    .unwrap();

    let image_id = image[0].status.as_ref();

    rocket::info_!("Created container image {:?}", image);

    let container = docker
        .create_container::<&str, &str>(
            None,
            container::Config {
                image: Some(&image_id.unwrap()),
                cmd: Some(vec!["/bin/echo", "hello world"]),
                ..Default::default()
            },
        )
        .await
        .unwrap();

    rocket::info_!("Created container {:?}", container);

    json!({ "service_id": container.id })
}
