# Deployment Guide for budgora.xyz

This is a specific deployment guide for hosting Budgora at **budgora.xyz**.

## Prerequisites

- KVM server with Ubuntu 20.04+ or Debian 11+
- Domain `budgora.xyz` DNS configured to point to your server IP
- SSH access to your server
- Email address for Let's Encrypt SSL certificate

## Step 1: DNS Configuration

Before deploying, ensure your DNS is configured:

```
Type    Name    Value           TTL
A       @       YOUR_SERVER_IP  3600
A       www     YOUR_SERVER_IP  3600
```

Or if using a subdomain:
```
Type    Name    Value           TTL
A       app     YOUR_SERVER_IP  3600
```

**Verify DNS is working:**
```bash
# From your local machine
nslookup budgora.xyz
ping budgora.xyz
```

## Step 2: Transfer Application Files

### Option A: Using Git (Recommended)

```bash
# SSH into your server
ssh user@your-server-ip

# Create application directory
sudo mkdir -p /var/www/budgora
sudo chown $USER:$USER /var/www/budgora
cd /var/www/budgora

# Clone your repository
git clone <your-repository-url> .

# Or if you have a private repo
git clone git@github.com:yourusername/budgora.git .
```

### Option B: Using SCP (from your local machine)

```bash
# From your local machine
scp -r /Users/mdtoriqulmowla/Herd/budgora/* user@your-server-ip:/var/www/budgora/
```

### Option C: Using rsync (from your local machine)

```bash
# From your local machine
rsync -avz --exclude 'node_modules' --exclude '.git' \
  /Users/mdtoriqulmowla/Herd/budgora/ user@your-server-ip:/var/www/budgora/
```

## Step 3: Run Automated Deployment

### 3.1 Transfer Deployment Script

```bash
# From your local machine
scp deploy.sh user@your-server-ip:/tmp/
```

### 3.2 SSH into Server and Run Script

```bash
ssh user@your-server-ip

# Make script executable
chmod +x /tmp/deploy.sh

# Run deployment (replace with your email)
cd /var/www/budgora
/tmp/deploy.sh budgora.xyz your-email@example.com
```

The script will automatically:
- Install Docker and Docker Compose
- Build and start containers
- Configure Nginx reverse proxy
- Set up SSL certificate for budgora.xyz
- Configure firewall

## Step 4: Manual Configuration (If Needed)

### 4.1 Update .env File

```bash
cd /var/www/budgora
nano .env
```

Ensure these settings:

```env
APP_NAME=Budgora
APP_ENV=production
APP_DEBUG=false
APP_URL=https://budgora.xyz

DB_CONNECTION=mysql
DB_HOST=mysql
DB_PORT=3306
DB_DATABASE=budgora_production
DB_USERNAME=root
DB_PASSWORD=your_secure_password_here

# Mail Configuration (update with your SMTP settings)
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS="noreply@budgora.xyz"
MAIL_FROM_NAME="Budgora"
```

### 4.2 Use Production Docker Compose

```bash
cd /var/www/budgora
cp docker-compose.prod.yml docker-compose.yml
```

### 4.3 Build and Start

```bash
# Build images
docker compose build

# Start services
docker compose up -d

# Wait for MySQL
sleep 10

# Generate app key
docker compose exec app php artisan key:generate --force

# Run migrations
docker compose exec app php artisan migrate --force

# Seed database (optional)
docker compose exec app php artisan db:seed --force

# Set permissions
docker compose exec app chown -R www-data:www-data storage bootstrap/cache
docker compose exec app chmod -R 775 storage bootstrap/cache

# Optimize Laravel
docker compose exec app php artisan config:cache
docker compose exec app php artisan route:cache
docker compose exec app php artisan view:cache
```

## Step 5: Configure Nginx for budgora.xyz

### 5.1 Install Nginx (if not installed)

```bash
sudo apt update
sudo apt install -y nginx
```

### 5.2 Create Nginx Configuration

```bash
sudo nano /etc/nginx/sites-available/budgora.xyz
```

Add this configuration:

```nginx
# HTTP to HTTPS redirect
server {
    listen 80;
    listen [::]:80;
    server_name budgora.xyz www.budgora.xyz;
    return 301 https://$server_name$request_uri;
}

# HTTPS server
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name budgora.xyz www.budgora.xyz;

    # SSL Configuration (will be set up with Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/budgora.xyz/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/budgora.xyz/privkey.pem;
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

    # Proxy to Docker container
    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Host $host;
        proxy_set_header X-Forwarded-Port $server_port;
        
        # WebSocket support
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Cache static assets
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        proxy_pass http://127.0.0.1:8080;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### 5.3 Enable Site

```bash
sudo ln -s /etc/nginx/sites-available/budgora.xyz /etc/nginx/sites-enabled/
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
sudo certbot --nginx -d budgora.xyz -d www.budgora.xyz --email your-email@example.com --agree-tos --non-interactive
```

### 6.3 Test Auto-renewal

```bash
sudo certbot renew --dry-run
```

## Step 7: Firewall Configuration

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

## Step 8: Verify Deployment

### 8.1 Check Containers

```bash
cd /var/www/budgora
docker compose ps
```

All containers should be "Up".

### 8.2 Check Application

Visit in your browser:
- https://budgora.xyz
- https://www.budgora.xyz

### 8.3 Check Logs

```bash
# Application logs
docker compose logs -f app

# Nginx logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

## Step 9: Post-Deployment Tasks

### 9.1 Create Admin User (if not seeded)

```bash
docker compose exec app php artisan tinker
```

Then in tinker:
```php
$user = \App\Models\User::create([
    'name' => 'Admin',
    'email' => 'admin@budgora.xyz',
    'password' => Hash::make('your-secure-password'),
]);
```

### 9.2 Set Up Backups

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

cd /var/www/budgora

# Backup database
docker compose exec -T mysql mysqldump -u root -prootpassword budgora_production > $BACKUP_DIR/db_$DATE.sql

# Backup files
tar -czf $BACKUP_DIR/files_$DATE.tar.gz storage

# Remove backups older than 7 days
find $BACKUP_DIR -type f -mtime +7 -delete

echo "Backup completed: $DATE"
```

Make executable:

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

## Step 10: Useful Commands

```bash
# View logs
docker compose logs -f app
docker compose logs -f nginx
docker compose logs -f mysql

# Restart services
docker compose restart

# Update application
cd /var/www/budgora
git pull
docker compose up -d --build
docker compose exec app php artisan migrate --force
docker compose exec app php artisan config:cache
docker compose exec app php artisan route:cache

# Clear caches
docker compose exec app php artisan cache:clear
docker compose exec app php artisan config:clear
docker compose exec app php artisan route:clear
docker compose exec app php artisan view:clear

# Access MySQL
docker compose exec mysql mysql -u root -prootpassword budgora_production
```

## Troubleshooting

### Application not accessible

1. Check containers: `docker compose ps`
2. Check Nginx: `sudo systemctl status nginx`
3. Check firewall: `sudo ufw status`
4. Check DNS: `nslookup budgora.xyz`

### SSL certificate issues

1. Check certificate: `sudo certbot certificates`
2. Renew manually: `sudo certbot renew`
3. Check Nginx config: `sudo nginx -t`

### Database connection issues

1. Check MySQL container: `docker compose ps mysql`
2. Test connection: `docker compose exec app php artisan tinker`
   Then: `DB::connection()->getPdo();`

## Security Checklist

- [x] Domain configured: budgora.xyz
- [ ] Strong database passwords set
- [ ] `APP_DEBUG=false` in production
- [ ] SSL certificate installed
- [ ] Firewall configured
- [ ] Regular backups scheduled
- [ ] Strong admin password set
- [ ] Email configuration updated
- [ ] Log monitoring set up

## Support

Your application is now live at:
- **Production URL:** https://budgora.xyz
- **Admin Login:** Use the credentials from your seeder or create a new admin user

For issues, check:
- Application logs: `docker compose logs -f`
- Nginx logs: `/var/log/nginx/error.log`
- System logs: `journalctl -xe`

