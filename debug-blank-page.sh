#!/bin/bash

# Script to debug blank page issue

set -e

echo "🔍 Debugging blank page issue..."
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

echo "1. Checking container status..."
$DOCKER_COMPOSE_CMD ps
echo ""

echo "2. Checking application logs (last 50 lines)..."
$DOCKER_COMPOSE_CMD logs --tail=50 app
echo ""

echo "3. Checking Nginx logs (last 50 lines)..."
$DOCKER_COMPOSE_CMD logs --tail=50 nginx
echo ""

echo "4. Checking if PHP-FPM is responding..."
$DOCKER_COMPOSE_CMD exec app php -v
echo ""

echo "5. Checking Laravel configuration..."
$DOCKER_COMPOSE_CMD exec app php artisan config:show app.url
echo ""

echo "6. Testing route..."
$DOCKER_COMPOSE_CMD exec app php artisan route:list | head -10
echo ""

echo "7. Checking storage permissions..."
$DOCKER_COMPOSE_CMD exec app ls -la storage/logs/ | head -5
echo ""

echo "8. Checking for PHP errors in storage/logs..."
$DOCKER_COMPOSE_CMD exec app tail -20 storage/logs/laravel.log 2>/dev/null || echo "No log file found"
echo ""

echo "9. Testing direct PHP execution..."
$DOCKER_COMPOSE_CMD exec app php artisan tinker --execute="echo 'Laravel is working!';"
echo ""

echo "10. Checking .env file..."
$DOCKER_COMPOSE_CMD exec app grep -E "APP_|DB_" .env | head -10
echo ""

echo "✅ Debug information collected!"
echo ""
echo "Common fixes:"
echo "1. Clear caches: docker compose exec app php artisan cache:clear && php artisan config:clear && php artisan route:clear && php artisan view:clear"
echo "2. Check Nginx error logs: docker compose logs nginx"
echo "3. Check application logs: docker compose logs app"
echo "4. Restart containers: docker compose restart"

