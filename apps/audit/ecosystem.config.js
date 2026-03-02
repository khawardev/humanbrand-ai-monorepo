module.exports = {
  apps: [{
    name: 'Audit',
    script: 'npm',
    args: 'start',
    cwd: '/opt/app',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '512M',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    exec_mode: 'fork', 
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
    error_file: '/opt/app/logs/audit-error.log',
    out_file: '/opt/app/logs/audit-out.log', 
    combine_logs: false 
  }]
};