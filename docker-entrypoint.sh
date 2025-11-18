#!/bin/sh

# Don't exit on error - we want to continue even if migrations fail
set +e

echo "🚀 Starting Budgora Docker Setup..."

# Wait for MySQL to be ready
echo "⏳ Waiting for MySQL..."
until nc -z mysql 3306 > /dev/null 2>&1; do
    echo "   MySQL is unavailable - sleeping"
    sleep 2
done

echo "✅ MySQL is ready!"

# Generate app key if not set
if [ -z "$APP_KEY" ]; then
    echo "🔑 Generating application key..."
    php artisan key:generate --force || true
fi

# Run migrations (ignore errors - they may already be run)
echo "📦 Running database migrations..."
php artisan migrate --force
MIGRATE_EXIT=$?
if [ $MIGRATE_EXIT -ne 0 ]; then
    echo "⚠️  Migration completed with warnings (some may already be applied)"
fi

# Run seeders if SEED_DATABASE is set to true
if [ "$SEED_DATABASE" = "true" ]; then
    echo "🌱 Seeding database..."
    php artisan db:seed --force || true
fi

# Clear and cache config (only if not in development)
echo "🧹 Optimizing application..."
if [ "$APP_ENV" != "local" ]; then
    php artisan config:cache || true
    php artisan route:cache || true
    php artisan view:cache || true
else
    echo "   Skipping cache in local environment"
fi

# Set permissions
echo "🔐 Setting permissions..."
chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache
chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

echo "✅ Setup complete!"

# Re-enable exit on error for the main command
set -e

exec "$@"

