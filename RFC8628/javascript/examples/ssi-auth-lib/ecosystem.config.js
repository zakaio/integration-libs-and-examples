module.exports = {
  apps : [{
    name: 'auth-demo',
    script: 'src/server.js',
    env: {
      DEMO_MONGO_DB_URI: 'mongodb://127.0.0.1:27017/auth-demo',
      PORT: '4603'
    },
  }]
};
