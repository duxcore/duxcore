use super::user::BindUser;
use libunftp::auth;

#[derive(Debug)]
pub struct DuxcoreAuthenticator {
    _http: hyper::Client<hyper_tls::HttpsConnector<hyper::client::HttpConnector>>,
}

impl DuxcoreAuthenticator {
    pub fn new() -> Self {
        DuxcoreAuthenticator {
            _http: hyper::Client::builder().build(hyper_tls::HttpsConnector::new()),
        }
    }
}

#[async_trait::async_trait]
impl auth::Authenticator<BindUser> for DuxcoreAuthenticator {
    async fn authenticate(
        &self,
        username: &str,
        _creds: &auth::Credentials,
    ) -> Result<BindUser, auth::AuthenticationError> {
        Ok(BindUser(
            username
                .parse()
                .map_err(|_| auth::AuthenticationError::BadUser)?,
        ))
    }
}
