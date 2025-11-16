# Docker Configuration

This directory contains Docker-related configuration files.

## Files

- `nginx/default.conf` - Nginx web server configuration for Laravel

## Nginx Configuration

The Nginx configuration is optimized for Laravel applications and includes:

- PHP-FPM integration
- Static file caching
- Gzip compression
- Security headers
- Proper routing for Inertia.js

The configuration forwards PHP requests to the `app` container on port 9000 (PHP-FPM).

