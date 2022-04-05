module.exports = {
  apps : [{
    name: 'sync-issue-demo',
    script: 'src/server.js',
    env: {
      PORT: '4605',
      CREDENTIAL_ID: '',
      SCHEMA_ID: '',
      CONTAINER_URI: 'https://platform.proofspace.id/service-dashboard-backend/service',
    },
  }]
};
