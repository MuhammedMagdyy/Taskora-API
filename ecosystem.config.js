module.exports = {
  apps: [
    {
      name: 'taskora-api',
      script: 'dist/index.js',
      instances: 1,
      exec_mode: 'fork',
      node_args: '--expose-gc --max-old-space-size=1024',
      max_memory_restart: '800M',
      env: {
        NODE_ENV: 'production',
      },
      max_restarts: 10,
      min_uptime: '10s',
      kill_timeout: 5000,
      watch: false,
    },
    {
      name: 'taskora-email-worker',
      script: 'dist/workers/email.worker.js',
      instances: 1,
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: 'production',
        FRONTEND_URL: 'https://taskora.live',
      },
    },
  ],
};
