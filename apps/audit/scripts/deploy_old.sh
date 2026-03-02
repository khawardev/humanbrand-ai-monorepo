#!/bin/bash
set -e
exec > /opt/app/logs/deploy.log 2>&1

APP_DIR="/opt/app"
cd "$APP_DIR"

# Ensure logs directory exists and set permissions
mkdir -p logs
chmod -R 755 logs
chown -R ubuntu:ubuntu "$APP_DIR"

# Kill process using port 3000
sudo fuser -k 3000/tcp || true

# Stop PM2 app if it exists
pm2 delete Audit || true

# Install dependencies and build
npm install
npm run build

# Remove .next cache
rm -rf .next/cache

# Start app cleanly
pm2 start ecosystem.config.js --only Audit --update-env
