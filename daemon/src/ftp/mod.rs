use std::{env, sync::Arc};

mod auth;
mod storage;
mod user;

pub async fn run(addr: &str) -> Result<(), libunftp::ServerError> {
    let server = libunftp::Server::with_authenticator(
        Box::new(|| storage::BindStorage::new(env::current_dir().unwrap().join("binds"))),
        Arc::new(auth::DuxcoreAuthenticator::new()),
    )
    .passive_ports(50000..65535);

    server.listen(addr).await
}
