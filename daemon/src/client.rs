use follow_redirects::ClientExt;

pub struct HttpClient(
    pub  follow_redirects::Client<
        hyper_tls::HttpsConnector<hyper::client::HttpConnector>,
        hyper::Body,
    >,
);

impl Default for HttpClient {
    fn default() -> Self {
        HttpClient(
            hyper::Client::builder()
                .build(hyper_tls::HttpsConnector::new())
                .follow_redirects(),
        )
    }
}
