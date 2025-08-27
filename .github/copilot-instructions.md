# Boarding House Management Application

## Project Overview
Building a mobile-first boarding house (kostan) management web application with Laravel 12 backend and React frontend.

## Tech Stack
- Backend: Laravel 12 with REST/GraphQL API
- Frontend: React with mobile-first responsive design
- Database: MySQL with Redis caching
- Authentication: Laravel Sanctum/Passport
- Payment: Midtrans/Xendit integration

## Core Features
1. Multi-kostan management for owners
2. Payment system for monthly rent
3. Reporting dashboard with analytics
4. Room management with dynamic pricing
5. Monthly rental tracking with expiry dates
6. Multi-role user system (owners & tenants)

## User Roles
- **Kostan Owner**: Manage multiple boarding houses, rooms, pricing, tenants, reports
- **Tenant**: Browse rooms, apply for rentals, make payments, view history

## Database Entities
- users (owners & tenants)
- kostans (boarding houses)
- rooms (with pricing)
- rentals (agreements)
- payments (records)
- reports (financial)

## Development Guidelines
- Follow Laravel best practices (Repository pattern, Service layer)
- Use React hooks and functional components
- Mobile-first responsive design (320px, 768px, 1024px, 1200px)
- TypeScript for type safety
- Redis caching strategy
- RESTful API design
- Comprehensive testing
- Security best practices (RBAC, validation, encryption)

## Performance Requirements
- < 3s page load on 3G
- Image optimization for mobile
- Lazy loading components
- Redis caching for frequent data
- Optimized database queries

## TODO Progress
- [x] Verify copilot-instructions.md file created
- [x] Clarify Project Requirements
- [x] Scaffold the Project (Laravel 12 backend with React frontend)
- [x] Customize the Project (Database models, migrations, and basic structure)
- [x] Install Required Extensions (Node modules and PHP dependencies)
- [x] Compile the Project (Frontend assets built successfully)
- [x] Create and Run Task (Database migrations completed)
- [x] Launch the Project (Laravel development server running)
- [x] Ensure Documentation is Complete
