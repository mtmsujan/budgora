FROM php:8.2-fpm-alpine AS base

# Install system dependencies
RUN apk add --no-cache \
    git \
    curl \
    libpng-dev \
    libzip-dev \
    zip \
    unzip \
    oniguruma-dev \
    mysql-client \
    nodejs \
    npm \
    bash \
    netcat-openbsd

# Install PHP extensions
RUN docker-php-ext-install \
    pdo_mysql \
    mbstring \
    exif \
    pcntl \
    bcmath \
    gd \
    zip

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Copy composer files
COPY composer.json composer.lock ./

# Install PHP dependencies without scripts (artisan doesn't exist yet)
RUN composer install --no-dev --optimize-autoloader --no-interaction --prefer-dist --no-scripts || \
    composer install --optimize-autoloader --no-interaction --prefer-dist --no-scripts

# Copy application files (including artisan)
COPY . .

# Run composer scripts now that artisan exists
RUN composer dump-autoload --optimize && \
    php artisan package:discover --ansi || true

# Copy entrypoint script
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Set permissions
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html/storage \
    && chmod -R 755 /var/www/html/bootstrap/cache

# Development stage (default)
FROM base AS development

# Install all dependencies including dev (scripts will run automatically)
RUN composer install --optimize-autoloader --no-interaction --prefer-dist

# Expose port
EXPOSE 9000

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["php-fpm"]

# Production stage
FROM base AS production

# Install production dependencies only (scripts will run automatically)
RUN composer install --no-dev --optimize-autoloader --no-interaction --prefer-dist

# Build frontend assets
RUN npm ci --only=production && npm run build

# Expose port
EXPOSE 9000

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["php-fpm"]

