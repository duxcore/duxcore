mod docker_create;

use rocket::fairing;
use serde_json::{json, Value};

const API_VERSION: &str = "v1";

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
        rocket.register("/", rocket::catchers![unauthorized]).mount(
            format!("/api/{}", API_VERSION),
            rocket::routes![docker_create::remote, docker_create::raw],
        )
    })
}
