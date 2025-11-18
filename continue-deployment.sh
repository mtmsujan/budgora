#!/bin/bash

# Quick script to continue deployment from Step 8.5 onwards
# Run this if deployment failed at Step 13

set -e

echo "🔄 Continuing Budgora Deployment"
echo "================================"
echo ""

# Detect Docker Compose command
if docker compose version &> /dev/null; then
    DOCKER_COMPOSE_CMD="docker compose"
elif docker-compose version &> /dev/null; then
    DOCKER_COMPOSE_CMD="docker-compose"
else
    echo "❌ Docker Compose not found!"
    exit 1
fi

cd /var/www/budgora

# Step 8.5: Install Composer dependencies
echo "📦 Step 8.5: Installing Composer dependencies..."
$DOCKER_COMPOSE_CMD exec app sh -c "[ ! -d vendor ] && composer install --optimize-autoloader --no-interaction || echo 'Composer dependencies already installed'"

# Step 9: Generate app key (if not already done)
echo "🔑 Step 9: Generating application key..."
$DOCKER_COMPOSE_CMD exec app php artisan key:generate --force || echo "App key already exists"

# Step 10: Run migrations
echo "📦 Step 10: Running database migrations..."
$DOCKER_COMPOSE_CMD exec app php artisan migrate --force || echo "Migrations may have warnings"

# Step 11: Set permissions
echo "🔐 Step 11: Setting permissions..."
$DOCKER_COMPOSE_CMD exec app chown -R www-data:www-data storage bootstrap/cache
$DOCKER_COMPOSE_CMD exec app chmod -R 775 storage bootstrap/cache

# Step 12: Build assets (if needed - assets were already built, but rebuild to ensure no errors)
echo "🎨 Step 12: Rebuilding frontend assets (to fix duplicate key errors)..."
$DOCKER_COMPOSE_CMD exec app npm run build

# Step 13: Optimize Laravel
echo "⚡ Step 13: Optimizing Laravel..."
$DOCKER_COMPOSE_CMD exec app php artisan config:cache
$DOCKER_COMPOSE_CMD exec app php artisan route:cache
$DOCKER_COMPOSE_CMD exec app php artisan view:cache

echo ""
echo "✅ Deployment continuation completed!"
echo ""
echo "Application Status:"
$DOCKER_COMPOSE_CMD ps

