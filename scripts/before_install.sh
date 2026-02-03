#!/bin/bash
set -e

echo "Before Install: Cleaning up old deployment files..."

# Stop the service if it's running
sudo systemctl stop aiagcam.service || true

# Backup .env file
if [ -f /opt/app/.env ]; then
    echo "Backing up .env file..."
    sudo cp /opt/app/.env /tmp/.env.backup
fi

# Remove old files (but keep .env)
if [ -d /opt/app ]; then
    echo "Removing old application files..."
    sudo find /opt/app -mindepth 1 ! -name '.env' -delete
fi

# Create directory if it doesn't exist
sudo mkdir -p /opt/app

# Restore .env file
if [ -f /tmp/.env.backup ]; then
    echo "Restoring .env file..."
    sudo mv /tmp/.env.backup /opt/app/.env
    sudo chown ubuntu:ubuntu /opt/app/.env
fi

echo "Before Install: Cleanup complete"
