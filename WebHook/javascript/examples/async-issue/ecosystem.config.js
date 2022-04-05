module.exports = {
  apps : [{
    name: 'async-issue-demo',
    script: 'src/server.js',
    env: {
      PORT: '4604',
      CREDENTIAL_ID: '',
      SCHEMA_ID: '',
      CONTAINER_URI: 'https://platform.proofspace.id/service-dashboard-backend/service',
    },
  }]
};
