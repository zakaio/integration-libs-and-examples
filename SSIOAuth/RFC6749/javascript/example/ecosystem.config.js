module.exports = {
  apps : [{
    name: 'second-auth-demo',
    script: 'src/server.js',
    env: {
      PORT: '4607',
      CLIENT_ID: 'ab95234d-e1ca-4fa1-862c-da239dd89b68',
      CLIENT_SECRET: '2323r31r',
      OAUTH_URL: 'https://test.proofspace.id/oauth2',
      REDIRECT_URI: 'https://test.proofspace.id/auth-demo2/redirect',
      ROOT_URI: '/',
      JWT_KEY_FILE: "publicKey.pem",
      JWT_ALGO: "RS256",
    },
  }]
};
