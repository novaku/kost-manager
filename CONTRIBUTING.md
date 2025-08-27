# Contributing to Kost Manager

We welcome contributions to the Kost Manager project! This guide will help you get started with contributing to the codebase.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Making Changes](#making-changes)
- [Submitting Changes](#submitting-changes)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Documentation](#documentation)
- [Community](#community)

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to [project-email@example.com](mailto:project-email@example.com).

### Our Standards

- Use welcoming and inclusive language
- Be respectful of differing viewpoints and experiences
- Gracefully accept constructive criticism
- Focus on what is best for the community
- Show empathy towards other community members

## Getting Started

### Ways to Contribute

- **Bug Reports**: Report bugs using GitHub issues
- **Feature Requests**: Suggest new features or improvements
- **Code Contributions**: Submit pull requests for bug fixes or new features
- **Documentation**: Improve documentation and examples
- **Testing**: Write tests to improve coverage
- **Translation**: Help translate the application to other languages

### Before You Start

1. Check if there's already an issue for what you want to work on
2. For large changes, create an issue first to discuss the approach
3. Fork the repository and create a feature branch
4. Make sure you can run the tests locally

## Development Setup

### Prerequisites

- PHP 8.2 or higher
- Node.js 18 or higher
- Composer
- MySQL or SQLite
- Git

### Setup Instructions

1. **Fork and Clone**
   ```bash
   git clone https://github.com/your-username/kost-manager.git
   cd kost-manager
   ```

2. **Install Dependencies**
   ```bash
   composer install
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

4. **Database Setup**
   ```bash
   touch database/database.sqlite
   php artisan migrate
   php artisan db:seed
   ```

5. **Build Frontend**
   ```bash
   npm run dev
   ```

6. **Run Tests**
   ```bash
   php artisan test
   npm test
   ```

## Making Changes

### Branch Naming

Use descriptive branch names that follow this pattern:
- `feature/description` - for new features
- `bugfix/description` - for bug fixes
- `hotfix/description` - for critical fixes
- `docs/description` - for documentation changes
- `refactor/description` - for refactoring work

Examples:
- `feature/add-payment-gateway`
- `bugfix/fix-authentication-issue`
- `docs/update-api-documentation`

### Commit Messages

Write clear commit messages that follow the conventional commits specification:

```
type(scope): description

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code formatting changes
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```bash
feat(auth): add password reset functionality
fix(payments): resolve duplicate payment issue
docs(api): update authentication endpoints
test(models): add unit tests for User model
```

### Development Workflow

1. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Your Changes**
   - Write code following the project's coding standards
   - Add tests for new functionality
   - Update documentation as needed

3. **Test Your Changes**
   ```bash
   # Run backend tests
   php artisan test
   
   # Run frontend tests
   npm test
   
   # Check code style
   composer run phpstan
   npm run lint
   ```

4. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "feat(feature): add new feature description"
   ```

5. **Push to Your Fork**
   ```bash
   git push origin feature/your-feature-name
   ```

## Submitting Changes

### Pull Request Process

1. **Create a Pull Request**
   - Go to the original repository on GitHub
   - Click "New Pull Request"
   - Select your branch and provide a clear description

2. **Pull Request Template**
   ```markdown
   ## Description
   Brief description of the changes made.
   
   ## Type of Change
   - [ ] Bug fix (non-breaking change which fixes an issue)
   - [ ] New feature (non-breaking change which adds functionality)
   - [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
   - [ ] Documentation update
   
   ## Testing
   - [ ] Tests pass locally
   - [ ] New tests added for new functionality
   - [ ] Manual testing completed
   
   ## Screenshots (if applicable)
   Add screenshots to help explain your changes.
   
   ## Checklist
   - [ ] My code follows the style guidelines of this project
   - [ ] I have performed a self-review of my own code
   - [ ] I have commented my code, particularly in hard-to-understand areas
   - [ ] I have made corresponding changes to the documentation
   - [ ] My changes generate no new warnings
   - [ ] Any dependent changes have been merged and published
   ```

3. **Review Process**
   - At least one maintainer must review your PR
   - Address any feedback or requested changes
   - All CI checks must pass
   - Code coverage should not decrease significantly

### What to Include

- **Description**: Clear explanation of what was changed and why
- **Issue Reference**: Link to the issue your PR addresses (if applicable)
- **Testing**: Information about how the changes were tested
- **Screenshots**: For UI changes, include before/after screenshots
- **Breaking Changes**: Clearly document any breaking changes

## Coding Standards

### PHP/Laravel Standards

Follow PSR-12 coding standards and Laravel best practices:

```php
<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreKostanRequest;
use App\Models\Kostan;
use Illuminate\Http\JsonResponse;

class KostanController extends Controller
{
    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreKostanRequest $request): JsonResponse
    {
        $kostan = Kostan::create($request->validated());

        return response()->json([
            'success' => true,
            'data' => $kostan,
            'message' => 'Kostan created successfully',
        ], 201);
    }
}
```

**Key Guidelines:**
- Use strict typing: `declare(strict_types=1);`
- Add return type hints to all methods
- Use dependency injection
- Follow Laravel naming conventions
- Write descriptive docblocks
- Use early returns to reduce nesting

### TypeScript/React Standards

```typescript
import React, { useState, useCallback, useMemo } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
}

interface UserListProps {
  users: User[];
  onUserSelect: (user: User) => void;
  className?: string;
}

export const UserList: React.FC<UserListProps> = ({
  users,
  onUserSelect,
  className = '',
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = useMemo(() => {
    return users.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  const handleUserClick = useCallback((user: User) => {
    onUserSelect(user);
  }, [onUserSelect]);

  return (
    <div className={`user-list ${className}`}>
      <input
        type="text"
        placeholder="Search users..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded"
      />
      <ul className="mt-4 space-y-2">
        {filteredUsers.map((user) => (
          <li
            key={user.id}
            onClick={() => handleUserClick(user)}
            className="p-2 hover:bg-gray-100 cursor-pointer rounded"
          >
            <div className="font-semibold">{user.name}</div>
            <div className="text-sm text-gray-600">{user.email}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};
```

**Key Guidelines:**
- Use TypeScript for all new code
- Define interfaces for all props and data structures
- Use functional components with hooks
- Implement proper error boundaries
- Use semantic HTML elements
- Follow accessibility guidelines

### CSS/Styling Standards

```css
/* Use Tailwind classes primarily */
.custom-component {
  @apply flex items-center justify-between p-4 bg-white rounded-lg shadow-md;
}

/* Custom styles when Tailwind is insufficient */
.custom-animation {
  transition: all 0.3s ease-in-out;
}

.custom-animation:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.12);
}
```

**Guidelines:**
- Use Tailwind CSS utility classes
- Create custom components for reusable styles
- Follow mobile-first approach
- Use consistent spacing and colors
- Ensure accessibility compliance

## Testing Guidelines

### Backend Testing

Write comprehensive tests for all new features:

```php
<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Kostan;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class KostanManagementTest extends TestCase
{
    use RefreshDatabase;

    private User $owner;

    protected function setUp(): void
    {
        parent::setUp();
        $this->owner = User::factory()->create(['role' => 'owner']);
    }

    public function test_owner_can_create_kostan(): void
    {
        $kostanData = [
            'name' => 'Test Kostan',
            'address' => 'Test Address',
            'location' => 'Test Location',
            'phone' => '08123456789',
        ];

        $response = $this->actingAs($this->owner, 'sanctum')
            ->postJson('/api/kostans', $kostanData);

        $response->assertStatus(201)
                ->assertJsonStructure([
                    'success',
                    'data' => [
                        'id',
                        'name',
                        'address',
                        'location',
                    ],
                    'message',
                ]);

        $this->assertDatabaseHas('kostans', $kostanData);
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

### Frontend Testing

```typescript
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UserList } from '../UserList';

const mockUsers = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
];

describe('UserList', () => {
  const mockOnUserSelect = jest.fn();

  beforeEach(() => {
    mockOnUserSelect.mockClear();
  });

  it('renders user list correctly', () => {
    render(<UserList users={mockUsers} onUserSelect={mockOnUserSelect} />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();
  });

  it('filters users based on search term', async () => {
    const user = userEvent.setup();
    render(<UserList users={mockUsers} onUserSelect={mockOnUserSelect} />);
    
    const searchInput = screen.getByPlaceholderText('Search users...');
    await user.type(searchInput, 'john');

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
  });

  it('calls onUserSelect when user is clicked', async () => {
    const user = userEvent.setup();
    render(<UserList users={mockUsers} onUserSelect={mockOnUserSelect} />);
    
    await user.click(screen.getByText('John Doe'));
    
    expect(mockOnUserSelect).toHaveBeenCalledWith(mockUsers[0]);
  });
});
```

### Testing Requirements

- **Unit Tests**: Test individual functions and components
- **Integration Tests**: Test feature workflows
- **API Tests**: Test all API endpoints
- **Frontend Tests**: Test component behavior and user interactions
- **Coverage**: Maintain at least 80% code coverage

### Running Tests

```bash
# Backend tests
php artisan test                    # All tests
php artisan test --filter=Feature  # Feature tests only
php artisan test --coverage        # With coverage report

# Frontend tests
npm test                           # All tests
npm test -- --watch              # Watch mode
npm test -- --coverage           # With coverage
npm test UserList.test.tsx       # Specific test
```

## Documentation

### Documentation Standards

- Update documentation for all new features
- Include code examples in documentation
- Use clear, concise language
- Add screenshots for UI changes
- Update API documentation for endpoint changes

### Types of Documentation

1. **Code Comments**: Inline documentation for complex logic
2. **API Documentation**: Endpoint descriptions and examples
3. **User Guide**: How to use the application
4. **Developer Guide**: Technical implementation details
5. **README**: Project overview and setup instructions

### Documentation Tools

- **API Docs**: Located in `docs/API_DOCUMENTATION.md`
- **Database Schema**: Located in `docs/DATABASE_SCHEMA.md`
- **Developer Guide**: Located in `docs/DEVELOPER_GUIDE.md`
- **Deployment Guide**: Located in `docs/DEPLOYMENT.md`

## Community

### Getting Help

- **GitHub Issues**: For bug reports and feature requests
- **Discussions**: For questions and general discussion
- **Email**: [project-email@example.com](mailto:project-email@example.com)

### Maintainers

Current project maintainers:
- [@maintainer1](https://github.com/maintainer1) - Lead Developer
- [@maintainer2](https://github.com/maintainer2) - Frontend Specialist
- [@maintainer3](https://github.com/maintainer3) - Backend Specialist

### Recognition

We appreciate all contributions! Contributors will be:
- Listed in the project README
- Mentioned in release notes for significant contributions
- Invited to join the maintainer team for exceptional contributions

## Release Process

### Versioning

We follow Semantic Versioning (SemVer):
- **MAJOR**: Incompatible API changes
- **MINOR**: New functionality in a backwards compatible manner
- **PATCH**: Backwards compatible bug fixes

### Release Schedule

- **Major releases**: Every 6-12 months
- **Minor releases**: Every 2-3 months
- **Patch releases**: As needed for critical bugs

### Changelog

All notable changes are documented in `CHANGELOG.md` following the [Keep a Changelog](https://keepachangelog.com/) format.

## Legal

By contributing to Kost Manager, you agree that your contributions will be licensed under the same license as the project (MIT License).

### Contributor License Agreement

By submitting a pull request, you represent that:
- You have the right to license your contribution to the project
- You agree to license your contribution under the project's license
- Your contribution is your original work or you have permission to submit it

---

Thank you for contributing to Kost Manager! Your help makes this project better for everyone.
