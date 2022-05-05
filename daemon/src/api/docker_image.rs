use crate::corekey::CoreAuthorization;
use crate::util;
use bollard::{image, models};
use futures::TryStreamExt;
use serde_json::{json, Value};

#[rocket::post("/", data = "<image_data>")]
pub async fn create_raw(
    _auth: CoreAuthorization,
    image_data: rocket::Data<'_>,
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

    json!({ "image_id": image_id })
}
