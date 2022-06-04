use rocket::{http, request};
use tokio::io::AsyncReadExt;
use tokio::{fs, io};

#[derive(Clone)]
pub struct CoreKey(Vec<u8>);

impl CoreKey {
    pub async fn load(filename: &str) -> io::Result<Self> {
        let mut buf = Vec::with_capacity(1024);

        fs::File::open(filename).await?.read_buf(&mut buf).await?;

        Ok(CoreKey(buf))
    }

    pub fn check_b64(&self, data: &str) -> Result<bool, base64::DecodeError> {
        let bin = base64::decode(data)?;

        if self.0 == bin {
            Ok(true)
        } else {
            Ok(false)
        }
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

#[async_trait::async_trait]
impl<'r> request::FromRequest<'r> for CoreAuthorization {
    type Error = CoreAuthError;

    async fn from_request(request: &'r rocket::Request<'_>) -> request::Outcome<Self, Self::Error> {
        if let Some(header) = request.headers().get_one("X-Duxcore-CoreKey") {
            let key: &CoreKey = request.rocket().state().unwrap();

            match key.check_b64(header) {
                Ok(true) => request::Outcome::Success(CoreAuthorization),
                Ok(false) => request::Outcome::Failure((
                    http::Status::Unauthorized,
                    CoreAuthError::WrongKey(header.into()),
                )),
                Err(e) => {
                    request::Outcome::Failure((http::Status::Unauthorized, CoreAuthError::from(e)))
                }
            }
        } else {
            request::Outcome::Failure((http::Status::Unauthorized, CoreAuthError::MissingHeader))
        }
    }
}
