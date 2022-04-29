pub mod api;
pub mod corekey;
pub mod util;

use unftp_sbe_fs::ServerExt;

#[tokio::main]
async fn main() {
    let rocket_task = tokio::spawn(async {
        let docker = bollard::Docker::connect_with_local_defaults().unwrap();

        rocket::build()
            .manage(docker)
            .attach(api::fairing())
            .launch()
            .await
            .unwrap();
    });

    let unftp_task = tokio::spawn(async {
        let ftp_home = std::env::temp_dir();
        let server = libunftp::Server::with_fs(ftp_home)
            .greeting("Welcome to my FTP server")
            .passive_ports(50000..65535);

        server.listen("127.0.0.1:2121").await.unwrap();
    });

    // not join because only rocket listens for ctrl-c
    tokio::select![
        x = rocket_task => {},
        x = unftp_task => {}
    ];
}
