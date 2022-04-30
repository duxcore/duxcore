use crate::corekey;
use bollard::container;
use futures::{SinkExt, StreamExt, TryStreamExt};
use std::sync::Arc;
use tokio::{io, io::AsyncWriteExt, net, task};

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
    Attach(String),
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

async fn attach(ws: Ws, docker: bollard::Docker, container: String) -> Result<(), Error> {
    log::info!("Starting container {}", container);

    docker.start_container::<&str>(&container, None).await.ok();

    log::info!("Attaching to container {}", container);

    let mut attachment = docker
        .attach_container::<&str>(
            &container,
            Some(container::AttachContainerOptions {
                stdin: Some(true),
                stdout: Some(true),
                stderr: Some(true),
                stream: Some(true),
                ..Default::default()
            }),
        )
        .await?;

    let (mut write, mut read) = ws.split();

    let write_task: task::JoinHandle<Result<(), Error>> = tokio::spawn(async move {
        try {
            while let Ok(Some(entry)) = attachment.output.try_next().await {
                write
                    .send(tungstenite::Message::Binary(entry.into_bytes().to_vec()))
                    .await?;
            }
        }
    });

    let read_task: task::JoinHandle<Result<(), Error>> = tokio::spawn(async move {
        try {
            while let Ok(Some(entry)) = read.try_next().await {
                match entry {
                    tungstenite::Message::Binary(data) => {
                        attachment.input.write_all(&data).await?;
                    }
                    tungstenite::Message::Close(_) => {
                        log::info!("WebSocket closed");

                        return Ok(());
                    }
                    _ => {}
                }
            }
        }
    });

    tokio::select! {
        x = write_task => x.unwrap(),
        x = read_task => x.unwrap(),
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
        InitCommand::Attach(container) => attach(ws, docker, container).await,
    }
}
