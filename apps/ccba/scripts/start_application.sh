#!/bin/bash
set -e

echo "Starting BrandOS application via systemd..."

sudo systemctl daemon-reload
sudo systemctl enable brandos-frontend
sudo systemctl restart brandos-frontend

echo "BrandOS frontend started."
