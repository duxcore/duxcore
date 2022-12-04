use crate::{corekey, util};
use bollard::container;
use futures::{
    stream::{SplitSink, SplitStream},
    SinkExt, StreamExt, TryStreamExt,
};
use std::pin;
use std::sync::Arc;
use tokio::{io, io::AsyncWriteExt, net};

pub async fn run(corekey: corekey::CoreKey, docker: bollard::Docker, addr: &str) -> io::Result<()> {
    let corekey = Arc::new(corekey);
    let listener = net::TcpListener::bind(addr).await?;

    log::info!("Accepting WebSocket connections on {}", addr);

    while let Ok((stream, client_addr)) = listener.accept().await {
        log::info!("New WebSocket connection: {}", client_addr);

        tokio::spawn({
            let corekey = corekey.clone();
            let docker = docker.clone();
            async move {
                if let Err(e) = accept_connection(&corekey, docker, stream).await {
                    log::warn!("Error in WebSocket: {:?}", e);
                }
            }
        });
    }

    Ok(())
}

#[derive(serde::Deserialize)]
struct Init {
    corekey: String,
    #[serde(flatten)]
    command: InitCommand,
}

#[derive(serde::Deserialize)]
#[serde(tag = "type", content = "data", rename_all = "snake_case")]
enum InitCommand {
    Attach {
        service_id: String,
        #[serde(default = "util::no")]
        logs: bool,
    },
    Stats(String),
}

#[derive(Debug, thiserror::Error)]
enum Error {
    #[error("I/O error: {0}")]
    Io(#[from] io::Error),
    #[error("Tungstenite error: {0}")]
    Tungstenite(#[from] tungstenite::Error),
    #[error("Missing init message")]
    MissingInit,
    #[error("Base64 error: {0}")]
    Base64(#[from] base64::DecodeError),
    #[error("Bad authorization")]
    BadAuth,
    #[error("JSON error: {0}")]
    Serde(#[from] serde_json::Error),
    #[error("Unsupported message type")]
    UnsupportedMessageType(tungstenite::Message),
    #[error("Docker error: {0}")]
    Bollard(#[from] bollard::errors::Error),
}

type Ws = tokio_tungstenite::WebSocketStream<net::TcpStream>;

async fn attach(
    ws: Ws,
    docker: bollard::Docker,
    container: String,
    logs: bool,
) -> Result<(), Error> {
    log::info!("Attaching to container {}", container);

    let mut attachment = docker
        .attach_container::<&str>(
            &container,
            Some(container::AttachContainerOptions {
                stdin: Some(true),
                stdout: Some(true),
                stderr: Some(true),
                stream: Some(true),
                logs: Some(logs),
                ..Default::default()
            }),
        )
        .await?;

    let (write, read) = ws.split();

    // [GIT] revert this commit when try blocks are stable

    async fn do_writing(
        output: &mut pin::Pin<
            Box<
                dyn futures::Stream<Item = Result<container::LogOutput, bollard::errors::Error>>
                    + Send,
            >,
        >,
        mut write: SplitSink<
            tokio_tungstenite::WebSocketStream<net::TcpStream>,
            tungstenite::Message,
        >,
    ) -> Result<(), Error> {
        while let Some(entry) = output.try_next().await? {
            write
                .send(tungstenite::Message::Binary(entry.into_bytes().to_vec()))
                .await?;
        }

        Ok(())
    }

    async fn do_reading(
        input: &mut pin::Pin<Box<dyn io::AsyncWrite + Send>>,
        mut read: SplitStream<tokio_tungstenite::WebSocketStream<net::TcpStream>>,
    ) -> Result<(), Error> {
        while let Some(entry) = read.try_next().await? {
            match entry {
                tungstenite::Message::Binary(data) => {
                    input.write_all(&data).await?;
                }
                tungstenite::Message::Close(_) => {
                    log::info!("WebSocket closed");

                    return Ok(());
                }
                _ => {}
            }
        }

        Ok(())
    }

    tokio::select! {
        x = do_writing(&mut attachment.output, write) => x,
        x = do_reading(&mut attachment.input, read) => x,
    }
}

async fn stats(ws: Ws, docker: bollard::Docker, container: String) -> Result<(), Error> {
    let (write, read) = ws.split();

    async fn do_writing(
        docker: &bollard::Docker,
        container: &str,
        mut write: SplitSink<
            tokio_tungstenite::WebSocketStream<net::TcpStream>,
            tungstenite::Message,
        >,
    ) -> Result<(), Error> {
        let mut stream = docker.stats(
            &container,
            Some(container::StatsOptions {
                stream: true,
                ..Default::default()
            }),
        );

        while let Some(entry) = stream.try_next().await? {
            write
                .send(tungstenite::Message::Text(
                    serde_json::to_string(&entry).unwrap(),
                ))
                .await?;
        }

        Ok(())
    }

    async fn do_reading(
        mut read: SplitStream<tokio_tungstenite::WebSocketStream<net::TcpStream>>,
    ) -> Result<(), Error> {
        while let Some(entry) = read.try_next().await? {
            match entry {
                tungstenite::Message::Close(_) => {
                    log::info!("WebSocket closed");

                    return Ok(());
                }
                _ => {}
            }
        }

        Ok(())
    }

    tokio::select! {
        x = do_writing(&docker, &container, write) => x,
        x = do_reading(read) => x,
    }
}

async fn accept_connection(
    corekey: &corekey::CoreKey,
    docker: bollard::Docker,
    stream: net::TcpStream,
) -> Result<(), Error> {
    let mut ws = tokio_tungstenite::accept_async(stream).await?;

    let init = match ws.next().await.ok_or(Error::MissingInit)?? {
        tungstenite::Message::Text(text) => {
            let init: Init = serde_json::from_str(&text)?;

            if corekey.check_b64(&init.corekey)? {
                Ok(init)
            } else {
                Err(Error::BadAuth)
            }
        }
        m => Err(Error::UnsupportedMessageType(m)),
    }?;

    match init.command {
        InitCommand::Attach { service_id, logs } => attach(ws, docker, service_id, logs).await,
        InitCommand::Stats(container) => stats(ws, docker, container).await,
    }
}
