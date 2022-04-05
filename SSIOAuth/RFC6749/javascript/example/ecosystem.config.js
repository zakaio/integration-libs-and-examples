module.exports = {
  apps : [{
    name: 'second-auth-demo',
    script: 'src/server.js',
    env: {
      PORT: '4607',
      CLIENT_DID: '',
      CLIENT_SECRET: '',
      OAUTH_URL: 'https://platform.proofspace.id/oauth',
      REDIRECT_URI: 'https://platform.proofspace.id/auth-demo2/redirect',
      ROOT_URI: '/'
    },
  }]
};
