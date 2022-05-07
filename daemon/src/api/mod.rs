mod docker_image;
mod service;

mod error;

use rocket::fairing;
use serde_json::{json, Value};

const PREFIX: &str = "/api/v1";

#[rocket::catch(401)]
fn unauthorized() -> Value {
    json!({
        "error": {
            "code": 401,
            "reason": "Unauthorized",
            "description": "Accessing this daemon requires core authorization."
        }
    })
}

pub fn fairing() -> impl fairing::Fairing {
    fairing::AdHoc::on_ignite("HTTP API", |rocket| async {
        rocket
            .register("/", rocket::catchers![unauthorized])
            .mount(
                format!("{}/service", PREFIX),
                rocket::routes![service::create, service::ctl],
            )
            .mount(
                format!("{}/docker/image", PREFIX),
                rocket::routes![docker_image::create_raw],
            )
    })
}
