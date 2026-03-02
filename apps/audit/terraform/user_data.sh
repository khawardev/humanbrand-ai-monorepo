#!/bin/bash
exec > /var/log/audit-deploy.log 2>&1
set -x

# Vars (ensure these are substituted via Terraform)
app_name="audit"
APP_DIR="/opt/app"

# Update & install
apt-get update -y && apt-get upgrade -y
apt-get install -y git curl unzip

# Install Node.js LTS
curl -fsSL https://deb.nodesource.com/setup_lts.x | bash -
apt-get install -y nodejs

# Clone app
rm -rf $APP_DIR
git clone ${github_url} $APP_DIR

cd $APP_DIR

# Set env
cat > .env.local << EOF
AWS_REGION=${aws_region}
NODE_ENV=production
PORT=3000
DATABASE_URL="${database_url}"
BETTER_AUTH_SECRET="${better_auth_secret}"
BETTER_AUTH_URL="http://audit.humanbrand.ai"
GOOGLE_CLIENT_ID="${google_client_id}"
GOOGLE_CLIENT_SECRET="${google_client_secret}"
NEXT_PUBLIC_APP_URL="http://audit.humanbrand.ai"
EMAIL_USER="${email_user}"
EMAIL_PASS="${email_pass}"
SPIDER_API_KEY="${spider_api_key}"
GOOGLE_GENERATIVE_AI_API_KEY="${google_generative_ai_api_key}"
FIRECRAWL_API_KEY="${firecrawl_api_key}"

EOF

# Build
npm install
npm run build

# Create systemd service
cat << EOF | sudo tee /etc/systemd/system/audit.service
[Unit]
Description=Next.js Audit App
After=network.target

[Service]
ExecStart=/usr/bin/npm start
WorkingDirectory=$APP_DIR
Restart=always
User=ubuntu
Environment=NODE_ENV=production
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
EOF

# Permissions
mkdir -p $APP_DIR/logs
chmod -R 755 $APP_DIR
chown -R ubuntu:ubuntu $APP_DIR

# Start service
sudo systemctl daemon-reload
sudo systemctl enable audit.service
sudo systemctl restart audit.service

echo "Deployment completed"