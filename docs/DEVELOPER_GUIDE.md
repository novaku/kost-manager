# Developer Guide - Kost Manager

## Overview

This guide provides comprehensive information for developers working on the Kost Manager application. It covers the codebase structure, development workflow, coding standards, and best practices.

## Project Architecture

### Technology Stack

- **Backend**: Laravel 12 (PHP 8.2+)
- **Frontend**: React 19 with TypeScript
- **Database**: MySQL/SQLite with Redis caching
- **Authentication**: Laravel Sanctum
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Testing**: PHPUnit (Backend), Jest (Frontend)

### Directory Structure

```
kost-manager/
├── app/                          # Laravel application code
│   ├── Http/Controllers/         # API controllers
│   │   └── Api/                  # API-specific controllers
│   ├── Models/                   # Eloquent models
│   ├── Notifications/            # Laravel notifications
│   └── Providers/                # Service providers
├── config/                       # Laravel configuration
├── database/                     # Database files
│   ├── migrations/               # Database migrations
│   ├── seeders/                  # Database seeders
│   └── factories/                # Model factories
├── docs/                         # Documentation
├── public/                       # Web server document root
│   └── build/                    # Compiled frontend assets
├── resources/                    # Frontend and view resources
│   ├── css/                      # Stylesheets
│   ├── js/                       # React application
│   │   ├── components/           # React components
│   │   ├── contexts/             # React contexts
│   │   ├── hooks/                # Custom React hooks
│   │   ├── pages/                # Page components
│   │   ├── services/             # API services
│   │   ├── types/                # TypeScript definitions
│   │   └── utils/                # Utility functions
│   ├── lang/                     # Localization files
│   └── views/                    # Blade templates
├── routes/                       # Route definitions
├── storage/                      # Storage for logs, cache, etc.
├── tests/                        # Automated tests
└── vendor/                       # Composer dependencies
```

## Development Setup

### Prerequisites

1. **PHP 8.2+** with required extensions
2. **Composer** for PHP dependency management
3. **Node.js 18+** and **npm** for frontend
4. **MySQL** or **SQLite** for database
5. **Git** for version control

### Initial Setup

```bash
# Clone the repository
git clone https://github.com/your-repo/kost-manager.git
cd kost-manager

# Install backend dependencies
composer install

# Install frontend dependencies
npm install

# Environment setup
cp .env.example .env
php artisan key:generate

# Database setup
touch database/database.sqlite  # For SQLite
php artisan migrate
php artisan db:seed  # Optional: seed with sample data

# Build frontend assets
npm run dev  # Development mode with hot reload
# OR
npm run build  # Production build
```

### Running the Application

**Start Laravel Server:**
```bash
php artisan serve
# Backend available at: http://127.0.0.1:8000
```

**Start Vite Dev Server:**
```bash
npm run dev
# Frontend available at: http://localhost:5173
```

## Backend Development

### Laravel Structure

#### Models

All models are located in `app/Models/` and follow Eloquent conventions:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Kostan extends Model
{
    protected $fillable = [
        'owner_id',
        'name',
        'description',
        'address',
        'location',
        'phone',
        'facilities',
        'rules',
        'is_active',
    ];

    protected $casts = [
        'facilities' => 'array',
        'rules' => 'array',
        'is_active' => 'boolean',
    ];

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function rooms(): HasMany
    {
        return $this->hasMany(Room::class);
    }
}
```

#### Controllers

API controllers are in `app/Http/Controllers/Api/`:

```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Kostan;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class KostanController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Kostan::with(['owner', 'rooms'])
            ->where('is_active', true);

        // Apply filters
        if ($request->has('search')) {
            $query->where('name', 'like', "%{$request->search}%");
        }

        if ($request->has('location')) {
            $query->where('location', $request->location);
        }

        $kostans = $query->paginate(15);

        return response()->json([
            'success' => true,
            'data' => $kostans,
        ]);
    }
}
```

#### Middleware and Authentication

The application uses Laravel Sanctum for API authentication:

```php
// routes/api.php
Route::middleware('auth:sanctum')->group(function () {
    Route::middleware('role:owner')->group(function () {
        Route::apiResource('kostans', KostanController::class);
    });
});
```

#### Database Migrations

Create migrations for database changes:

```bash
php artisan make:migration create_new_table
php artisan make:migration add_column_to_existing_table --table=existing_table
```

Example migration:

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('kostans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('owner_id')->constrained('users')->onDelete('cascade');
            $table->string('name');
            $table->text('description')->nullable();
            $table->text('address');
            $table->string('location');
            $table->string('phone')->nullable();
            $table->json('facilities')->nullable();
            $table->json('rules')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('kostans');
    }
};
```

## Frontend Development

### React Structure

#### Components

Components are organized by feature in `resources/js/components/`:

```typescript
// resources/js/components/KostanCard.tsx
import React from 'react';
import { Kostan } from '../types';

interface KostanCardProps {
  kostan: Kostan;
  onSelect?: (kostan: Kostan) => void;
}

export const KostanCard: React.FC<KostanCardProps> = ({ kostan, onSelect }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <h3 className="text-xl font-semibold mb-2">{kostan.name}</h3>
      <p className="text-gray-600 mb-2">{kostan.location}</p>
      <p className="text-sm text-gray-500 mb-4">{kostan.description}</p>
      
      <div className="flex justify-between items-center">
        <span className="text-lg font-bold text-green-600">
          {kostan.rooms_count} kamar tersedia
        </span>
        {onSelect && (
          <button
            onClick={() => onSelect(kostan)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Lihat Detail
          </button>
        )}
      </div>
    </div>
  );
};
```

#### Pages

Page components are in `resources/js/pages/`:

```typescript
// resources/js/pages/KostanListPage.tsx
import React, { useState, useEffect } from 'react';
import { KostanCard } from '../components/KostanCard';
import { kostanService } from '../services/kostanService';
import { Kostan } from '../types';

export const KostanListPage: React.FC = () => {
  const [kostans, setKostans] = useState<Kostan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKostans = async () => {
      try {
        const response = await kostanService.getAll();
        setKostans(response.data);
      } catch (error) {
        console.error('Error fetching kostans:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchKostans();
  }, []);

  if (loading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Daftar Kostan</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kostans.map((kostan) => (
          <KostanCard key={kostan.id} kostan={kostan} />
        ))}
      </div>
    </div>
  );
};
```

#### Services

API services are in `resources/js/services/`:

```typescript
// resources/js/services/kostanService.ts
import axios from 'axios';
import { Kostan, ApiResponse } from '../types';

const API_BASE = '/api';

export const kostanService = {
  async getAll(params?: Record<string, any>): Promise<ApiResponse<Kostan[]>> {
    const response = await axios.get(`${API_BASE}/kostans`, { params });
    return response.data;
  },

  async getById(id: number): Promise<ApiResponse<Kostan>> {
    const response = await axios.get(`${API_BASE}/kostans/${id}`);
    return response.data;
  },

  async create(data: Partial<Kostan>): Promise<ApiResponse<Kostan>> {
    const response = await axios.post(`${API_BASE}/kostans`, data);
    return response.data;
  },

  async update(id: number, data: Partial<Kostan>): Promise<ApiResponse<Kostan>> {
    const response = await axios.put(`${API_BASE}/kostans/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<ApiResponse<void>> {
    const response = await axios.delete(`${API_BASE}/kostans/${id}`);
    return response.data;
  },
};
```

#### Types

TypeScript definitions are in `resources/js/types/`:

```typescript
// resources/js/types/index.ts
export interface User {
  id: number;
  name: string;
  email: string;
  role: 'owner' | 'tenant';
  phone?: string;
  created_at: string;
  updated_at: string;
}

export interface Kostan {
  id: number;
  owner_id: number;
  name: string;
  description?: string;
  address: string;
  location: string;
  phone?: string;
  facilities: string[];
  rules: string[];
  is_active: boolean;
  rooms_count?: number;
  owner?: User;
  rooms?: Room[];
  created_at: string;
  updated_at: string;
}

export interface Room {
  id: number;
  kostan_id: number;
  room_number: string;
  type: 'single' | 'shared' | 'premium';
  price: number;
  description?: string;
  facilities: string[];
  is_available: boolean;
  kostan?: Kostan;
  created_at: string;
  updated_at: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  meta?: {
    pagination?: PaginationMeta;
  };
}

export interface PaginationMeta {
  current_page: number;
  from: number;
  last_page: number;
  per_page: number;
  to: number;
  total: number;
}
```

## Coding Standards

### PHP/Laravel Standards

Follow PSR-12 coding standards and Laravel conventions:

```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class UserController extends Controller
{
    /**
     * Display a listing of users.
     */
    public function index(Request $request): JsonResponse
    {
        $users = User::when($request->search, function ($query, $search) {
            return $query->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
        })->paginate();

        return response()->json([
            'success' => true,
            'data' => $users,
        ]);
    }
}
```

**Key Rules:**
- Use strict typing where possible
- Follow PSR-12 formatting
- Use descriptive method and variable names
- Add docblocks for methods
- Use early returns to reduce nesting

### TypeScript/React Standards

```typescript
import React, { useState, useCallback } from 'react';

interface Props {
  title: string;
  onSubmit: (data: FormData) => void;
  loading?: boolean;
}

export const MyComponent: React.FC<Props> = ({ 
  title, 
  onSubmit, 
  loading = false 
}) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
  });

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  }, [formData, onSubmit]);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold">{title}</h2>
      {/* Form fields */}
    </form>
  );
};
```

**Key Rules:**
- Use TypeScript for all new code
- Define interfaces for props and data structures
- Use functional components with hooks
- Use `useCallback` and `useMemo` for optimization
- Follow React naming conventions

## Testing

### Backend Testing

PHPUnit tests are in `tests/` directory:

```php
<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Kostan;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class KostanControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_owner_can_create_kostan(): void
    {
        $owner = User::factory()->create(['role' => 'owner']);
        
        $response = $this->actingAs($owner, 'sanctum')
            ->postJson('/api/kostans', [
                'name' => 'Test Kostan',
                'address' => 'Test Address',
                'location' => 'Test Location',
            ]);

        $response->assertStatus(201)
                ->assertJson([
                    'success' => true,
                    'data' => [
                        'name' => 'Test Kostan',
                    ],
                ]);

        $this->assertDatabaseHas('kostans', [
            'name' => 'Test Kostan',
            'owner_id' => $owner->id,
        ]);
    }

    public function test_tenant_cannot_create_kostan(): void
    {
        $tenant = User::factory()->create(['role' => 'tenant']);
        
        $response = $this->actingAs($tenant, 'sanctum')
            ->postJson('/api/kostans', [
                'name' => 'Test Kostan',
                'address' => 'Test Address',
                'location' => 'Test Location',
            ]);

        $response->assertStatus(403);
    }
}
```

**Run Tests:**
```bash
# Run all tests
php artisan test

# Run specific test
php artisan test --filter KostanControllerTest

# Run with coverage
php artisan test --coverage
```

### Frontend Testing

Jest tests for React components:

```typescript
// tests/components/KostanCard.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { KostanCard } from '../../resources/js/components/KostanCard';
import { Kostan } from '../../resources/js/types';

const mockKostan: Kostan = {
  id: 1,
  owner_id: 1,
  name: 'Test Kostan',
  location: 'Test Location',
  description: 'Test Description',
  address: 'Test Address',
  phone: '123456789',
  facilities: ['WiFi', 'AC'],
  rules: ['No smoking'],
  is_active: true,
  rooms_count: 5,
  created_at: '2025-08-26T00:00:00Z',
  updated_at: '2025-08-26T00:00:00Z',
};

describe('KostanCard', () => {
  it('renders kostan information correctly', () => {
    render(<KostanCard kostan={mockKostan} />);
    
    expect(screen.getByText('Test Kostan')).toBeInTheDocument();
    expect(screen.getByText('Test Location')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText('5 kamar tersedia')).toBeInTheDocument();
  });

  it('calls onSelect when button is clicked', () => {
    const onSelect = jest.fn();
    render(<KostanCard kostan={mockKostan} onSelect={onSelect} />);
    
    fireEvent.click(screen.getByText('Lihat Detail'));
    expect(onSelect).toHaveBeenCalledWith(mockKostan);
  });
});
```

## Development Workflow

### Git Workflow

1. **Branch Naming:**
   - `feature/add-payment-system`
   - `bugfix/fix-authentication-issue`
   - `hotfix/critical-security-patch`

2. **Commit Messages:**
   ```
   feat: add payment processing functionality
   fix: resolve authentication token expiry issue
   docs: update API documentation
   style: fix code formatting
   refactor: optimize database queries
   test: add unit tests for payment service
   ```

3. **Pull Request Process:**
   - Create feature branch from `main`
   - Make changes and commit
   - Push branch and create PR
   - Code review and testing
   - Merge to `main` after approval

### Development Commands

```bash
# Laravel commands
php artisan migrate:fresh --seed  # Reset database with fresh data
php artisan make:controller Api/NewController
php artisan make:model NewModel -m  # Create model with migration
php artisan make:request StoreUserRequest
php artisan route:list  # List all routes

# Frontend commands
npm run dev  # Development with hot reload
npm run build  # Production build
npm run preview  # Preview production build
npm run type-check  # TypeScript type checking

# Testing
php artisan test
npm test

# Code quality
composer run phpstan  # Static analysis
npm run lint  # ESLint
npm run lint:fix  # Fix linting issues
```

### Code Quality Tools

**PHP:**
- PHPStan for static analysis
- PHP CS Fixer for code formatting
- PHPUnit for testing

**JavaScript/TypeScript:**
- ESLint for linting
- Prettier for formatting
- Jest for testing
- TypeScript compiler for type checking

## Database Design Patterns

### Repository Pattern

```php
<?php

namespace App\Repositories;

use App\Models\Kostan;
use Illuminate\Database\Eloquent\Collection;

interface KostanRepositoryInterface
{
    public function getAll(array $filters = []): Collection;
    public function findById(int $id): ?Kostan;
    public function create(array $data): Kostan;
    public function update(int $id, array $data): bool;
    public function delete(int $id): bool;
}

class KostanRepository implements KostanRepositoryInterface
{
    public function getAll(array $filters = []): Collection
    {
        $query = Kostan::query();

        if (isset($filters['search'])) {
            $query->where('name', 'like', "%{$filters['search']}%");
        }

        if (isset($filters['location'])) {
            $query->where('location', $filters['location']);
        }

        return $query->get();
    }

    // ... other methods
}
```

### Service Layer

```php
<?php

namespace App\Services;

use App\Repositories\KostanRepositoryInterface;
use App\Models\Kostan;

class KostanService
{
    public function __construct(
        private KostanRepositoryInterface $kostanRepository
    ) {}

    public function createKostan(array $data, User $owner): Kostan
    {
        $data['owner_id'] = $owner->id;
        
        // Business logic here
        $this->validateKostanData($data);
        
        return $this->kostanRepository->create($data);
    }

    private function validateKostanData(array $data): void
    {
        // Custom business validation
        if (empty($data['name'])) {
            throw new \InvalidArgumentException('Kostan name is required');
        }
    }
}
```

## Performance Optimization

### Database Optimization

```php
// Use eager loading to prevent N+1 queries
$kostans = Kostan::with(['owner', 'rooms'])->get();

// Use database transactions for multiple operations
DB::transaction(function () {
    $kostan = Kostan::create($kostanData);
    $kostan->rooms()->createMany($roomsData);
});

// Use database indexes for frequently queried fields
Schema::table('kostans', function (Blueprint $table) {
    $table->index(['location', 'is_active']);
});
```

### Frontend Optimization

```typescript
// Use React.memo for expensive components
export const ExpensiveComponent = React.memo(({ data }) => {
  // Expensive rendering logic
  return <div>{/* rendered content */}</div>;
});

// Use useMemo for expensive calculations
const expensiveValue = useMemo(() => {
  return data.reduce((acc, item) => acc + item.value, 0);
}, [data]);

// Use useCallback for event handlers
const handleClick = useCallback((id: number) => {
  onItemClick(id);
}, [onItemClick]);
```

### Caching Strategy

```php
// Cache expensive queries
$kostans = Cache::remember('kostans_by_location_' . $location, 3600, function () use ($location) {
    return Kostan::where('location', $location)->with('rooms')->get();
});

// Cache API responses
Route::middleware('cache.headers:public;max_age=3600')->group(function () {
    Route::get('/api/kostans', [KostanController::class, 'index']);
});
```

## Security Best Practices

### Input Validation

```php
// Use Form Requests for validation
class StoreKostanRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'address' => 'required|string',
            'location' => 'required|string|max:255',
            'phone' => 'nullable|string|regex:/^08[0-9]{8,11}$/',
            'facilities' => 'nullable|array',
            'facilities.*' => 'string',
        ];
    }
}
```

### API Security

```php
// Rate limiting
Route::middleware('throttle:60,1')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
});

// CORS configuration
// config/cors.php
'allowed_origins' => ['https://yourdomain.com'],
'allowed_methods' => ['GET', 'POST', 'PUT', 'DELETE'],
'allowed_headers' => ['Content-Type', 'Authorization'],
```

### Frontend Security

```typescript
// Sanitize user input
import DOMPurify from 'dompurify';

const sanitizedHTML = DOMPurify.sanitize(userInput);

// Validate API responses
interface ApiResponse<T> {
  success: boolean;
  data: T;
}

const validateApiResponse = <T>(response: any): response is ApiResponse<T> => {
  return typeof response === 'object' && 
         typeof response.success === 'boolean' &&
         response.data !== undefined;
};
```

This developer guide provides a comprehensive overview of the Kost Manager codebase and development practices. Follow these guidelines to maintain code quality and consistency across the project.
