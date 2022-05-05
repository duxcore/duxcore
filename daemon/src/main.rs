#![feature(try_blocks)]

pub mod api;
pub mod client;
pub mod corekey;
pub mod ftp;
pub mod util;
pub mod websocket;

use std::error::Error;

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
                .manage(client::HttpClient::default())
                .attach(api::fairing())
                .launch()
                .await
        }
    });

    let attach_task = tokio::spawn(websocket::run(corekey, docker, "127.0.0.1:8001"));

    let unftp_task = tokio::spawn(ftp::run("127.0.0.1:2121"));

    tokio::select![
        x = rocket_task => x.unwrap()?,
        x = attach_task => x.unwrap()?,
        x = unftp_task => x.unwrap()?,
    ];

    Ok(())
}
