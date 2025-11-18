#!/bin/bash

# Budgora Deployment Script for KVM Server
# This script automates the deployment process

set -e

echo "🚀 Budgora Deployment Script"
echo "============================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running as root - allow but warn
if [ "$EUID" -eq 0 ]; then 
   echo -e "${YELLOW}Warning: Running as root.${NC}"
   echo -e "${YELLOW}It's recommended to run as a regular user with sudo privileges.${NC}"
   # Skip prompt if NON_INTERACTIVE is set
   if [ -z "$NON_INTERACTIVE" ]; then
       read -p "Continue anyway? (y/N) " -n 1 -r
       echo
       if [[ ! $REPLY =~ ^[Yy]$ ]]; then
           exit 1
       fi
   else
       echo -e "${YELLOW}Non-interactive mode: Continuing as root...${NC}"
   fi
   SUDO_CMD=""  # Already root, no need for sudo
   # Set USER if not set (when running as root)
   if [ -z "$USER" ]; then
       USER="root"
   fi
else
   SUDO_CMD="sudo"  # Need sudo for privileged commands
fi

# Configuration
APP_DIR="/var/www/budgora"
DOMAIN="${1:-}"
EMAIL="${2:-}"

echo "Configuration:"
echo "  App Directory: $APP_DIR"
echo "  Domain: ${DOMAIN:-Not set}"
echo "  Email: ${EMAIL:-Not set}"
echo ""

# Step 1: Check Docker
echo -e "${YELLOW}Step 1: Checking Docker installation...${NC}"
if ! command -v docker &> /dev/null; then
    echo "Docker not found. Installing Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    $SUDO_CMD sh get-docker.sh
    # Only add user to docker group if not root
    if [ "$EUID" -ne 0 ]; then
        $SUDO_CMD usermod -aG docker $USER
    fi
    rm get-docker.sh
    echo -e "${GREEN}Docker installed successfully!${NC}"
    echo -e "${YELLOW}Please log out and log back in, then run this script again.${NC}"
    exit 0
else
    echo -e "${GREEN}Docker is installed${NC}"
fi

# Step 2: Check Docker Compose
echo -e "${YELLOW}Step 2: Checking Docker Compose...${NC}"
if ! docker compose version &> /dev/null; then
    echo -e "${RED}Docker Compose not found. Please install it.${NC}"
    exit 1
else
    echo -e "${GREEN}Docker Compose is installed${NC}"
fi

# Step 3: Create application directory
echo -e "${YELLOW}Step 3: Setting up application directory...${NC}"
if [ ! -d "$APP_DIR" ]; then
    $SUDO_CMD mkdir -p $APP_DIR
    $SUDO_CMD chown $USER:$USER $APP_DIR
    echo -e "${GREEN}Created directory: $APP_DIR${NC}"
else
    echo -e "${GREEN}Directory exists: $APP_DIR${NC}"
fi

# Step 4: Check if application files exist
echo -e "${YELLOW}Step 4: Checking application files...${NC}"
cd $APP_DIR

if [ ! -f "docker-compose.yml" ]; then
    echo -e "${RED}Application files not found in $APP_DIR${NC}"
    echo "Please copy your application files to $APP_DIR first."
    echo ""
    echo "You can use one of these methods:"
    echo "  1. Git: git clone <your-repo> $APP_DIR"
    echo "  2. SCP: scp -r /path/to/budgora/* user@server:$APP_DIR/"
    echo "  3. Rsync: rsync -avz /path/to/budgora/ user@server:$APP_DIR/"
    exit 1
else
    echo -e "${GREEN}Application files found${NC}"
fi

# Step 5: Set up .env file
echo -e "${YELLOW}Step 5: Setting up environment file...${NC}"
if [ ! -f ".env" ]; then
    if [ -f ".env.example" ]; then
        cp .env.example .env
        echo -e "${GREEN}Created .env from .env.example${NC}"
    else
        echo -e "${RED}.env.example not found. Please create .env manually.${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}.env file exists${NC}"
fi

# Step 6: Update .env for production
echo -e "${YELLOW}Step 6: Configuring production settings...${NC}"
if [ -n "$DOMAIN" ]; then
    sed -i "s|APP_URL=.*|APP_URL=https://$DOMAIN|" .env
    sed -i "s|APP_ENV=.*|APP_ENV=production|" .env
    sed -i "s|APP_DEBUG=.*|APP_DEBUG=false|" .env
    echo -e "${GREEN}Updated .env with domain: $DOMAIN${NC}"
fi

# Step 7: Build and start containers
echo -e "${YELLOW}Step 7: Building Docker images...${NC}"
docker compose build

echo -e "${YELLOW}Step 8: Starting containers...${NC}"
docker compose up -d

# Wait for MySQL to be ready
echo -e "${YELLOW}Waiting for MySQL to be ready...${NC}"
sleep 10

# Step 9: Generate app key
echo -e "${YELLOW}Step 9: Generating application key...${NC}"
docker compose exec app php artisan key:generate --force || true

# Step 10: Run migrations
echo -e "${YELLOW}Step 10: Running database migrations...${NC}"
docker compose exec app php artisan migrate --force || echo "Migrations may have warnings"

# Step 11: Set permissions
echo -e "${YELLOW}Step 11: Setting permissions...${NC}"
docker compose exec app chown -R www-data:www-data storage bootstrap/cache
docker compose exec app chmod -R 775 storage bootstrap/cache

# Step 12: Build assets
echo -e "${YELLOW}Step 12: Building frontend assets...${NC}"
docker compose exec app npm install
docker compose exec app npm run build

# Step 13: Optimize Laravel
echo -e "${YELLOW}Step 13: Optimizing Laravel...${NC}"
docker compose exec app php artisan config:cache
docker compose exec app php artisan route:cache
docker compose exec app php artisan view:cache

# Step 14: Set up Nginx reverse proxy (if domain provided)
if [ -n "$DOMAIN" ] && [ -n "$EMAIL" ]; then
    echo -e "${YELLOW}Step 14: Setting up Nginx and SSL...${NC}"
    
    # Install Nginx if not installed
    if ! command -v nginx &> /dev/null; then
        $SUDO_CMD apt update
        $SUDO_CMD apt install -y nginx
    fi
    
    # Create Nginx config
    $SUDO_CMD tee /etc/nginx/sites-available/$DOMAIN > /dev/null <<EOF
server {
    listen 80;
    listen [::]:80;
    server_name $DOMAIN www.$DOMAIN;
    return 301 https://\$server_name\$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name $DOMAIN www.$DOMAIN;

    ssl_certificate /etc/letsencrypt/live/$DOMAIN/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$DOMAIN/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml text/javascript application/json application/javascript application/xml+rss application/rss+xml font/truetype font/opentype application/vnd.ms-fontobject image/svg+xml;

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_set_header X-Forwarded-Host \$host;
        proxy_set_header X-Forwarded-Port \$server_port;
        
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    # Cache static assets
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        proxy_pass http://127.0.0.1:8080;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF

    # Enable site
    $SUDO_CMD ln -sf /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-enabled/
    $SUDO_CMD nginx -t
    
    # Install Certbot if not installed
    if ! command -v certbot &> /dev/null; then
        $SUDO_CMD apt install -y certbot python3-certbot-nginx
    fi
    
    # Get SSL certificate
    $SUDO_CMD certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos --email $EMAIL
    
    # Reload Nginx
    $SUDO_CMD systemctl reload nginx
    
    echo -e "${GREEN}Nginx and SSL configured!${NC}"
fi

# Step 15: Set up firewall
echo -e "${YELLOW}Step 15: Configuring firewall...${NC}"
if command -v ufw &> /dev/null; then
    $SUDO_CMD ufw allow 22/tcp
    $SUDO_CMD ufw allow 80/tcp
    $SUDO_CMD ufw allow 443/tcp
    echo -e "${GREEN}Firewall configured${NC}"
fi

echo ""
echo -e "${GREEN}✅ Deployment completed successfully!${NC}"
echo ""
echo "Application Status:"
docker compose ps
echo ""
echo "Useful commands:"
echo "  View logs: docker compose logs -f"
echo "  Restart: docker compose restart"
echo "  Stop: docker compose stop"
echo "  Start: docker compose start"
echo ""
if [ -n "$DOMAIN" ]; then
    echo -e "${GREEN}Access your application at: https://$DOMAIN${NC}"
else
    echo -e "${GREEN}Access your application at: http://$(hostname -I | awk '{print $1}'):8080${NC}"
fi
echo ""

