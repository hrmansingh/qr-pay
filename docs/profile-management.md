# Profile Management API Documentation

This document covers the profile management system for the QR Pay platform.

## Overview

The profile system manages user accounts with role-based access control. Each profile can own multiple businesses and has specific permissions based on their role.

## Profile Roles

### User (`user`)
- Default role for new profiles
- Can view their own profile information
- Limited access to system features

### Business Owner (`business_owner`)
- Can create and manage businesses
- Can create products and assign them to their businesses
- Can generate QR codes for their products
- Can view analytics for their businesses
- Can manage their business payments and orders

### Admin (`admin`)
- Full system access
- Can manage all profiles, businesses, and products
- Can view system-wide analytics
- Can perform bulk operations
- Can promote/demote user roles

## API Endpoints

### Profile CRUD Operations

#### List Profiles
```http
GET /api/profiles?role=business_owner&limit=50&offset=0
```

**Query Parameters:**
- `role` (optional): Filter by role (`admin`, `business_owner`, `user`)
- `limit` (optional): Number of results (default: 50, max: 100)
- `offset` (optional): Pagination offset (default: 0)

**Response:**
```json
{
  "profiles": [
    {
      "id": "uuid",
      "name": "John Doe",
      "role": "business_owner",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "limit": 50,
    "offset": 0,
    "total": 100,
    "has_more": true
  }
}
```

#### Create Profile
```http
POST /api/profiles
Content-Type: application/json

{
  "id": "user-uuid-from-auth-system",
  "name": "John Doe",
  "role": "business_owner"
}
```

**Response:**
```json
{
  "profile": {
    "id": "user-uuid-from-auth-system",
    "name": "John Doe",
    "role": "business_owner",
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

#### Get Profile Details
```http
GET /api/profiles/{profile_id}
```

**Response:**
```json
{
  "profile": {
    "id": "uuid",
    "name": "John Doe",
    "role": "business_owner",
    "created_at": "2024-01-01T00:00:00Z",
    "businesses": [
      {
        "id": "business-uuid",
        "name": "Coffee Shop",
        "created_at": "2024-01-01T00:00:00Z"
      }
    ]
  }
}
```

#### Update Profile
```http
PUT /api/profiles/{profile_id}
Content-Type: application/json

{
  "name": "John Smith",
  "role": "admin"
}
```

#### Delete Profile
```http
DELETE /api/profiles/{profile_id}
```

**Note:** Cannot delete profiles with associated businesses.

### Profile Statistics

#### Get Profile Stats
```http
GET /api/profiles/{profile_id}/stats?start_date=2024-01-01&end_date=2024-12-31
```

**Response:**
```json
{
  "stats": {
    "profile": {
      "id": "uuid",
      "name": "John Doe",
      "role": "business_owner"
    },
    "total_businesses": 3,
    "total_products": 15,
    "total_revenue": 50000.00,
    "total_payments": 200,
    "successful_payments": 190,
    "failed_payments": 10,
    "success_rate": 95.0,
    "average_transaction_value": 263.16,
    "recent_businesses": [...],
    "date_range": {
      "start_date": "2024-01-01",
      "end_date": "2024-12-31"
    }
  }
}
```

#### Get Profile Analytics
```http
GET /api/profiles/{profile_id}/analytics?start_date=2024-01-01&end_date=2024-12-31
```

**Response:**
```json
{
  "analytics": {
    "total_revenue": 50000.00,
    "total_payments": 200,
    "successful_payments": 190,
    "failed_payments": 10,
    "total_businesses": 3,
    "total_products": 15,
    "success_rate": 95.0,
    "average_transaction_value": 263.16,
    "revenue_by_business": [...],
    "revenue_by_product": [...],
    "revenue_over_time": [...]
  }
}
```

### Profile Businesses

#### Get Profile Businesses
```http
GET /api/profiles/{profile_id}/businesses?include_stats=true
```

**Response:**
```json
{
  "businesses": [
    {
      "id": "business-uuid",
      "name": "Coffee Shop",
      "owner_id": "profile-uuid",
      "created_at": "2024-01-01T00:00:00Z",
      "stats": {
        "total_products": 5,
        "total_payments": 50,
        "successful_payments": 48,
        "total_revenue": 12000.00,
        "success_rate": 96.0
      }
    }
  ]
}
```

### Role Management

#### Update Profile Role
```http
PUT /api/profiles/{profile_id}/role
Content-Type: application/json

{
  "role": "admin",
  "promoted_by": "admin-user-id"
}
```

**Response:**
```json
{
  "profile": {
    "id": "uuid",
    "name": "John Doe",
    "role": "admin",
    "created_at": "2024-01-01T00:00:00Z"
  },
  "message": "Profile role updated from business_owner to admin"
}
```

### Admin Endpoints

#### List All Profiles (Admin)
```http
GET /api/admin/profiles?role=business_owner&search=john&include_stats=true&limit=50&offset=0
```

**Query Parameters:**
- `role` (optional): Filter by role
- `search` (optional): Search by name
- `include_stats` (optional): Include statistics for each profile
- `limit` (optional): Number of results
- `offset` (optional): Pagination offset

**Response:**
```json
{
  "profiles": [
    {
      "id": "uuid",
      "name": "John Doe",
      "role": "business_owner",
      "created_at": "2024-01-01T00:00:00Z",
      "businesses": [...],
      "stats": {
        "total_businesses": 3,
        "total_products": 15,
        "total_revenue": 50000.00,
        "total_payments": 200,
        "success_rate": 95.0
      }
    }
  ],
  "pagination": {
    "limit": 50,
    "offset": 0,
    "total": 100,
    "has_more": true
  },
  "summary": {
    "total_profiles": 100,
    "role_distribution": {
      "admin": 2,
      "business_owner": 25,
      "user": 73
    },
    "filters_applied": {
      "role": "business_owner",
      "search": "john",
      "include_stats": true
    }
  }
}
```

#### Bulk Profile Operations (Admin)
```http
POST /api/admin/profiles/bulk
Content-Type: application/json

{
  "action": "update_role",
  "profile_ids": ["uuid1", "uuid2", "uuid3"],
  "data": {
    "role": "business_owner"
  }
}
```

**Available Actions:**
- `update_role`: Update role for multiple profiles
- `delete`: Delete multiple profiles (only if no associated businesses)

**Response:**
```json
{
  "message": "Bulk update_role completed",
  "results": {
    "success": [
      {
        "profile_id": "uuid1",
        "profile": {...},
        "message": "Role updated to business_owner"
      }
    ],
    "failed": [
      {
        "profile_id": "uuid2",
        "error": "Profile not found"
      }
    ],
    "total": 3
  },
  "summary": {
    "total": 3,
    "successful": 2,
    "failed": 1,
    "success_rate": 66.67
  }
}
```

## Usage Examples

### Creating a New Business Owner
```javascript
// 1. Create profile
const profileResponse = await fetch('/api/profiles', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    id: 'auth-user-id',
    name: 'Jane Smith',
    role: 'business_owner'
  })
})

// 2. Create their first business
const businessResponse = await fetch('/api/businesses', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Jane\'s Bakery',
    owner_id: 'auth-user-id'
  })
})
```

### Getting Profile Dashboard Data
```javascript
const [stats, businesses, analytics] = await Promise.all([
  fetch(`/api/profiles/${profileId}/stats`).then(r => r.json()),
  fetch(`/api/profiles/${profileId}/businesses?include_stats=true`).then(r => r.json()),
  fetch(`/api/profiles/${profileId}/analytics`).then(r => r.json())
])
```

### Admin: Promoting Users to Business Owners
```javascript
// Bulk promote multiple users
const response = await fetch('/api/admin/profiles/bulk', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'update_role',
    profile_ids: ['user1', 'user2', 'user3'],
    data: { role: 'business_owner' }
  })
})
```

## Security Considerations

### Row Level Security (RLS)
- Profiles can only view/edit their own data
- Business owners can manage their own businesses
- Admins have full access to all data

### Authentication Integration
- Profile IDs should match your authentication system user IDs
- Implement proper JWT validation before API calls
- Use middleware to verify user permissions

### Role-Based Access Control
- Validate user roles before allowing operations
- Implement proper authorization checks
- Log role changes for audit purposes

## Error Handling

### Common Error Responses

#### Profile Not Found (404)
```json
{
  "error": "Profile not found"
}
```

#### Invalid Role (400)
```json
{
  "error": "Invalid role. Must be admin, business_owner, or user"
}
```

#### Profile Has Dependencies (409)
```json
{
  "error": "Cannot delete profile with associated businesses",
  "businesses_count": 3
}
```

#### Duplicate Profile (409)
```json
{
  "error": "Profile already exists"
}
```

## Integration with Authentication

### Supabase Auth Integration
```javascript
// When user signs up
const { data: { user } } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password'
})

// Create profile
await fetch('/api/profiles', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    id: user.id,
    name: user.user_metadata.full_name,
    role: 'user'
  })
})
```

### JWT Middleware Example
```javascript
// middleware.js
export function middleware(request) {
  const token = request.headers.get('authorization')
  // Validate JWT and extract user ID
  // Add user context to request
}
```

This profile management system provides a complete foundation for user management in your QR Pay platform with proper role-based access control and comprehensive analytics.