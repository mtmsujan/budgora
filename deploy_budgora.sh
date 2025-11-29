#!/usr/bin/env bash
set -e

echo "=== Budgora Laravel + Docker deploy helper ==="

# -------- CONFIG / INPUT --------
read -p "Domain (e.g. budgora.xyz): " DOMAIN
read -p "Git repo URL for Laravel app: " REPO_URL
read -p "Postgres DB name [budgora_db]: " DB_NAME
DB_NAME=${DB_NAME:-budgora_db}
read -p "Postgres DB user [budgora_user]: " DB_USER
DB_USER=${DB_USER:-budgora_user}
read -p "Postgres DB password: " DB_PASS

APP_DIR="/opt/budgora"
APP_USER="${SUDO_USER:-$(whoami)}"

echo "Using:"
echo "  Domain:        $DOMAIN"
echo "  Repo:          $REPO_URL"
echo "  App dir:       $APP_DIR"
echo "  DB name:       $DB_NAME"
echo "  DB user:       $DB_USER"

# -------- SYSTEM PREP --------
echo "=== Installing Docker & docker-compose (if needed) ==="
apt update -y
apt install -y docker.io docker-compose

systemctl enable docker || true

echo "=== Ensuring user $APP_USER is in docker group ==="
usermod -aG docker "$APP_USER" || true

# -------- APP DIRECTORY --------
echo "=== Creating app directory at $APP_DIR ==="
mkdir -p "$APP_DIR"
chown -R "$APP_USER":"$APP_USER" "$APP_DIR"

cd "$APP_DIR"

# -------- CLONE REPO --------
if [ ! -d "$APP_DIR/webroot" ]; then
  mkdir -p "$APP_DIR/webroot"
fi

chown -R "$APP_USER":"$APP_USER" "$APP_DIR/webroot"

echo "=== Cloning repository into webroot ==="
sudo -u "$APP_USER" bash -c "cd $APP_DIR/webroot && git clone '$REPO_URL' ."

# -------- PHP Dockerfile --------
echo "=== Writing php.Dockerfile ==="
cat > "$APP_DIR/php.Dockerfile" <<"EOF"
FROM php:8.2-fpm-alpine

RUN apk add --no-cache postgresql-dev \
    && docker-php-ext-install pdo pdo_pgsql
EOF

# -------- docker-compose.yml --------
echo "=== Writing docker-compose.yml ==="
cat > "$APP_DIR/docker-compose.yml" <<EOF
version: '3.8'

services:
  php:
    build:
      context: .
      dockerfile: php.Dockerfile
    container_name: budgora_php
    restart: unless-stopped
    volumes:
      - ./webroot:/var/www/html
    depends_on:
      - db

  nginx:
    image: nginx:alpine
    container_name: budgora_nginx
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    depends_on:
      - php
    volumes:
      - ./nginx.conf:/etc/nginx/conf.d/default.conf:ro
      - ./webroot:/var/www/html
      - /etc/letsencrypt:/etc/letsencrypt:ro

  db:
    image: postgres:16-alpine
    container_name: budgora_db
    restart: unless-stopped
    environment:
      POSTGRES_DB: ${DB_NAME}
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: "${DB_PASS}"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
EOF

# -------- nginx.conf --------
echo "=== Writing nginx.conf ==="
cat > "$APP_DIR/nginx.conf" <<EOF
server {
    listen 80;
    server_name ${DOMAIN} www.${DOMAIN};
    return 301 https://\$host\$request_uri;
}

server {
    listen 443 ssl;
    server_name ${DOMAIN} www.${DOMAIN};

    root /var/www/html/public;
    index index.php index.html;

    ssl_certificate /etc/letsencrypt/live/${DOMAIN}/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/${DOMAIN}/privkey.pem;

    location / {
        try_files \$uri \$uri/ /index.php?\$query_string;
    }

    location ~ \.php\$ {
        include fastcgi_params;
        fastcgi_pass php:9000;
        fastcgi_param SCRIPT_FILENAME \$document_root\$fastcgi_script_name;
    }
}
EOF

# -------- LARAVEL .env --------
echo "=== Preparing Laravel .env ==="
cd "$APP_DIR/webroot"
if [ ! -f ".env" ]; then
  cp .env.example .env 2>/dev/null || touch .env
fi

# basic DB config injection (non-destructive append)
grep -q "DB_CONNECTION" .env || cat >> .env <<EOF

APP_URL=https://${DOMAIN}

DB_CONNECTION=pgsql
DB_HOST=db
DB_PORT=5432
DB_DATABASE=${DB_NAME}
DB_USERNAME=${DB_USER}
DB_PASSWORD=${DB_PASS}

CACHE_DRIVER=file
SESSION_DRIVER=file
EOF

# -------- Bring containers up first time --------
echo "=== Building and starting containers ==="
cd "$APP_DIR"
docker-compose build php
docker-compose up -d

# -------- Generate app key --------
echo "=== Generating Laravel APP_KEY ==="
docker-compose exec php php /var/www/html/artisan key:generate || true

# -------- Fix Postgres user password explicitly --------
echo "=== Ensuring Postgres user password is synced ==="
docker-compose exec db sh -c "psql -U postgres -c \"ALTER USER ${DB_USER} WITH PASSWORD '${DB_PASS}';\"" || true

# -------- Run migrations + seed --------
echo "=== Running migrations + seed ==="
docker-compose exec php php /var/www/html/artisan migrate:fresh --seed || true

echo
echo "=== IMPORTANT: SSL step (run manually once DNS is correct) ==="
echo "1) Stop containers: cd $APP_DIR && docker-compose down"
echo "2) Run certbot:"
echo "   sudo certbot certonly --standalone -d ${DOMAIN} -d www.${DOMAIN}"
echo "3) Then: cd $APP_DIR && docker-compose up -d"
echo
echo "After that, your app should be live at: https://${DOMAIN}"
echo "=== DONE (base automation complete) ==="
