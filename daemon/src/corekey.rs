use rocket::{http, request};
use tokio::io::AsyncReadExt;
use tokio::{fs, io};

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
