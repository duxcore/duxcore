use super::user::BindUser;
use libunftp::storage;
use std::{fmt, path, time};
use tokio::{
    fs,
    io::{self, AsyncSeekExt},
};

pub struct BindMetadata(std::fs::Metadata);

impl storage::Metadata for BindMetadata {
    fn len(&self) -> u64 {
        self.0.len()
    }

    fn is_dir(&self) -> bool {
        self.0.is_dir()
    }

    fn is_file(&self) -> bool {
        self.0.is_file()
    }

    fn is_symlink(&self) -> bool {
        self.0.is_symlink()
    }

    fn modified(&self) -> storage::Result<time::SystemTime> {
        Ok(self.0.modified()?)
    }

    fn gid(&self) -> u32 {
        0
    }

    fn uid(&self) -> u32 {
        0
    }
}

#[derive(Debug)]
pub struct BindStorage {
    root: path::PathBuf,
}

impl BindStorage {
    pub fn new(root: impl AsRef<path::Path>) -> Self {
        BindStorage {
            root: root.as_ref().into(),
        }
    }

    fn abs_to_inner(&self, user: &BindUser, abs: impl AsRef<path::Path>) -> path::PathBuf {
        abs.as_ref()
            .strip_prefix(self.root.join(user.0.to_string()))
            .unwrap()
            .into()
    }

    fn inner_to_abs(&self, user: &BindUser, inner: impl AsRef<path::Path>) -> path::PathBuf {
        // remove all .. from the path
        let clean_path: path::PathBuf = inner.as_ref().into_iter().filter(|x| *x != "..").collect();

        self.root
            .join(user.0.to_string())
            .join(clean_path.strip_prefix("/").unwrap_or(&clean_path))
    }
}

#[async_trait::async_trait]
impl storage::StorageBackend<BindUser> for BindStorage {
    type Metadata = BindMetadata;

    async fn metadata<P: AsRef<path::Path> + Send + fmt::Debug>(
        &self,
        user: &BindUser,
        path: P,
    ) -> storage::Result<Self::Metadata> {
        Ok(BindMetadata(
            fs::metadata(self.inner_to_abs(user, path)).await?,
        ))
    }

    async fn list<P: AsRef<path::Path> + Send + fmt::Debug>(
        &self,
        user: &BindUser,
        path: P,
    ) -> storage::Result<Vec<storage::Fileinfo<path::PathBuf, Self::Metadata>>> {
        let mut result = Vec::with_capacity(64);
        let mut entries = fs::read_dir(self.inner_to_abs(user, path)).await?;

        while let Some(entry) = entries.next_entry().await? {
            result.push(storage::Fileinfo {
                path: self.abs_to_inner(user, entry.path()),
                metadata: BindMetadata(entry.metadata().await?),
            })
        }

        Ok(result)
    }

    async fn get<P: AsRef<path::Path> + Send + fmt::Debug>(
        &self,
        user: &BindUser,
        path: P,
        start_pos: u64,
    ) -> storage::Result<Box<dyn io::AsyncRead + Send + Sync + Unpin>> {
        let mut file = fs::File::open(self.inner_to_abs(user, path)).await?;

        file.seek(std::io::SeekFrom::Start(start_pos)).await?;

        Ok(Box::new(file))
    }

    async fn put<
        P: AsRef<path::Path> + Send + fmt::Debug,
        R: io::AsyncRead + Send + Sync + Unpin + 'static,
    >(
        &self,
        user: &BindUser,
        mut input: R,
        path: P,
        start_pos: u64,
    ) -> storage::Result<u64> {
        let mut file = fs::File::create(self.inner_to_abs(user, path)).await?;

        file.seek(std::io::SeekFrom::Start(start_pos)).await?;
        Ok(io::copy(&mut input, &mut file).await?)
    }

    async fn del<P: AsRef<path::Path> + Send + fmt::Debug>(
        &self,
        user: &BindUser,
        path: P,
    ) -> storage::Result<()> {
        Ok(fs::remove_file(self.inner_to_abs(user, path)).await?)
    }

    async fn mkd<P: AsRef<path::Path> + Send + fmt::Debug>(
        &self,
        user: &BindUser,
        path: P,
    ) -> storage::Result<()> {
        Ok(fs::create_dir(self.inner_to_abs(user, path)).await?)
    }

    async fn rename<P: AsRef<path::Path> + Send + fmt::Debug>(
        &self,
        user: &BindUser,
        from: P,
        to: P,
    ) -> storage::Result<()> {
        Ok(fs::rename(self.inner_to_abs(user, from), self.inner_to_abs(user, to)).await?)
    }

    async fn rmd<P: AsRef<path::Path> + Send + fmt::Debug>(
        &self,
        user: &BindUser,
        path: P,
    ) -> storage::Result<()> {
        Ok(fs::remove_dir(self.inner_to_abs(user, path)).await?)
    }

    async fn cwd<P: AsRef<path::Path> + Send + fmt::Debug>(
        &self,
        user: &BindUser,
        path: P,
    ) -> storage::Result<()> {
        // i don't know what this is for. i just stole it from unftp-sbe-fs
        Ok(fs::read_dir(self.inner_to_abs(user, path))
            .await
            .map(|_| ())?)
    }
}
