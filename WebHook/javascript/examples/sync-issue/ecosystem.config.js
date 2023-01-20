module.exports = {
  apps : [{
    name: 'sync-issue-demo',
    script: 'src/server.js',
    env: {
      PORT: '4605',
      CREDENTIAL_ID: 'FhnK3hGQ6EeQHKztiHJ6pu:3:CL:649:tag',
      SCHEMA_ID: 'FhnK3hGQ6EeQHKztiHJ6pu:2:Example Secret Access:1.0',
      CONTAINER_URI: 'https://test.proofspace.id/service-dashboard-backend/service',
    },
  }]
};
