use bollard::{container, image, models};
use futures::{StreamExt, TryStreamExt};
use rocket::data::ToByteUnit;
use rocket::serde::json::Json;
use rocket::{data, fairing, http, request};
use serde::*;
use tokio::io::AsyncReadExt;
use tokio::{fs, io};

pub const API_VERSION: &str = "v1";

pub struct CoreKey(Vec<u8>);

impl CoreKey {
    pub async fn load(filename: &str) -> io::Result<Self> {
        let mut buf = Vec::with_capacity(1024);

        fs::File::open(filename).await?.read_buf(&mut buf).await?;

        Ok(CoreKey(buf))
    }
}

#[derive(Debug, thiserror::Error)]
pub enum CoreAuthError {
    #[error("Missing header")]
    MissingHeader,
    #[error("Base64 error: {0}")]
    Format(#[from] base64::DecodeError),
    #[error("Wrong core key: {0}")]
    WrongKey(String),
}

pub struct CoreAuthorization;

#[rocket::async_trait]
impl<'r> request::FromRequest<'r> for CoreAuthorization {
    type Error = CoreAuthError;

    async fn from_request(request: &'r rocket::Request<'_>) -> request::Outcome<Self, Self::Error> {
        if let Some(header) = request.headers().get_one("X-Duxcore-CoreKey") {
            let bin = match base64::decode(header) {
                Ok(x) => x,
                Err(e) => {
                    return request::Outcome::Failure((
                        http::Status::Unauthorized,
                        CoreAuthError::from(e),
                    ))
                }
            };
            let key: &CoreKey = request.rocket().state().unwrap();

            if key.0 == bin {
                request::Outcome::Success(CoreAuthorization)
            } else {
                request::Outcome::Failure((
                    http::Status::Unauthorized,
                    CoreAuthError::WrongKey(header.into()),
                ))
            }
        } else {
            request::Outcome::Failure((http::Status::Unauthorized, CoreAuthError::MissingHeader))
        }
    }
}

#[rocket::catch(401)]
fn unauthorized() -> serde_json::Value {
    serde_json::json!({
        "error": {
            "code": 401,
            "reason": "Unauthorized",
            "description": "Accessing this daemon requires core authorization."
        }
    })
}

#[derive(Deserialize)]
struct ImageConfig {
    name: String,
}

#[rocket::post("/service/docker/remote", data = "<image_config>")]
async fn create_docker_remote(
    _auth: CoreAuthorization,
    image_config: Json<ImageConfig>,
    docker: &rocket::State<bollard::Docker>,
) -> Json<CreateServiceResponse> {
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

    Json(CreateServiceResponse {
        service_id: container.id,
    })
}

#[derive(Serialize)]
struct CreateServiceResponse {
    service_id: String,
}

#[rocket::post("/service/docker/raw", data = "<image_data>")]
async fn create_docker_raw(
    _auth: CoreAuthorization,
    image_data: data::Data<'_>,
    docker: &rocket::State<bollard::Docker>,
) -> Json<CreateServiceResponse> {
    // keeping `container`'s lifetime with some parallel magic
    // can't just use `Body::wrap_stream` because it wants the stream to be `'static`

    let (mut tx, body) = hyper::Body::channel();

    let image_task = tokio::spawn(
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
            .try_collect(),
    );

    {
        let mut stream = image_data.open(4u32.gigabytes());
        let mut buf = vec![0; 512];
        let mut total = 0;

        rocket::info_!("Redirecting container data...");

        loop {
            match stream.read(&mut buf).await {
                Ok(0) => break,
                Ok(n) => {
                    tx.send_data(bytes::Bytes::copy_from_slice(&buf[0..n]))
                        .await
                        .unwrap();
                    total += n
                }
                Err(e) => Err(e).unwrap(),
            }
        }

        rocket::info_!("Uploaded {:.1} megabytes", total as f32 / (1 << 20) as f32);

        drop(tx);
    }

    let image: Vec<models::CreateImageInfo> = image_task.await.unwrap().unwrap();

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

    Json(CreateServiceResponse {
        service_id: container.id,
    })
}

pub fn fairing() -> impl fairing::Fairing {
    fairing::AdHoc::on_ignite("HTTP API", |rocket| async {
        rocket
            .register("/", rocket::catchers![unauthorized])
            .mount(
                format!("/api/{}", API_VERSION),
                rocket::routes![create_docker_remote, create_docker_raw],
            )
            .manage(
                CoreKey::load("corekey.bin")
                    .await
                    .expect("missing corekey.bin"),
            )
    })
}
