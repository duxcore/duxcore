use libunftp::auth;
use std::fmt;

#[derive(Debug)]
pub struct BindUser(pub u64);

impl fmt::Display for BindUser {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        self.0.fmt(f)
    }
}

impl auth::UserDetail for BindUser {}
