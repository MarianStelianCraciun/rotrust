# RoTrust Backend Components Documentation

This document provides a comprehensive overview of the backend components of the RoTrust platform. It outlines the architecture, key modules, and their interactions to help developers understand and contribute to the system.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Core Components](#core-components)
3. [API Endpoints](#api-endpoints)
4. [Database Models](#database-models)
5. [Blockchain Integration](#blockchain-integration)
6. [Authentication and Authorization](#authentication-and-authorization)
7. [Services](#services)

## Architecture Overview

The RoTrust backend is built using FastAPI, a modern, high-performance web framework for building APIs with Python. The architecture follows a modular design with clear separation of concerns:

```
backend/
├── app/
│   ├── blockchain/       # Blockchain integration components
│   ├── core/             # Core functionality and configuration
│   ├── models/           # Database models
│   ├── routers/          # API route definitions
│   ├── services/         # Business logic services
│   └── db_init.py        # Database initialization
└── main.py               # Application entry point
```

The backend follows a layered architecture:

1. **API Layer**: Handles HTTP requests and responses (routers)
2. **Service Layer**: Implements business logic (services)
3. **Data Access Layer**: Manages data persistence (models)
4. **Blockchain Layer**: Integrates with blockchain technology (blockchain)
5. **Core Layer**: Provides shared functionality and configuration (core)

## Core Components

### Main Application (main.py)

The entry point for the FastAPI application that configures middleware, includes routers, and defines basic endpoints:

- Configures CORS middleware to allow cross-origin requests
- Sets up logging configuration
- Includes routers for different API domains
- Defines root and health check endpoints

### Core Module (app/core)

Contains core functionality and configuration:

- **Logging Configuration**: Configures application logging
- **Security**: JWT token handling and password hashing
- **Config**: Application configuration and environment variables
- **Dependencies**: Shared dependencies for API endpoints

## API Endpoints

The API is organized into several domains, each with its own router:

### Authentication Router (app/routers/auth.py)

Handles user authentication and authorization:

- `POST /api/auth/login`: Authenticates users and issues JWT tokens
- `POST /api/auth/register`: Registers new users
- `POST /api/auth/refresh`: Refreshes JWT tokens
- `POST /api/auth/logout`: Invalidates JWT tokens

### Users Router (app/routers/users.py)

Manages user profiles and information:

- `GET /api/users/me`: Retrieves the current user's profile
- `PUT /api/users/me`: Updates the current user's profile
- `GET /api/users/{user_id}`: Retrieves a specific user's profile
- `GET /api/users/`: Lists users with optional filtering

### Properties Router (app/routers/properties.py)

Handles property registration and management:

- `POST /api/properties/`: Registers a new property
- `GET /api/properties/{property_id}`: Retrieves property details
- `PUT /api/properties/{property_id}`: Updates property details
- `GET /api/properties/`: Lists properties with optional filtering
- `DELETE /api/properties/{property_id}`: Removes a property

### Transactions Router (app/routers/transactions.py)

Manages property transactions and transfers:

- `POST /api/transactions/transfers/`: Initiates a property transfer
- `GET /api/transactions/transfers/{transaction_id}`: Retrieves transaction details
- `PUT /api/transactions/transfers/{transaction_id}/status`: Updates transaction status
- `GET /api/transactions/transfers/`: Lists transactions with optional filtering
- `PUT /api/transactions/transfers/{transaction_id}/cancel`: Cancels a transaction

## Database Models

The application uses SQLAlchemy ORM for database interactions with the following models:

### User Model (app/models/user.py)

Represents a user in the system:

- `id`: Unique identifier
- `email`: User's email address (unique)
- `full_name`: User's full name
- `hashed_password`: Securely hashed password
- `role`: User role (admin, agent, user)
- `created_at`: Account creation timestamp
- `updated_at`: Last update timestamp

### Property Model (app/models/property.py)

Represents a real estate property:

- `id`: Unique identifier
- `address`: Property address
- `property_type`: Type of property (apartment, house, land)
- `size`: Property size in square meters
- `rooms`: Number of rooms (for apartments/houses)
- `description`: Property description
- `owner_id`: Reference to the property owner
- `status`: Property status (active, pending, sold)
- `created_at`: Registration timestamp
- `updated_at`: Last update timestamp

### Transaction Model (app/models/transaction.py)

Represents a property transaction:

- `id`: Unique identifier
- `property_id`: Reference to the property
- `seller_id`: Reference to the seller
- `buyer_id`: Reference to the buyer
- `price`: Transaction price
- `status`: Transaction status (pending, completed, cancelled)
- `payment_method`: Method of payment
- `created_at`: Transaction creation timestamp
- `updated_at`: Last update timestamp

## Blockchain Integration

The blockchain integration is implemented in the `app/blockchain` module:

### Blockchain Models (app/blockchain/models)

Defines data structures for blockchain records:

- `PropertyRecord`: Represents a property on the blockchain
- `OwnershipTransfer`: Represents a property ownership transfer
- `TransactionRecord`: Represents a blockchain transaction

### Blockchain Service (app/blockchain/service.py)

Provides an interface for interacting with the blockchain:

- `register_property`: Registers a property on the blockchain
- `transfer_ownership`: Transfers property ownership
- `get_property_history`: Retrieves property transaction history
- `verify_property`: Verifies property information on the blockchain

## Authentication and Authorization

Authentication and authorization are implemented using JWT tokens:

### JWT Authentication (app/core/security.py)

- Token generation and validation
- Password hashing and verification
- Role-based access control

### Dependencies (app/core/dependencies.py)

- `get_current_user`: Dependency for retrieving the current authenticated user
- `get_current_active_user`: Ensures the user is active
- `get_current_admin_user`: Ensures the user has admin privileges

## Services

The business logic is implemented in service modules:

### User Service (app/services/user_service.py)

- User registration and profile management
- Password management
- User search and filtering

### Property Service (app/services/property_service.py)

- Property registration and management
- Property search and filtering
- Ownership verification

### Transaction Service (app/services/transaction_service.py)

- Transaction creation and management
- Transaction status updates
- Payment processing

### Document Service (app/services/document_service.py)

- Document upload and storage
- Document verification
- Document retrieval

## Error Handling

The application implements comprehensive error handling:

- Custom exception classes for different error types
- Exception handlers for converting exceptions to appropriate HTTP responses
- Validation error handling for request data

## Logging

The application uses structured logging:

- Request logging middleware
- Error logging
- Audit logging for sensitive operations
- Performance logging for monitoring

## Configuration

The application is configured using environment variables:

- Database connection settings
- JWT secret key and token expiration
- CORS settings
- Blockchain connection settings
- AWS service configurations

## Testing

The backend includes comprehensive tests:

- Unit tests for individual components
- Integration tests for API endpoints
- Blockchain integration tests
- Performance tests for critical operations

## Deployment

The backend is deployed using AWS Elastic Beanstalk:

- Docker containerization
- Load balancing for high availability
- Auto-scaling for handling traffic spikes
- Health checks and monitoring