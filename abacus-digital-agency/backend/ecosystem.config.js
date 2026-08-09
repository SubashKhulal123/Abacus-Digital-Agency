/**
 * PM2 process manager configuration.
 *
 * Usage:
 *   npm install -g pm2
 *   pm2 start ecosystem.config.js --env production
 *   pm2 save && pm2 startup   # persist across server reboots
 *
 * Common commands:
 *   pm2 status                 # view process status
 *   pm2 logs abacus-api        # tail logs
 *   pm2 reload abacus-api      # zero-downtime reload after a deploy
 *   pm2 monit                  # live CPU/memory dashboard
 */
module.exports = {
  apps: [
    {
      name: 'abacus-api',
      script: 'server.js',
      cwd: __dirname,
      instances: 'max', // cluster mode — one worker per CPU core
      exec_mode: 'cluster',
      watch: false, // never watch/auto-restart on file change in production
      max_memory_restart: '400M',
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
      error_file: './src/utils/logs/pm2-error.log',
      out_file: './src/utils/logs/pm2-out.log',
      merge_logs: true,
      time: true,
    },
  ],
};
