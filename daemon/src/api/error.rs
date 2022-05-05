use rocket::{http, response};
use std::io;

#[derive(Debug, thiserror::Error)]
pub enum Error {
    #[error("I/O error: {0}")]
    Io(#[from] io::Error),
    #[error("Docker error: {0}")]
    Bollard(#[from] bollard::errors::Error),
}

impl<'r, 'o: 'r> rocket::response::Responder<'r, 'o> for Error {
    fn respond_to(self, _request: &'r rocket::Request<'_>) -> response::Result<'o> {
        response::Result::Err(http::Status::BadRequest)
    }
}
