# RoTrust API Documentation

This document provides comprehensive documentation for the RoTrust API endpoints, including request and response formats, authentication requirements, and example usage.

## Table of Contents

1. [Authentication API](#authentication-api)
2. [Users API](#users-api)
3. [Properties API](#properties-api)
4. [Transactions API](#transactions-api)

## Authentication API

The Authentication API handles user authentication and token management.

### Endpoints

#### POST /api/auth/token

Authenticate a user and provide an access token.

**Request:**
```json
{
  "username": "user@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

**Status Codes:**
- 200 OK: Authentication successful
- 401 Unauthorized: Incorrect username or password

#### POST /api/auth/refresh

Refresh the access token.

**Request:**
Requires authentication header with valid token.

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

**Status Codes:**
- 200 OK: Token refreshed successfully
- 401 Unauthorized: Invalid or expired token

#### POST /api/auth/verify

Verify if the token is valid.

**Request:**
Requires authentication header with token.

**Response:**
```json
{
  "valid": true
}
```

**Status Codes:**
- 200 OK: Token is valid
- 401 Unauthorized: Invalid or expired token

## Users API

The Users API handles user management operations.

### Endpoints

#### POST /api/users/

Create a new user.

**Request:**
```json
{
  "username": "newuser",
  "email": "user@example.com",
  "full_name": "John Doe",
  "password": "securepassword",
  "role": "user"
}
```

**Response:**
```json
{
  "user_id": "user123",
  "status": "created"
}
```

**Status Codes:**
- 201 Created: User created successfully
- 400 Bad Request: Invalid user data
- 500 Internal Server Error: Server error

#### GET /api/users/me

Get information about the currently authenticated user.

**Request:**
Requires authentication header with token.

**Response:**
```json
{
  "id": "user123",
  "username": "johndoe",
  "email": "user@example.com",
  "full_name": "John Doe",
  "role": "user",
  "is_active": true,
  "created_at": "2025-07-30T21:51:00Z"
}
```

**Status Codes:**
- 200 OK: User information retrieved successfully
- 401 Unauthorized: Invalid or expired token

#### GET /api/users/{user_id}

Get user information by ID.

**Request:**
Requires authentication header with token.

**Response:**
```json
{
  "id": "user123",
  "username": "johndoe",
  "email": "user@example.com",
  "full_name": "John Doe",
  "role": "user",
  "is_active": true,
  "created_at": "2025-07-30T21:51:00Z"
}
```

**Status Codes:**
- 200 OK: User information retrieved successfully
- 401 Unauthorized: Invalid or expired token
- 403 Forbidden: Not authorized to access this user's information
- 404 Not Found: User not found

## Properties API

The Properties API handles property registration and management.

### Endpoints

#### POST /api/properties/

Register a new property on the blockchain.

**Request:**
```json
{
  "address": "123 Main St, Bucharest",
  "property_type": "apartment",
  "size": 85.5,
  "rooms": 3,
  "description": "Modern apartment in central location",
  "owner_id": "user123",
  "documents": ["deed123", "certificate456"]
}
```

**Response:**
```json
{
  "property_id": "prop123",
  "status": "registered"
}
```

**Status Codes:**
- 201 Created: Property registered successfully
- 400 Bad Request: Invalid property data
- 401 Unauthorized: Invalid or expired token

#### GET /api/properties/{property_id}

Get property details by ID.

**Request:**
Requires authentication header with token.

**Response:**
```json
{
  "id": "prop123",
  "address": "123 Main St, Bucharest",
  "property_type": "apartment",
  "size": 85.5,
  "rooms": 3,
  "description": "Modern apartment in central location",
  "owner_id": "user123",
  "status": "active",
  "created_at": "2025-07-30T21:51:00Z",
  "updated_at": "2025-07-30T21:51:00Z"
}
```

**Status Codes:**
- 200 OK: Property information retrieved successfully
- 400 Bad Request: Invalid request
- 401 Unauthorized: Invalid or expired token
- 404 Not Found: Property not found

#### GET /api/properties/

List properties with optional filtering.

**Request:**
Requires authentication header with token.

Query Parameters:
- owner_id (optional): Filter by owner ID
- property_type (optional): Filter by property type

**Response:**
```json
[
  {
    "id": "prop123",
    "address": "123 Main St, Bucharest",
    "property_type": "apartment",
    "size": 85.5,
    "rooms": 3,
    "description": "Modern apartment in central location",
    "owner_id": "user123",
    "status": "active",
    "created_at": "2025-07-30T21:51:00Z",
    "updated_at": "2025-07-30T21:51:00Z"
  },
  {
    "id": "prop124",
    "address": "456 Oak St, Bucharest",
    "property_type": "house",
    "size": 150.0,
    "rooms": 5,
    "description": "Spacious house with garden",
    "owner_id": "user123",
    "status": "active",
    "created_at": "2025-07-30T22:00:00Z",
    "updated_at": "2025-07-30T22:00:00Z"
  }
]
```

**Status Codes:**
- 200 OK: Properties retrieved successfully
- 400 Bad Request: Invalid request
- 401 Unauthorized: Invalid or expired token

#### PUT /api/properties/{property_id}

Update property details.

**Request:**
```json
{
  "address": "123 Main St, Bucharest",
  "property_type": "apartment",
  "size": 90.5,
  "rooms": 3,
  "description": "Updated description"
}
```

**Response:**
```json
{
  "property_id": "prop123",
  "status": "updated"
}
```

**Status Codes:**
- 200 OK: Property updated successfully
- 400 Bad Request: Invalid property data
- 401 Unauthorized: Invalid or expired token
- 404 Not Found: Property not found or update failed

## Transactions API

The Transactions API handles property transfer transactions.

### Endpoints

#### POST /api/transactions/transfers/

Initiate a property transfer transaction.

**Request:**
```json
{
  "property_id": "prop123",
  "seller_id": "user123",
  "buyer_id": "user456",
  "price": 120000.00,
  "payment_method": "bank_transfer",
  "notes": "Optional notes about the transaction"
}
```

**Response:**
```json
{
  "transaction_id": "tx123",
  "status": "completed"
}
```

**Status Codes:**
- 201 Created: Transaction initiated successfully
- 400 Bad Request: Invalid transaction data
- 401 Unauthorized: Invalid or expired token

#### GET /api/transactions/transfers/{transaction_id}

Get transaction details by ID.

**Request:**
Requires authentication header with token.

**Response:**
```json
{
  "id": "tx123",
  "property_id": "prop123",
  "seller_id": "user123",
  "buyer_id": "user456",
  "price": 120000.00,
  "payment_method": "bank_transfer",
  "status": "completed",
  "notes": "Optional notes about the transaction",
  "created_at": "2025-08-01T14:30:00Z",
  "updated_at": "2025-08-01T14:30:00Z"
}
```

**Status Codes:**
- 200 OK: Transaction information retrieved successfully
- 400 Bad Request: Invalid request
- 401 Unauthorized: Invalid or expired token
- 404 Not Found: Transaction not found

#### GET /api/transactions/transfers/

List transactions with optional filtering.

**Request:**
Requires authentication header with token.

Query Parameters:
- property_id (optional): Filter by property ID
- seller_id (optional): Filter by seller ID
- buyer_id (optional): Filter by buyer ID
- status (optional): Filter by transaction status

**Response:**
```json
[
  {
    "id": "tx123",
    "property_id": "prop123",
    "seller_id": "user123",
    "buyer_id": "user456",
    "price": 120000.00,
    "payment_method": "bank_transfer",
    "status": "completed",
    "notes": "Optional notes about the transaction",
    "created_at": "2025-08-01T14:30:00Z",
    "updated_at": "2025-08-01T14:30:00Z"
  },
  {
    "id": "tx124",
    "property_id": "prop124",
    "seller_id": "user123",
    "buyer_id": "user789",
    "price": 200000.00,
    "payment_method": "bank_transfer",
    "status": "pending",
    "notes": "Waiting for bank confirmation",
    "created_at": "2025-08-02T10:00:00Z",
    "updated_at": "2025-08-02T10:00:00Z"
  }
]
```

**Status Codes:**
- 200 OK: Transactions retrieved successfully
- 400 Bad Request: Invalid request
- 401 Unauthorized: Invalid or expired token

#### PUT /api/transactions/transfers/{transaction_id}/cancel

Cancel a pending transaction.

**Request:**
Requires authentication header with token.

**Response:**
```json
{
  "transaction_id": "tx123",
  "status": "cancelled"
}
```

**Status Codes:**
- 200 OK: Transaction cancelled successfully
- 400 Bad Request: Invalid request
- 401 Unauthorized: Invalid or expired token
- 404 Not Found: Transaction not found or cannot be cancelled

## Authentication

All API endpoints (except for login and user creation) require authentication using JWT tokens. To authenticate, include the following header in your requests:

```
Authorization: Bearer <access_token>
```

Where `<access_token>` is the token received from the login endpoint.

## Error Handling

All API endpoints return appropriate HTTP status codes and error messages in case of failure. Error responses have the following format:

```json
{
  "detail": "Error message describing the issue"
}
```

## Rate Limiting

API requests are subject to rate limiting to prevent abuse. The current rate limits are:

- 100 requests per minute for authenticated users
- 20 requests per minute for unauthenticated users

When rate limits are exceeded, the API returns a 429 Too Many Requests status code.

## Versioning

The current API version is v1. The API version is included in the URL path:

```
/api/v1/...
```

Future versions of the API will be available at different paths to ensure backward compatibility.