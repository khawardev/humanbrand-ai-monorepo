#!/bin/bash
set -e

echo "Stopping BrandOS application..."
sudo systemctl stop brandos-frontend || true
echo "Stopped."