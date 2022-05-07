use rocket::data::{Data, ToByteUnit};
use std::future::Future;
use tokio::io::AsyncReadExt;
use tokio::task::JoinError;

pub async fn body_from_data<R, F, C>(data: Data<'_>, cb: C) -> Result<R, JoinError>
where
    C: FnOnce(hyper::Body) -> F,
    F: Future<Output = R>,
    F: Send + 'static,
    R: Send + 'static,
{
    let (mut tx, body) = hyper::Body::channel();
    let task = tokio::spawn(cb(body));

    let mut stream = data.open(4u32.gigabytes());
    let mut buf = vec![0; 512];

    loop {
        match stream.read(&mut buf).await {
            Ok(0) => break,
            Ok(n) => tx
                .send_data(bytes::Bytes::copy_from_slice(&buf[0..n]))
                .await
                .unwrap(),
            Err(e) => Err(e).unwrap(),
        }
    }

    drop(tx);

    task.await
}

// Option<Result> to Result<Option>
pub fn ortoro<T, E>(x: Option<Result<T, E>>) -> Result<Option<T>, E> {
    if let Some(x) = x {
        x.map(|x| Some(x))
    } else {
        Ok(None)
    }
}
