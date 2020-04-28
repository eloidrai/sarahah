module.exports = {
  apps : [{
    name: 'Messages anonymes',
    script: 'app.js',
    max_memory_restart: '500M',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }]
};

