module.exports = {
  async redirects() {
    return [
      {
        source: '/discord',
        destination: 'https://discord.gg/dTGJ5Bchnq',
        permanent: true
      },
      {
        source: '/github',
        destination: 'https://github.com/duxcore/duxcore',
        permanent: true
      }
    ]
  }
}
