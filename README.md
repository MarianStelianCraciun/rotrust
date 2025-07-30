# RoTrust: Real Estate Registry

A digital platform revolutionizing real estate transactions in Romania by reducing fraud, streamlining property transfers, and creating a transparent record of ownership history.

## Problem Statement

Romania's real estate market faces significant challenges with documentation, verification, and trust. The current system is:
- Prone to fraud and documentation errors
- Time-consuming with lengthy verification processes
- Lacking transparency in ownership history
- Burdened with complex bureaucratic procedures

## Our Solution

RoTrust is a secure, transparent, and efficient real estate registry that:
- Provides reliable records of property ownership
- Streamlines transaction processes
- Reduces fraud through robust verification
- Creates a single source of truth for property information
- Integrates with existing notary and land registry systems

## Technical Architecture

RoTrust is built on a robust technical foundation:

### Backend (Python/FastAPI)
- **Framework**: FastAPI for high-performance, async API endpoints
- **Authentication**: JWT-based authentication system
- **Database**: PostgreSQL with SQLAlchemy ORM
- **API Structure**:
  - `/api/auth`: Authentication endpoints
  - `/api/users`: User management
  - `/api/properties`: Property registration and management
  - `/api/transactions`: Transaction processing

### Data Storage Layer
- **Database**: PostgreSQL for persistent data storage
- **Data Models**: Comprehensive models for properties, transactions, and user data
- **Backup System**: Regular automated backups to ensure data integrity

### Security Layer
- **Authentication**: JWT-based secure authentication
- **Authorization**: Role-based access control
- **Data Encryption**: Sensitive data encrypted at rest and in transit
- **Audit Logging**: Comprehensive logging of all system activities

## Key Features

- **Comprehensive Property Records**: Complete history of ownership and transactions
- **Process Automation**: Automated escrow, payments, and transfers
- **Verification Services**: Quick property history and ownership verification
- **Notary Integration**: Seamless connection with existing legal frameworks
- **Institutional API Access**: Secure access for banks and government institutions
- **Mobile Access**: User-friendly mobile application for property searches and verification

## Benefits

- **For Property Buyers**: Reduced risk of fraud, transparent history, faster transactions
- **For Property Sellers**: Quicker sales, reduced paperwork, secure transfers
- **For Real Estate Agencies**: Streamlined processes, verified listings, competitive advantage
- **For Banks**: Reduced risk in mortgage lending, faster verification processes
- **For Government**: Improved tax collection, reduced fraud, better market oversight

## Pricing Model

RoTrust offers a flexible pricing structure to accommodate different user needs:

| Service | Price Range |
|---------|-------------|
| Transaction Fee | 0.1-0.3% of property value |
| Real Estate Agency Subscription | €200-800/month |
| Property History Verification | €50-100 per property |
| API Access for Institutions | €1,000-3,000/month |

## Market Potential

Romania's real estate market presents significant opportunities:
- Market value of approximately €25 billion annually
- Growing demand for secure and efficient property transactions
- Increasing adoption of digital solutions in real estate
- Strong need for technological improvements in transaction security

## Getting Started

### Prerequisites
- Python 3.8+ (Python 3.13 recommended)
- Poetry (Python dependency management)
- Docker and Docker Compose (for containerized deployment)
- Node.js 14+ (for frontend)

### Installing Poetry
```bash
# Install Poetry (Windows PowerShell)
(Invoke-WebRequest -Uri https://install.python-poetry.org -UseBasicParsing).Content | python -

# Add Poetry to your PATH
# The installer will instruct you to add Poetry to your PATH
```

### Python Version
This project supports Python 3.8 through 3.13. Python 3.13 is recommended for the best performance and latest features. Poetry will automatically manage the virtual environment with the appropriate Python version.

### Installation

#### Using Makefile (Recommended)

RoTrust provides a Makefile to simplify setup and operation:

```bash
# Clone the repository
git clone https://github.com/your-organization/rotrust.git
cd rotrust

# Set up the entire project (installs dependencies and sets up frontend)
make setup

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Run the backend server
make run-backend

# In a separate terminal, run the frontend server
make run-frontend
```

For more options, run `make help` to see all available commands.

#### Manual Installation

If you prefer not to use the Makefile, you can follow these steps:

```bash
# Clone the repository
git clone https://github.com/your-organization/rotrust.git
cd rotrust

# Install dependencies using Poetry
# For production dependencies only
poetry install --no-dev

# Or for all dependencies including development tools
poetry install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Start the FastAPI application
cd backend
poetry run uvicorn main:app --reload
```

#### Using Batch Files (Windows)

For Windows users, we provide batch files for easy startup:

```bash
# Clone the repository
git clone https://github.com/your-organization/rotrust.git
cd rotrust

# Install dependencies using Poetry
poetry install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Run the backend server
run_backend.bat

# In a separate terminal, run the frontend server
run_frontend.bat

# Or run both backend and frontend with a single command
run_all.bat
```

## API Documentation

### Authentication API

```
# Login
POST /api/auth/login

Request body:
{
    "username": "user@example.com",
    "password": "securepassword"
}

Response:
{
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "bearer",
    "user_id": "user123",
    "expires_in": 1800
}

# Register new user
POST /api/auth/register

Request body:
{
    "email": "user@example.com",
    "password": "securepassword",
    "full_name": "John Doe",
    "role": "agent"
}

Response:
{
    "user_id": "user123",
    "email": "user@example.com",
    "full_name": "John Doe",
    "role": "agent",
    "created_at": "2025-07-30T21:51:00Z"
}
```

### Users API

```
# Get user profile
GET /api/users/me

Response:
{
    "user_id": "user123",
    "email": "user@example.com",
    "full_name": "John Doe",
    "role": "agent",
    "created_at": "2025-07-30T21:51:00Z"
}

# Update user profile
PUT /api/users/me

Request body:
{
    "full_name": "John Smith",
    "phone": "+40721234567"
}

Response:
{
    "user_id": "user123",
    "email": "user@example.com",
    "full_name": "John Smith",
    "phone": "+40721234567",
    "role": "agent",
    "created_at": "2025-07-30T21:51:00Z",
    "updated_at": "2025-07-30T22:00:00Z"
}
```

## Usage Examples

### API Usage Examples

#### Properties API

```
# Register a property
POST /api/properties/

Request body:
{
    "address": "123 Main St, Bucharest",
    "property_type": "apartment",
    "size": 85.5,
    "rooms": 3,
    "description": "Modern apartment in central location",
    "owner_id": "user123",
    "documents": ["deed123", "certificate456"]
}

# Get property details
GET /api/properties/{property_id}

# List properties with optional filtering
GET /api/properties/?owner_id=user123&property_type=apartment

# Update property details
PUT /api/properties/{property_id}

Request body:
{
    "address": "123 Main St, Bucharest",
    "property_type": "apartment",
    "size": 90.5,
    "rooms": 3,
    "description": "Updated description"
}
```

#### Transactions API

```
# Initiate property transfer
POST /api/transactions/transfers/

Request body:
{
    "property_id": "prop123",
    "seller_id": "user123",
    "buyer_id": "user456",
    "price": 120000.00,
    "payment_method": "bank_transfer",
    "notes": "Optional notes about the transaction"
}

# Get transaction details
GET /api/transactions/transfers/{transaction_id}

# List transactions with filtering
GET /api/transactions/transfers/?property_id=prop123&status=pending

# Cancel a transaction
PUT /api/transactions/transfers/{transaction_id}/cancel
```

## Contributing

We welcome contributions to the RoTrust project. Please note that we have implemented branch protection rules to maintain code quality:

- **Direct pushes to the main branch are not allowed**
- All changes must be made through pull requests
- Pull requests require specific approval before merging
- **Only pull requests approved by the repository owner can be merged to main**

To contribute:

1. Fork the repository (if you're an external contributor) or create a new branch (if you're a team member)
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

For detailed contribution guidelines, please see our [CONTRIBUTING.md](.github/CONTRIBUTING.md) file. For comprehensive workflow guidelines that ensure accurate and concise development processes, refer to our [WORKFLOW_GUIDELINES.md](.github/WORKFLOW_GUIDELINES.md) document.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

RoTrust Team - contact@rotrust.ro

Project Link: [https://github.com/your-organization/rotrust](https://github.com/your-organization/rotrust)

---

© 2025 RoTrust. All Rights Reserved.