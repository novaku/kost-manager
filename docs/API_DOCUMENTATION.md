# API Documentation - Kost Manager

## Overview

The Kost Manager API is a RESTful API built with Laravel 12 that provides endpoints for managing boarding houses (kostans), rooms, rentals, and payments. The API supports role-based access control with two main user types: **Owners** and **Tenants**.

## Base URL

- **Development**: `http://127.0.0.1:8000/api`
- **Production**: `https://yourdomain.com/api`

## Authentication

The API uses Laravel Sanctum for authentication. Include the bearer token in the Authorization header for protected routes.

```bash
Authorization: Bearer {your-access-token}
```

## Response Format

All API responses follow a consistent JSON format:

```json
{
  "success": true,
  "data": {},
  "message": "Success message",
  "meta": {
    "pagination": {}
  }
}
```

## Error Handling

Error responses include appropriate HTTP status codes and error details:

```json
{
  "success": false,
  "message": "Error message",
  "errors": {
    "field": ["Validation error message"]
  }
}
```

## Public Endpoints

### Authentication

#### Register User
```http
POST /api/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "password_confirmation": "password123",
  "role": "tenant", // or "owner"
  "phone": "08123456789"
}
```

#### Login User
```http
POST /api/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "tenant"
    },
    "token": "1|abc123..."
  }
}
```

### Public Listings

#### Get All Kostans
```http
GET /api/kostans
```

**Query Parameters:**
- `search` - Search by name or location
- `location` - Filter by location
- `min_price` - Minimum room price
- `max_price` - Maximum room price
- `page` - Page number for pagination

#### Get Kostan Details
```http
GET /api/kostans/{id}
```

#### Get Rooms in Kostan
```http
GET /api/kostans/{kostan_id}/rooms
```

#### Get Room Details
```http
GET /api/rooms/{id}
```

## Protected Endpoints

### User Profile

#### Get Profile
```http
GET /api/profile
```

#### Update Profile
```http
PUT /api/profile
```

**Request Body:**
```json
{
  "name": "Updated Name",
  "phone": "08987654321"
}
```

#### Change Password
```http
POST /api/change-password
```

**Request Body:**
```json
{
  "current_password": "oldpassword",
  "password": "newpassword",
  "password_confirmation": "newpassword"
}
```

#### Logout
```http
POST /api/logout
```

#### Logout All Devices
```http
POST /api/logout-all
```

## Owner-Only Endpoints

### Kostan Management

#### Create Kostan
```http
POST /api/kostans
```

**Request Body:**
```json
{
  "name": "Kostan ABC",
  "description": "Modern boarding house",
  "address": "Jl. Sudirman No. 123",
  "location": "Jakarta Selatan",
  "phone": "021-123456",
  "facilities": ["WiFi", "AC", "Laundry"],
  "rules": ["No smoking", "No pets"]
}
```

#### Update Kostan
```http
PUT /api/kostans/{id}
```

#### Delete Kostan
```http
DELETE /api/kostans/{id}
```

#### Get My Kostans
```http
GET /api/my-kostans
```

### Room Management

#### Create Room
```http
POST /api/kostans/{kostan_id}/rooms
```

**Request Body:**
```json
{
  "room_number": "A01",
  "type": "single",
  "price": 1500000,
  "description": "Comfortable single room",
  "facilities": ["AC", "Private bathroom"],
  "is_available": true
}
```

#### Update Room
```http
PUT /api/kostans/{kostan_id}/rooms/{id}
```

#### Delete Room
```http
DELETE /api/kostans/{kostan_id}/rooms/{id}
```

### Rental Management

#### Get Rental Applications
```http
GET /api/rentals/applications
```

#### Approve Rental
```http
POST /api/rentals/{id}/approve
```

**Request Body:**
```json
{
  "start_date": "2025-09-01",
  "end_date": "2026-08-31",
  "monthly_rent": 1500000
}
```

#### Reject Rental
```http
POST /api/rentals/{id}/reject
```

**Request Body:**
```json
{
  "reason": "Room not available"
}
```

## Tenant-Only Endpoints

### Rental Application

#### Apply for Rental
```http
POST /api/rentals/apply
```

**Request Body:**
```json
{
  "room_id": 1,
  "move_in_date": "2025-09-01",
  "duration_months": 12,
  "message": "I'm interested in renting this room"
}
```

#### Get My Rentals
```http
GET /api/my-rentals
```

#### Get My Payments
```http
GET /api/my-payments
```

## Common Endpoints (Both Roles)

### Rentals

#### Get All Rentals
```http
GET /api/rentals
```

#### Get Rental Details
```http
GET /api/rentals/{id}
```

### Payments

#### Get All Payments
```http
GET /api/payments
```

#### Get Payment Details
```http
GET /api/payments/{id}
```

#### Create Payment
```http
POST /api/payments
```

**Request Body:**
```json
{
  "rental_id": 1,
  "amount": 1500000,
  "payment_method": "bank_transfer",
  "payment_for": "monthly_rent"
}
```

#### Process Payment
```http
POST /api/payments/{id}/process
```

#### Payment Webhook (for payment gateways)
```http
POST /api/payments/webhook
```

## Utility Endpoints

### Health Check
```http
GET /api/health
```

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-08-26T12:00:00Z",
  "version": "1.0.0"
}
```

## HTTP Status Codes

- `200` - OK
- `201` - Created
- `204` - No Content
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Unprocessable Entity (Validation Error)
- `500` - Internal Server Error

## Rate Limiting

API requests are limited to:
- **Public endpoints**: 60 requests per minute
- **Authenticated endpoints**: 120 requests per minute

## Pagination

List endpoints support pagination with the following parameters:
- `page` - Page number (default: 1)
- `per_page` - Items per page (default: 15, max: 100)

**Pagination Response:**
```json
{
  "data": [...],
  "meta": {
    "current_page": 1,
    "from": 1,
    "last_page": 3,
    "per_page": 15,
    "to": 15,
    "total": 45
  }
}
```

## Error Codes

| Code | Description |
|------|-------------|
| `VALIDATION_ERROR` | Request validation failed |
| `UNAUTHORIZED` | Authentication required |
| `FORBIDDEN` | Insufficient permissions |
| `NOT_FOUND` | Resource not found |
| `CONFLICT` | Resource conflict (e.g., room already rented) |
| `PAYMENT_FAILED` | Payment processing failed |
| `RATE_LIMIT_EXCEEDED` | Too many requests |

## SDK and Examples

### cURL Example
```bash
# Login
curl -X POST http://127.0.0.1:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'

# Get kostans with token
curl -X GET http://127.0.0.1:8000/api/kostans \
  -H "Authorization: Bearer 1|abc123..."
```

### JavaScript/Axios Example
```javascript
// Set up axios with base URL and token
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});

// Get kostans
const kostans = await api.get('/kostans');

// Create payment
const payment = await api.post('/payments', {
  rental_id: 1,
  amount: 1500000,
  payment_method: 'bank_transfer'
});
```

## Testing

Use the provided Postman collection or test with tools like:
- **Postman** - Import the API collection
- **Insomnia** - REST client
- **cURL** - Command line testing
- **PHPUnit** - Automated testing (see `/tests` directory)

## Support

For API support and questions:
- Email: support@kostmanager.com
- Documentation: [GitHub Wiki](https://github.com/your-repo/kost-manager/wiki)
- Issues: [GitHub Issues](https://github.com/your-repo/kost-manager/issues)
