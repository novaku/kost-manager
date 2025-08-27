# Deployment Guide - Kost Manager

## Overview

This guide covers deployment options for the Kost Manager application, from development to production environments. The application is designed to work on various hosting platforms including shared hosting, VPS, and cloud platforms.

## Prerequisites

### System Requirements

**Minimum Requirements:**
- PHP 8.2 or higher
- MySQL 8.0 or PostgreSQL 13
- Node.js 18+ (for building frontend assets)
- Composer 2.x
- 512MB RAM minimum (2GB+ recommended)

**PHP Extensions:**
- BCMath
- Ctype
- Fileinfo
- JSON
- Mbstring
- OpenSSL
- PDO
- Tokenizer
- XML
- GD or Imagick (for image processing)

## Environment Configuration

### 1. Environment Variables

Create `.env` file from `.env.example`:

```bash
cp .env.example .env
```

**Key Configuration Values:**

```env
# Application
APP_NAME="Kost Manager"
APP_ENV=production
APP_KEY=base64:your-32-character-secret-key
APP_DEBUG=false
APP_URL=https://yourdomain.com

# Database
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=kost_manager
DB_USERNAME=your_username
DB_PASSWORD=your_secure_password

# Cache & Session
CACHE_DRIVER=redis
SESSION_DRIVER=redis
QUEUE_CONNECTION=redis

# Redis
REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

# Mail Configuration
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=your_username
MAIL_PASSWORD=your_password
MAIL_ENCRYPTION=tls

# Payment Gateway (Midtrans)
MIDTRANS_SERVER_KEY=your_server_key
MIDTRANS_CLIENT_KEY=your_client_key
MIDTRANS_IS_PRODUCTION=true

# File Storage
FILESYSTEM_DISK=public
```

### 2. Generate Application Key

```bash
php artisan key:generate
```

## Deployment Methods

### Option 1: Shared Hosting (cPanel)

Most cost-effective option for small to medium applications.

#### Step 1: Prepare Files

1. **Build frontend assets locally:**
```bash
npm install
npm run build
```

2. **Create deployment package:**
```bash
# Remove development files
rm -rf node_modules
rm -rf .git
rm package-lock.json

# Create zip file
zip -r kost-manager.zip .
```

#### Step 2: Upload to cPanel

1. Upload `kost-manager.zip` to cPanel File Manager
2. Extract to a temporary folder (not public_html)
3. Move contents of `public/` folder to `public_html/`
4. Move remaining files to a folder above `public_html/` (e.g., `laravel/`)

#### Step 3: Configure File Paths

Update `public_html/index.php`:

```php
<?php
// Change these paths to point to your Laravel folder
require __DIR__.'/../laravel/vendor/autoload.php';
$app = require_once __DIR__.'/../laravel/bootstrap/app.php';
```

#### Step 4: Database Setup

1. Create MySQL database in cPanel
2. Update `.env` with database credentials
3. Run migrations via SSH or Laravel Artisan commands

#### Step 5: Set Permissions

```bash
chmod -R 755 storage/
chmod -R 755 bootstrap/cache/
```

### Option 2: VPS/Cloud Server (Ubuntu)

More control and scalability for growing applications.

#### Step 1: Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install required packages
sudo apt install nginx mysql-server php8.2-fpm php8.2-mysql \
    php8.2-mbstring php8.2-xml php8.2-curl php8.2-zip \
    php8.2-bcmath php8.2-gd redis-server -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install nodejs -y

# Install Composer
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer
```

#### Step 2: Deploy Application

```bash
# Clone repository
cd /var/www/
sudo git clone https://github.com/your-repo/kost-manager.git
cd kost-manager

# Install dependencies
sudo composer install --optimize-autoloader --no-dev
sudo npm install && npm run build

# Set permissions
sudo chown -R www-data:www-data /var/www/kost-manager
sudo chmod -R 755 /var/www/kost-manager
sudo chmod -R 775 /var/www/kost-manager/storage
sudo chmod -R 775 /var/www/kost-manager/bootstrap/cache
```

#### Step 3: Configure Nginx

Create `/etc/nginx/sites-available/kost-manager`:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    root /var/www/kost-manager/public;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    index index.php;

    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/kost-manager /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

#### Step 4: SSL Certificate (Let's Encrypt)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Generate SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

#### Step 5: Database Setup

```bash
# Secure MySQL installation
sudo mysql_secure_installation

# Create database and user
sudo mysql -u root -p
```

```sql
CREATE DATABASE kost_manager;
CREATE USER 'kost_user'@'localhost' IDENTIFIED BY 'secure_password';
GRANT ALL PRIVILEGES ON kost_manager.* TO 'kost_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

#### Step 6: Application Configuration

```bash
# Configure environment
cd /var/www/kost-manager
sudo cp .env.example .env
sudo nano .env  # Update configuration

# Generate key and run migrations
sudo php artisan key:generate
sudo php artisan migrate --force
sudo php artisan config:cache
sudo php artisan route:cache
sudo php artisan view:cache
```

### Option 3: Docker Deployment

Containerized deployment for consistency across environments.

#### Step 1: Create Dockerfile

```dockerfile
FROM php:8.2-fpm

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Install Node.js
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs

# Set working directory
WORKDIR /var/www

# Copy application files
COPY . .

# Install dependencies
RUN composer install --optimize-autoloader --no-dev
RUN npm install && npm run build

# Set permissions
RUN chown -R www-data:www-data /var/www \
    && chmod -R 755 /var/www \
    && chmod -R 775 /var/www/storage \
    && chmod -R 775 /var/www/bootstrap/cache

EXPOSE 9000
CMD ["php-fpm"]
```

#### Step 2: Docker Compose

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  app:
    build: .
    container_name: kost-manager-app
    restart: unless-stopped
    working_dir: /var/www
    volumes:
      - ./:/var/www
    networks:
      - kost-manager

  webserver:
    image: nginx:alpine
    container_name: kost-manager-nginx
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./:/var/www
      - ./docker/nginx:/etc/nginx/conf.d
    networks:
      - kost-manager

  db:
    image: mysql:8.0
    container_name: kost-manager-db
    restart: unless-stopped
    environment:
      MYSQL_DATABASE: kost_manager
      MYSQL_USER: kost_user
      MYSQL_PASSWORD: secure_password
      MYSQL_ROOT_PASSWORD: root_password
    volumes:
      - dbdata:/var/lib/mysql
    networks:
      - kost-manager

  redis:
    image: redis:alpine
    container_name: kost-manager-redis
    restart: unless-stopped
    networks:
      - kost-manager

networks:
  kost-manager:
    driver: bridge

volumes:
  dbdata:
    driver: local
```

#### Step 3: Deploy with Docker

```bash
# Build and start containers
docker-compose up -d --build

# Run migrations
docker-compose exec app php artisan migrate --force

# Generate application key
docker-compose exec app php artisan key:generate
```

## Post-Deployment Configuration

### 1. Performance Optimization

```bash
# Optimize Composer autoloader
composer install --optimize-autoloader --no-dev

# Cache configuration
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Queue workers (for background jobs)
php artisan queue:work --daemon
```

### 2. Monitoring Setup

Create monitoring script `/var/www/kost-manager/monitor.sh`:

```bash
#!/bin/bash

# Check if application is responding
curl -f http://yourdomain.com/api/health || exit 1

# Check database connection
php artisan tinker --execute="DB::connection()->getPdo();" || exit 1

# Check storage permissions
test -w storage/logs || exit 1

echo "All checks passed"
```

### 3. Backup Strategy

Create backup script `/var/www/kost-manager/backup.sh`:

```bash
#!/bin/bash

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backup/kost-manager"

# Create backup directory
mkdir -p $BACKUP_DIR

# Database backup
mysqldump -u kost_user -p kost_manager > $BACKUP_DIR/db_$DATE.sql

# File backup
tar -czf $BACKUP_DIR/files_$DATE.tar.gz /var/www/kost-manager \
    --exclude=/var/www/kost-manager/node_modules \
    --exclude=/var/www/kost-manager/vendor

# Keep only last 7 days of backups
find $BACKUP_DIR -type f -mtime +7 -delete
```

Set up cron job:
```bash
# Add to crontab (crontab -e)
0 2 * * * /var/www/kost-manager/backup.sh
```

### 4. SSL and Security

```bash
# Force HTTPS in production
echo "APP_URL=https://yourdomain.com" >> .env

# Set up security headers in Nginx
add_header X-Frame-Options "SAMEORIGIN";
add_header X-Content-Type-Options "nosniff";
add_header X-XSS-Protection "1; mode=block";
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains";
```

## Troubleshooting

### Common Issues

1. **Permission Errors:**
```bash
sudo chown -R www-data:www-data storage/
sudo chmod -R 775 storage/
```

2. **Database Connection:**
```bash
php artisan tinker
DB::connection()->getPdo();
```

3. **Clear Caches:**
```bash
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear
```

4. **File Not Found (404):**
- Check Nginx configuration
- Verify document root points to `public/` folder
- Ensure `.htaccess` is present (Apache)

### Log Files

Monitor these log files for issues:
- Laravel: `storage/logs/laravel.log`
- Nginx: `/var/log/nginx/error.log`
- PHP: `/var/log/php8.2-fpm.log`
- MySQL: `/var/log/mysql/error.log`

## Scaling Considerations

### Horizontal Scaling

1. **Load Balancer Setup**
2. **Database Read Replicas**
3. **Redis Cluster for Sessions**
4. **CDN for Static Assets**

### Vertical Scaling

1. **Increase Server Resources**
2. **Optimize Database Queries**
3. **Implement Caching Strategies**
4. **Use Queue Workers for Heavy Tasks**

## Maintenance

### Regular Tasks

1. **Update Dependencies:**
```bash
composer update
npm update
```

2. **Monitor Disk Space:**
```bash
df -h
du -sh storage/logs/*
```

3. **Database Maintenance:**
```bash
# Optimize tables
php artisan migrate:status
```

4. **Security Updates:**
```bash
sudo apt update && sudo apt upgrade
```

This deployment guide covers the most common scenarios for deploying the Kost Manager application. Choose the deployment method that best fits your infrastructure needs and budget.
