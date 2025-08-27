# Kost Manager - Boarding House Management Application

A mobile-first boarding house (kostan) management web application built with Laravel 12 and React.

## Features

- **Multi-kostan management** for owners
- **Payment system** for monthly rent
- **Reporting dashboard** with analytics
- **Room management** with dynamic pricing
- **Monthly rental tracking** with expiry dates
- **Multi-role user system** (owners & tenants)
- **Telegram notifications** for payments and reminders

## Tech Stack

- **Backend**: Laravel 12 with REST API
- **Frontend**: React with TypeScript
- **Database**: SQLite (development) / MySQL (production)
- **Authentication**: Laravel Sanctum
- **Notifications**: Telegram Bot API
- **Styling**: Tailwind CSS
- **Build Tool**: Vite

## Getting Started

### Prerequisites

- PHP 8.2+
- Node.js 18+
- Composer
- npm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd kost-manager
```

2. Install backend dependencies:
```bash
composer install
```

3. Install frontend dependencies:
```bash
npm install
```

4. Set up environment:
```bash
cp .env.example .env
php artisan key:generate
```

5. Set up database (SQLite for development):
```bash
touch database/database.sqlite
php artisan migrate:fresh
```

### Running the Application

1. Start the Laravel server:
```bash
php artisan serve
```
Backend will be available at: http://127.0.0.1:8000

2. Start the Vite development server:
```bash
npm run dev
```
Frontend will be available at: http://localhost:5173

### User Roles

- **Kostan Owner**: Manage multiple boarding houses, rooms, pricing, tenants, reports
- **Tenant**: Browse rooms, apply for rentals, make payments, view history

### API Endpoints

- `POST /api/register` - User registration
- `POST /api/login` - User login
- `POST /api/logout` - User logout
- `GET /api/user` - Get authenticated user
- `GET /api/kostans` - List kostans
- `POST /api/kostans` - Create kostan (owners only)

### Database Schema

The application uses the following main entities:
- **Users** (owners & tenants)
- **Kostans** (boarding houses)
- **Rooms** (with pricing)
- **Rentals** (agreements)
- **Payments** (records)
- **Reviews** (feedback)
- **User Telegrams** (for notifications)

### Telegram Integration

The application includes Telegram bot integration for notifications:

1. **Setup Telegram Bot:**
```bash
# Add bot token to .env
TELEGRAM_BOT_TOKEN=your_telegram_bot_token

# Test bot setup
php artisan telegram:setup
```

2. **Get Chat ID:**
```bash
# Send /start to @kostmanager_bot, then:
php artisan telegram:get-updates
```

3. **Register User:**
```bash
php artisan telegram:manage-chats --register=+6281234567890
```

**📖 Complete Documentation**: See [docs/TELEGRAM_INDEX.md](docs/TELEGRAM_INDEX.md) for comprehensive guides.
- **Notifications** (system alerts)

### Development

The application follows Laravel best practices:
- Repository pattern for data access
- Service layer for business logic
- API resource transformers
- Role-based access control
- Comprehensive validation
- Mobile-first responsive design

### Production Deployment

For shared hosting (cPanel) deployment:
1. Upload files to public_html
2. Update database configuration in .env
3. Run migrations: `php artisan migrate`
4. Build frontend: `npm run build`
5. Configure web server to serve from public/ directory

### Contributing

1. Follow PSR-12 coding standards
2. Write tests for new features
3. Use TypeScript for all React components
4. Follow mobile-first design principles
5. Ensure compatibility with shared hosting environments

## License

This project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).

## About Laravel

Laravel is a web application framework with expressive, elegant syntax. We believe development must be an enjoyable and creative experience to be truly fulfilling. Laravel takes the pain out of development by easing common tasks used in many web projects, such as:

- [Simple, fast routing engine](https://laravel.com/docs/routing).
- [Powerful dependency injection container](https://laravel.com/docs/container).
- Multiple back-ends for [session](https://laravel.com/docs/session) and [cache](https://laravel.com/docs/cache) storage.
- Expressive, intuitive [database ORM](https://laravel.com/docs/eloquent).
- Database agnostic [schema migrations](https://laravel.com/docs/migrations).
- [Robust background job processing](https://laravel.com/docs/queues).
- [Real-time event broadcasting](https://laravel.com/docs/broadcasting).

Laravel is accessible, powerful, and provides tools required for large, robust applications.

## Learning Laravel

Laravel has the most extensive and thorough [documentation](https://laravel.com/docs) and video tutorial library of all modern web application frameworks, making it a breeze to get started with the framework.

You may also try the [Laravel Bootcamp](https://bootcamp.laravel.com), where you will be guided through building a modern Laravel application from scratch.

If you don't feel like reading, [Laracasts](https://laracasts.com) can help. Laracasts contains thousands of video tutorials on a range of topics including Laravel, modern PHP, unit testing, and JavaScript. Boost your skills by digging into our comprehensive video library.

## Laravel Sponsors

We would like to extend our thanks to the following sponsors for funding Laravel development. If you are interested in becoming a sponsor, please visit the [Laravel Partners program](https://partners.laravel.com).

### Premium Partners

- **[Vehikl](https://vehikl.com)**
- **[Tighten Co.](https://tighten.co)**
- **[Kirschbaum Development Group](https://kirschbaumdevelopment.com)**
- **[64 Robots](https://64robots.com)**
- **[Curotec](https://www.curotec.com/services/technologies/laravel)**
- **[DevSquad](https://devsquad.com/hire-laravel-developers)**
- **[Redberry](https://redberry.international/laravel-development)**
- **[Active Logic](https://activelogic.com)**

## Contributing

Thank you for considering contributing to the Laravel framework! The contribution guide can be found in the [Laravel documentation](https://laravel.com/docs/contributions).

## Code of Conduct

In order to ensure that the Laravel community is welcoming to all, please review and abide by the [Code of Conduct](https://laravel.com/docs/contributions#code-of-conduct).

## Security Vulnerabilities

If you discover a security vulnerability within Laravel, please send an e-mail to Taylor Otwell via [taylor@laravel.com](mailto:taylor@laravel.com). All security vulnerabilities will be promptly addressed.

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
