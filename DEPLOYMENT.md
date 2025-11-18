# Budgora Deployment Guide for KVM Server

This guide will help you deploy the Budgora application to a KVM virtual machine server.

## Quick Start (Automated)

For a quick automated deployment, use the provided deployment script:

```bash
# Transfer the script to your server
scp deploy.sh user@your-server:/tmp/

# SSH into your server
ssh user@your-server

# Run the deployment script
chmod +x /tmp/deploy.sh
/tmp/deploy.sh yourdomain.com your@email.com
```

The script will:
- Install Docker and Docker Compose (if needed)
- Set up the application directory
- Build and start containers
- Configure Nginx reverse proxy
- Set up SSL with Let's Encrypt
- Configure firewall

**Note:** You still need to transfer your application files to the server first (see Step 3.2).

## Manual Deployment

If you prefer to deploy manually, follow the steps below.

## Prerequisites

- KVM server with Ubuntu 20.04+ or Debian 11+ (recommended)
- Root or sudo access
- Domain name (optional, for production)
- SSH access to the server

## Step 1: Server Initial Setup

### 1.1 Update System Packages

```bash
sudo apt update && sudo apt upgrade -y
```

### 1.2 Install Required Packages

```bash
sudo apt install -y \
    curl \
    wget \
    git \
    unzip \
    software-properties-common \
    apt-transport-https \
    ca-certificates \
    gnupg \
    lsb-release
```

## Step 2: Install Docker and Docker Compose

### 2.1 Install Docker

```bash
# Remove old versions
sudo apt remove -y docker docker-engine docker.io containerd runc

# Add Docker's official GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Add Docker repository
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Start and enable Docker
sudo systemctl start docker
sudo systemctl enable docker

# Add your user to docker group (optional, to run docker without sudo)
sudo usermod -aG docker $USER
# Log out and log back in for this to take effect
```

### 2.2 Verify Docker Installation

```bash
docker --version
docker compose version
```

## Step 3: Deploy Application

### 3.1 Create Application Directory

```bash
sudo mkdir -p /var/www/budgora
sudo chown $USER:$USER /var/www/budgora
cd /var/www/budgora
```

### 3.2 Transfer Application Files

**Option A: Using Git (Recommended)**

```bash
# Clone your repository
git clone <your-repository-url> .

# Or if you have a private repo, use SSH:
# git clone git@github.com:yourusername/budgora.git .
```

**Option B: Using SCP (from your local machine)**

```bash
# From your local machine
scp -r /path/to/budgora/* user@your-server-ip:/var/www/budgora/
```

**Option C: Using rsync (from your local machine)**

```bash
# From your local machine
rsync -avz --exclude 'node_modules' --exclude '.git' \
  /path/to/budgora/ user@your-server-ip:/var/www/budgora/
```

### 3.3 Set Up Environment File

```bash
cd /var/www/budgora

# Create .env file
cp .env.example .env

# Edit .env file with production settings
nano .env
```

**Important .env settings for production:**

```env
APP_NAME=Budgora
APP_ENV=production
APP_KEY=  # Will be generated
APP_DEBUG=false
APP_URL=https://yourdomain.com

LOG_CHANNEL=stack
LOG_LEVEL=error

DB_CONNECTION=mysql
DB_HOST=mysql
DB_PORT=3306
DB_DATABASE=budgora_production
DB_USERNAME=budgora
DB_PASSWORD=your_secure_password_here

# Mail Configuration (if needed)
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS="noreply@yourdomain.com"
MAIL_FROM_NAME="${APP_NAME}"
```

### 3.4 Use Production Docker Compose

For production, use the provided `docker-compose.prod.yml`:

```bash
# Copy production compose file
cp docker-compose.prod.yml docker-compose.yml

# Or use it directly
docker compose -f docker-compose.prod.yml up -d
```

The production compose file:
- Uses `production` build target
- Binds MySQL and Nginx to localhost only (use reverse proxy)
- Sets `APP_ENV=production` and `APP_DEBUG=false`

## Step 4: Build and Start Containers

### 4.1 Build Docker Images

```bash
cd /var/www/budgora

# For production, use production compose file
docker compose -f docker-compose.prod.yml build

# Or if you copied it to docker-compose.yml
docker compose build
```

### 4.2 Start Services

```bash
# For production
docker compose -f docker-compose.prod.yml up -d

# Or if using docker-compose.yml
docker compose up -d
```

### 4.3 Generate Application Key

```bash
# If using production compose file
docker compose -f docker-compose.prod.yml exec app php artisan key:generate --force

# Or if using docker-compose.yml
docker compose exec app php artisan key:generate --force
```

### 4.4 Run Migrations

```bash
docker compose -f docker-compose.prod.yml exec app php artisan migrate --force
# Or: docker compose exec app php artisan migrate --force
```

### 4.5 Seed Database (Optional)

```bash
docker compose -f docker-compose.prod.yml exec app php artisan db:seed --force
# Or: docker compose exec app php artisan db:seed --force
```

### 4.6 Set Permissions

```bash
docker compose -f docker-compose.prod.yml exec app chown -R www-data:www-data storage bootstrap/cache
docker compose -f docker-compose.prod.yml exec app chmod -R 775 storage bootstrap/cache
# Or: docker compose exec app chown -R www-data:www-data storage bootstrap/cache
```

### 4.7 Build Frontend Assets

**Note:** Frontend assets are built during Docker image build in production. If you need to rebuild:

```bash
docker compose -f docker-compose.prod.yml exec app npm run build
# Or: docker compose exec app npm run build
```

## Step 5: Configure Nginx Reverse Proxy (Optional but Recommended)

If you want to use a domain name and SSL, set up Nginx as a reverse proxy.

### 5.1 Install Nginx on Host

```bash
sudo apt install -y nginx
```

### 5.2 Create Nginx Configuration

```bash
sudo nano /etc/nginx/sites-available/budgora
```

Add the following configuration:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    # SSL Configuration (will be set up with Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Proxy to Docker container
    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Host $host;
        proxy_set_header X-Forwarded-Port $server_port;
        
        # WebSocket support (if needed)
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    # Increase timeouts for large requests
    proxy_connect_timeout 60s;
    proxy_send_timeout 60s;
    proxy_read_timeout 60s;
}
```

### 5.3 Enable Site

```bash
sudo ln -s /etc/nginx/sites-available/budgora /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## Step 6: SSL Certificate with Let's Encrypt

### 6.1 Install Certbot

```bash
sudo apt install -y certbot python3-certbot-nginx
```

### 6.2 Obtain SSL Certificate

```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

Follow the prompts. Certbot will automatically configure Nginx.

### 6.3 Auto-renewal

Certbot sets up auto-renewal automatically. Test it:

```bash
sudo certbot renew --dry-run
```

## Step 7: Firewall Configuration

### 7.1 Configure UFW (Uncomplicated Firewall)

```bash
# Allow SSH
sudo ufw allow 22/tcp

# Allow HTTP and HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status
```

## Step 8: Production Optimizations

### 8.1 Optimize Laravel

```bash
docker compose exec app php artisan config:cache
docker compose exec app php artisan route:cache
docker compose exec app php artisan view:cache
docker compose exec app php artisan event:cache
```

### 8.2 Set Up Log Rotation

Create log rotation config:

```bash
sudo nano /etc/logrotate.d/budgora
```

Add:

```
/var/www/budgora/storage/logs/*.log {
    daily
    missingok
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 www-data www-data
    sharedscripts
}
```

## Step 9: Monitoring and Maintenance

### 9.1 Check Container Status

```bash
docker compose ps
docker compose logs -f app
```

### 9.2 Set Up Automated Backups

Create backup script:

```bash
sudo nano /usr/local/bin/budgora-backup.sh
```

Add:

```bash
#!/bin/bash
BACKUP_DIR="/backups/budgora"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR

# Backup database
docker compose exec -T mysql mysqldump -u root -prootpassword budgora_production > $BACKUP_DIR/db_$DATE.sql

# Backup files
tar -czf $BACKUP_DIR/files_$DATE.tar.gz /var/www/budgora/storage

# Remove backups older than 7 days
find $BACKUP_DIR -type f -mtime +7 -delete

echo "Backup completed: $DATE"
```

Make it executable:

```bash
sudo chmod +x /usr/local/bin/budgora-backup.sh
```

Add to crontab:

```bash
sudo crontab -e
```

Add:

```
0 2 * * * /usr/local/bin/budgora-backup.sh
```

### 9.3 Health Check Script

```bash
sudo nano /usr/local/bin/budgora-healthcheck.sh
```

Add:

```bash
#!/bin/bash
if ! docker compose ps | grep -q "Up"; then
    echo "Alert: Budgora containers are down!"
    # Send notification (email, Slack, etc.)
fi
```

## Step 10: Quick Reference Commands

```bash
# View logs
docker compose logs -f app
docker compose logs -f nginx
docker compose logs -f mysql

# Restart services
docker compose restart

# Stop services
docker compose stop

# Start services
docker compose start

# Rebuild after code changes
docker compose up -d --build

# Run artisan commands
docker compose exec app php artisan <command>

# Access MySQL
docker compose exec mysql mysql -u root -prootpassword budgora_production

# Clear caches
docker compose exec app php artisan cache:clear
docker compose exec app php artisan config:clear
docker compose exec app php artisan route:clear
docker compose exec app php artisan view:clear

# Update application
cd /var/www/budgora
git pull
docker compose up -d --build
docker compose exec app php artisan migrate --force
docker compose exec app php artisan config:cache
docker compose exec app php artisan route:cache
```

## Troubleshooting

### Container won't start

```bash
# Check logs
docker compose logs app

# Check if ports are in use
sudo netstat -tulpn | grep :8080
```

### Database connection issues

```bash
# Check MySQL container
docker compose ps mysql
docker compose logs mysql

# Test connection
docker compose exec app php artisan tinker
# Then: DB::connection()->getPdo();
```

### Permission issues

```bash
docker compose exec app chown -R www-data:www-data storage bootstrap/cache
docker compose exec app chmod -R 775 storage bootstrap/cache
```

### Out of disk space

```bash
# Clean up Docker
docker system prune -a

# Check disk usage
df -h
```

## Security Checklist

- [ ] Change default database passwords
- [ ] Set `APP_DEBUG=false` in production
- [ ] Use strong `APP_KEY`
- [ ] Configure firewall (UFW)
- [ ] Set up SSL certificate
- [ ] Regular security updates: `sudo apt update && sudo apt upgrade`
- [ ] Configure backup strategy
- [ ] Set up log monitoring
- [ ] Review file permissions
- [ ] Use environment variables for secrets
- [ ] Disable unnecessary services

## Next Steps

1. Set up monitoring (e.g., Prometheus, Grafana)
2. Configure email notifications
3. Set up CI/CD pipeline
4. Configure automated testing
5. Set up staging environment

## Support

For issues, check:
- Application logs: `docker compose logs -f`
- Nginx logs: `/var/log/nginx/error.log`
- System logs: `journalctl -xe`

