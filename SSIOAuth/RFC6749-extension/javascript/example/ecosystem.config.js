module.exports = {
  apps : [{
    name: 'proofspace-oauth-rfc6749-extension-example',
    script: 'src/server.js',
    env: {
      PORT: '4608',
      CLIENT_ID: '', // Insert client id here
      CLIENT_SECRET: '', // Insert client secret here
      OAUTH_URL: 'https://test.proofspace.id/oauth2',
      REDIRECT_URI: '', // Insert redirect uri here
      ROOT_URI: '/',  // ROOT URI of webn application
      JWT_KEY_FILE: "publicKey.pem", // file with public key
      JWT_ALGO: "RS256", // one of  "RS256", "RS512", "SHARED_SECRET"
    },
  }]
};
