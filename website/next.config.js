module.exports = {
    reactStrictMode: true,
    async redirects() {
      return [
        {
          source: '/discord',
          destination: 'https://discord.gg/vZTbxBNSVA',
          permanent: true,
        },
        {
          source: '/github',
          destination: 'https://github.com/duxcore',
          permanent: true,
        },
      ]
    },
  };
  