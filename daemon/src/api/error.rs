use rocket::{http, response};
use std::io;

#[derive(Debug, thiserror::Error)]
pub enum Error {
    #[error("I/O error: {0}")]
    Io(#[from] io::Error),
    #[error("Docker error: {0}")]
    Bollard(#[from] bollard::errors::Error),
    #[error("Invalid URI: {0}")]
    Uri(#[from] hyper::http::uri::InvalidUri),
    #[error("Other error: {0}")]
    Http(#[from] hyper::Error),
    #[error("Other error: {0}")]
    Other(Box<dyn std::error::Error>),
}

impl<'r, 'o: 'r> rocket::response::Responder<'r, 'o> for Error {
    fn respond_to(self, _request: &'r rocket::Request<'_>) -> response::Result<'o> {
        rocket::error_!("{}", self);
        response::Result::Err(http::Status::BadRequest)
    }
}
