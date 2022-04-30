#![feature(try_blocks)]

pub mod api;
pub mod corekey;
pub mod util;
pub mod websocket;

use std::error::Error;

use unftp_sbe_fs::ServerExt;

#[tokio::main]
async fn main() -> Result<(), Box<dyn Error>> {
    let corekey = corekey::CoreKey::load("corekey.bin")
        .await
        .expect("missing corekey.bin");
    let docker = bollard::Docker::connect_with_local_defaults().unwrap();

    let rocket_task = tokio::spawn({
        let corekey = corekey.clone();
        let docker = docker.clone();
        async move {
            rocket::build()
                .manage(docker)
                .manage(corekey)
                .attach(api::fairing())
                .launch()
                .await
        }
    });

    let attach_task = tokio::spawn(websocket::run(corekey, docker, "127.0.0.1:8001"));

    let unftp_task = tokio::spawn(async {
        let ftp_home = std::env::temp_dir();
        let server = libunftp::Server::with_fs(ftp_home)
            .greeting("Welcome to my FTP server")
            .passive_ports(50000..65535);

        server.listen("127.0.0.1:2121").await
    });

    tokio::select![
        x = rocket_task => x.unwrap()?,
        x = attach_task => x.unwrap()?,
        x = unftp_task => x.unwrap()?,
    ];

    Ok(())
}
