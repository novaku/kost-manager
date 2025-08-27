# Database Schema Documentation - Kost Manager

## Overview

The Kost Manager application uses a relational database design optimized for managing boarding houses, rooms, rentals, and payments. The schema supports multi-tenancy with role-based access control.

## Database Configuration

- **Development**: SQLite (`database/database.sqlite`)
- **Production**: MySQL 8.0+
- **Charset**: UTF-8
- **Collation**: utf8mb4_unicode_ci

## Entity Relationship Diagram

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│    Users    │    │   Kostans   │    │    Rooms    │
│             │    │             │    │             │
│ id (PK)     │────│ owner_id    │────│ kostan_id   │
│ name        │    │ id (PK)     │    │ id (PK)     │
│ email       │    │ name        │    │ room_number │
│ role        │    │ address     │    │ type        │
│ phone       │    │ location    │    │ price       │
│ ...         │    │ ...         │    │ ...         │
└─────────────┘    └─────────────┘    └─────────────┘
       │                                       │
       │           ┌─────────────┐            │
       └───────────│   Rentals   │────────────┘
                   │             │
                   │ id (PK)     │
                   │ tenant_id   │
                   │ room_id     │
                   │ start_date  │
                   │ end_date    │
                   │ status      │
                   │ ...         │
                   └─────────────┘
                          │
                   ┌─────────────┐
                   │  Payments   │
                   │             │
                   │ id (PK)     │
                   │ rental_id   │
                   │ amount      │
                   │ status      │
                   │ ...         │
                   └─────────────┘
```

## Table Definitions

### 1. users

Stores all system users (owners and tenants).

```sql
CREATE TABLE users (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    email_verified_at TIMESTAMP NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('owner', 'tenant') NOT NULL DEFAULT 'tenant',
    phone VARCHAR(20) NULL,
    is_active BOOLEAN DEFAULT TRUE,
    remember_token VARCHAR(100) NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL
);
```

**Indexes:**
- Primary: `id`
- Unique: `email`
- Index: `role`, `is_active`

**Relationships:**
- Has many: `kostans` (as owner)
- Has many: `rentals` (as tenant)

### 2. kostans

Stores boarding house information.

```sql
CREATE TABLE kostans (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    owner_id BIGINT UNSIGNED NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT NULL,
    address TEXT NOT NULL,
    location VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NULL,
    facilities JSON NULL,
    rules JSON NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
);
```

**Indexes:**
- Primary: `id`
- Foreign: `owner_id`
- Index: `location`, `is_active`

**Relationships:**
- Belongs to: `user` (owner)
- Has many: `rooms`

**JSON Fields:**
- `facilities`: Array of facility strings
- `rules`: Array of rule strings

### 3. rooms

Stores room information within kostans.

```sql
CREATE TABLE rooms (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    kostan_id BIGINT UNSIGNED NOT NULL,
    room_number VARCHAR(50) NOT NULL,
    type ENUM('single', 'shared', 'premium') NOT NULL,
    price DECIMAL(12,2) NOT NULL,
    description TEXT NULL,
    facilities JSON NULL,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    
    FOREIGN KEY (kostan_id) REFERENCES kostans(id) ON DELETE CASCADE,
    UNIQUE KEY unique_room_per_kostan (kostan_id, room_number)
);
```

**Indexes:**
- Primary: `id`
- Foreign: `kostan_id`
- Unique: `kostan_id + room_number`
- Index: `type`, `price`, `is_available`

**Relationships:**
- Belongs to: `kostan`
- Has many: `rentals`

### 4. rentals

Stores rental agreements between tenants and rooms.

```sql
CREATE TABLE rentals (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    tenant_id BIGINT UNSIGNED NOT NULL,
    room_id BIGINT UNSIGNED NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    monthly_rent DECIMAL(12,2) NOT NULL,
    deposit DECIMAL(12,2) DEFAULT 0.00,
    status ENUM('pending', 'active', 'expired', 'terminated') DEFAULT 'pending',
    notes TEXT NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    
    FOREIGN KEY (tenant_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE
);
```

**Indexes:**
- Primary: `id`
- Foreign: `tenant_id`, `room_id`
- Index: `status`, `start_date`, `end_date`

**Relationships:**
- Belongs to: `user` (tenant)
- Belongs to: `room`
- Has many: `payments`

### 5. payments

Stores payment records for rentals.

```sql
CREATE TABLE payments (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    rental_id BIGINT UNSIGNED NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    payment_method ENUM('cash', 'bank_transfer', 'e_wallet', 'credit_card') NOT NULL,
    payment_for ENUM('monthly_rent', 'deposit', 'penalty', 'other') NOT NULL,
    payment_date DATE NOT NULL,
    due_date DATE NOT NULL,
    status ENUM('pending', 'paid', 'overdue', 'cancelled') DEFAULT 'pending',
    payment_proof VARCHAR(255) NULL,
    notes TEXT NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    
    FOREIGN KEY (rental_id) REFERENCES rentals(id) ON DELETE CASCADE
);
```

**Indexes:**
- Primary: `id`
- Foreign: `rental_id`
- Index: `status`, `payment_date`, `due_date`

**Relationships:**
- Belongs to: `rental`

### 6. reviews

Stores tenant reviews for kostans and rooms.

```sql
CREATE TABLE reviews (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    tenant_id BIGINT UNSIGNED NOT NULL,
    kostan_id BIGINT UNSIGNED NOT NULL,
    room_id BIGINT UNSIGNED NULL,
    rating TINYINT UNSIGNED NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NULL,
    is_approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    
    FOREIGN KEY (tenant_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (kostan_id) REFERENCES kostans(id) ON DELETE CASCADE,
    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE SET NULL
);
```

**Indexes:**
- Primary: `id`
- Foreign: `tenant_id`, `kostan_id`, `room_id`
- Index: `rating`, `is_approved`

**Relationships:**
- Belongs to: `user` (tenant)
- Belongs to: `kostan`
- Belongs to: `room` (optional)

### 7. notifications

Stores system notifications for users.

```sql
CREATE TABLE notifications (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT UNSIGNED NOT NULL,
    type VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    data JSON NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

**Indexes:**
- Primary: `id`
- Foreign: `user_id`
- Index: `is_read`, `created_at`

**Relationships:**
- Belongs to: `user`

### 8. personal_access_tokens (Laravel Sanctum)

Stores API authentication tokens.

```sql
CREATE TABLE personal_access_tokens (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    tokenable_type VARCHAR(255) NOT NULL,
    tokenable_id BIGINT UNSIGNED NOT NULL,
    name VARCHAR(255) NOT NULL,
    token VARCHAR(64) UNIQUE NOT NULL,
    abilities TEXT NULL,
    last_used_at TIMESTAMP NULL,
    expires_at TIMESTAMP NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    
    INDEX tokenable (tokenable_type, tokenable_id)
);
```

## Data Types and Constraints

### Enums

**User Roles:**
- `owner` - Can manage kostans and rooms
- `tenant` - Can rent rooms and make payments

**Room Types:**
- `single` - Single occupancy room
- `shared` - Shared room (2+ people)
- `premium` - Premium room with extra facilities

**Rental Status:**
- `pending` - Awaiting approval
- `active` - Currently active rental
- `expired` - Rental period ended
- `terminated` - Rental terminated early

**Payment Methods:**
- `cash` - Cash payment
- `bank_transfer` - Bank transfer
- `e_wallet` - Digital wallet (GoPay, OVO, etc.)
- `credit_card` - Credit card payment

**Payment Types:**
- `monthly_rent` - Regular monthly rent
- `deposit` - Security deposit
- `penalty` - Late payment penalty
- `other` - Other charges

**Payment Status:**
- `pending` - Payment not yet made
- `paid` - Payment completed
- `overdue` - Payment past due date
- `cancelled` - Payment cancelled

### JSON Fields

**Kostan Facilities Example:**
```json
["WiFi", "AC", "Laundry", "Kitchen", "Parking", "24h Security"]
```

**Kostan Rules Example:**
```json
["No smoking", "No pets", "No overnight guests", "Quiet hours 10PM-6AM"]
```

**Room Facilities Example:**
```json
["AC", "Private bathroom", "Wardrobe", "Desk", "Chair", "Bed"]
```

## Relationships Summary

```
User (Owner) 1:N Kostan 1:N Room 1:N Rental N:1 User (Tenant)
                                        │
                                        1:N
                                        │
                                    Payment

User (Tenant) 1:N Review N:1 Kostan
User (Tenant) 1:N Review N:1 Room (optional)

User 1:N Notification
```

## Indexes and Performance

### Primary Indexes
- All tables have auto-incrementing primary keys
- Foreign key constraints with appropriate cascading

### Secondary Indexes
- Email uniqueness for users
- Composite unique key for room numbers per kostan
- Performance indexes on frequently queried fields

### Query Optimization
- Use indexes for filtering by location, price, availability
- JSON fields for flexible facility/rule storage
- Proper foreign key relationships for data integrity

## Migration Files

The database schema is managed through Laravel migrations located in:
- `database/migrations/`

To run migrations:
```bash
php artisan migrate
```

To rollback migrations:
```bash
php artisan migrate:rollback
```

## Seeding Data

Database seeders are available for testing:
```bash
php artisan db:seed
```

## Backup and Maintenance

### Regular Backups
- Daily automated backups for production
- Test restore procedures monthly

### Maintenance Tasks
- Monitor database performance
- Regular index optimization
- Archive old payment records
- Clean up expired tokens

## Security Considerations

### Data Protection
- Passwords are hashed using bcrypt
- Sensitive payment data should be encrypted
- Personal information follows GDPR guidelines

### Access Control
- Role-based permissions at application level
- Database user permissions restricted by environment
- API tokens have limited lifespans

### Audit Trail
- All critical operations logged
- Soft deletes for important records
- Timestamp tracking on all records
