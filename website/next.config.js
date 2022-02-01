module.exports = {
  poweredByHeader: false,
  async redirects() {
    return [
      {
        source: '/discord',
        destination: 'https://discord.gg/t2WaRFjuHM',
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
