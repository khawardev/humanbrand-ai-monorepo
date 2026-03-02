#!/bin/bash
set -e

echo "Installing dependencies..."

cd /opt/app/brandos-frontend

# Install Node.js (only if not already installed)
if ! command -v node >/dev/null 2>&1; then
  echo "Installing Node.js..."
  curl -fsSL https://deb.nodesource.com/setup_24.x | sudo -E bash -
  sudo apt-get install -y nodejs
fi

# Install dependencies
npm ci --omit=dev

# Build the Next.js app
npm run build

echo "Dependencies installed and app built."
