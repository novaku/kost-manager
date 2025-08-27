#!/bin/bash

# Kost Manager - Local Development Setup Script
# This script clears cache, builds frontend assets, and starts Laravel server

echo "🚀 Starting Kost Manager Local Development Setup..."
echo "=================================================="

# Clear Laravel cache
echo "🧹 Clearing Laravel cache..."
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Clear composer autoload
echo "🔄 Refreshing composer autoload..."
composer dump-autoload

# Install/update npm dependencies if needed
echo "📦 Checking npm dependencies..."
npm install

# Build frontend assets
echo "🏗️  Building frontend assets..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Frontend build completed successfully!"
else
    echo "❌ Frontend build failed!"
    exit 1
fi

# Start Laravel development server
echo "🌐 Starting Laravel development server..."
# Ensure public/storage symlink exists so uploaded files are served correctly
if [ ! -e "public/storage" ]; then
    echo "🔗 public/storage not found, creating storage link..."
    php artisan storage:link
else
    echo "🔗 public/storage link exists"
fi

echo "📍 Your application will be available at: http://127.0.0.1:8000"
echo "🛑 Press Ctrl+C to stop the server"
echo "=================================================="

open -na "Google Chrome" --args --new-tab "http://127.0.0.1:8000"

php artisan serve
