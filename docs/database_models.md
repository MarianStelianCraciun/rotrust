# RoTrust Database Models

This document provides comprehensive documentation for the database models used in the RoTrust platform. These models define the structure of the data stored in the PostgreSQL database and their relationships.

## Table of Contents

1. [Base Model](#base-model)
2. [User Model](#user-model)
3. [Property Model](#property-model)
4. [Transaction Model](#transaction-model)
5. [Document Model](#document-model)
6. [Entity Relationship Diagram](#entity-relationship-diagram)

## Base Model

The `BaseModel` is an abstract base class that provides common fields for all models in the system.

### Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | String | Primary key, automatically generated UUID |
| `created_at` | DateTime | Timestamp when the record was created |
| `updated_at` | DateTime | Timestamp when the record was last updated |

## User Model

The `User` model represents users of the RoTrust platform, including property owners, buyers, and administrators.

### Fields

| Field | Type | Description |
|-------|------|-------------|
| `username` | String | Unique username for the user |
| `email` | String | Email address of the user |
| `hashed_password` | String | Hashed password for authentication |
| `full_name` | String | Full name of the user |
| `cnp` | String | Romanian personal identification number (Cod Numeric Personal) |
| `id_type` | String | Type of ID document (e.g., "carte de identitate", "pașaport") |
| `id_number` | String | ID document number |
| `id_issued_by` | String | Authority that issued the ID document |
| `id_issue_date` | Date | Date when the ID document was issued |
| `id_expiry_date` | Date | Date when the ID document expires |
| `address` | String | User's address |
| `phone` | String | User's phone number |
| `role` | String | Role of the user (e.g., "admin", "utilizator", "agent") |
| `is_active` | Boolean | Whether the user account is active |

### Relationships

| Relationship | Related Model | Description |
|--------------|---------------|-------------|
| `properties` | Property | Properties owned by the user |
| `transactions_as_buyer` | Transaction | Transactions where the user is the buyer |
| `transactions_as_seller` | Transaction | Transactions where the user is the seller |

## Property Model

The `Property` model represents real estate properties according to Romanian standards.

### Fields

| Field | Type | Description |
|-------|------|-------------|
| `cadastral_number` | String | Unique cadastral number (număr cadastral) assigned by ANCPI |
| `land_book_number` | String | Land book number (număr carte funciară) for the property |
| `address` | String | Full address of the property |
| `property_type` | String | Type of property according to Romanian classification (e.g., "apartament", "casă", "teren", "spațiu comercial") |
| `size` | Float | Size of the property in square meters |
| `rooms` | Integer | Number of rooms (for residential properties) |
| `floor` | Integer | Floor number for apartments (etaj) |
| `building_year` | Integer | Year when the building was constructed |
| `energy_certificate` | String | Energy efficiency certificate rating (A-G) |
| `has_parking` | Boolean | Whether the property includes parking |
| `land_category` | String | Category of land according to Romanian classification (e.g., "intravilan", "extravilan", "agricol", "forestier") |
| `land_usage` | String | Usage type for land (e.g., "construcții", "arabil", "pășune") |
| `description` | Text | Detailed description of the property |
| `status` | String | Status of the property (e.g., "activ", "vândut", "rezervat") |
| `owner_id` | String | ID of the property owner (foreign key to User) |

### Relationships

| Relationship | Related Model | Description |
|--------------|---------------|-------------|
| `owner` | User | User who owns the property |
| `documents` | Document | Documents associated with the property |
| `transactions` | Transaction | Transactions involving this property |

## Transaction Model

The `Transaction` model represents property transfer transactions between users.

### Fields

| Field | Type | Description |
|-------|------|-------------|
| `property_id` | String | ID of the property being transferred (foreign key to Property) |
| `seller_id` | String | ID of the seller (foreign key to User) |
| `buyer_id` | String | ID of the buyer (foreign key to User) |
| `price` | Float | Price of the property in the transaction |
| `payment_method` | String | Method of payment (e.g., "transfer bancar", "credit ipotecar") |
| `transaction_date` | Date | Date when the transaction was completed |
| `notary_id` | String | ID of the notary who validated the transaction |
| `notary_fee` | Float | Fee paid to the notary |
| `tax_amount` | Float | Tax amount paid for the transaction |
| `contract_number` | String | Contract number for the transaction |
| `status` | String | Status of the transaction (e.g., "în curs", "finalizat", "anulat") |
| `notes` | Text | Additional notes about the transaction |

### Relationships

| Relationship | Related Model | Description |
|--------------|---------------|-------------|
| `property` | Property | Property involved in the transaction |
| `seller` | User | User who is selling the property |
| `buyer` | User | User who is buying the property |
| `documents` | Document | Documents associated with the transaction |

## Document Model

The `Document` model represents legal and property-related documents.

### Fields

| Field | Type | Description |
|-------|------|-------------|
| `title` | String | Title of the document |
| `document_type` | String | Type of document (e.g., "act de proprietate", "contract de vânzare-cumpărare", "extras de carte funciară") |
| `file_path` | String | Path to the document file in S3 storage |
| `file_hash` | String | Hash of the document file for integrity verification |
| `issue_date` | Date | Date when the document was issued |
| `expiry_date` | Date | Date when the document expires (if applicable) |
| `issuer` | String | Authority or person who issued the document |
| `is_verified` | Boolean | Whether the document has been verified |
| `property_id` | String | ID of the property associated with the document (foreign key to Property) |
| `transaction_id` | String | ID of the transaction associated with the document (foreign key to Transaction) |
| `notes` | Text | Additional notes about the document |

### Relationships

| Relationship | Related Model | Description |
|--------------|---------------|-------------|
| `property` | Property | Property associated with the document |
| `transaction` | Transaction | Transaction associated with the document |

## Entity Relationship Diagram

Below is a simplified entity relationship diagram showing the relationships between the main models in the RoTrust platform:

```
+-------------+       +---------------+       +----------------+
|    User     |       |   Property    |       |  Transaction   |
+-------------+       +---------------+       +----------------+
| id          |<----->| id            |<----->| id             |
| username    |       | cadastral_num |       | property_id    |
| email       |       | address       |       | seller_id      |
| full_name   |       | property_type |       | buyer_id       |
| cnp         |       | size          |       | price          |
| role        |       | status        |       | status         |
| ...         |       | owner_id      |       | ...            |
+-------------+       +---------------+       +----------------+
      ^                      ^                       ^
      |                      |                       |
      |                      |                       |
      v                      v                       v
+--------------------------------------------------+
|                    Document                      |
+--------------------------------------------------+
| id                                               |
| title                                            |
| document_type                                    |
| file_path                                        |
| file_hash                                        |
| property_id                                      |
| transaction_id                                   |
| ...                                              |
+--------------------------------------------------+
```

## Database Schema Evolution

The database schema is designed to evolve over time as new requirements emerge. The following principles guide schema evolution:

1. **Backward Compatibility**: Changes to the schema should maintain backward compatibility whenever possible.
2. **Migration Scripts**: All schema changes are managed through migration scripts using Alembic.
3. **Data Integrity**: Constraints and relationships are carefully designed to maintain data integrity.
4. **Performance Optimization**: Indexes are created on frequently queried fields to optimize performance.

## Database Transactions

The RoTrust platform uses database transactions to ensure data consistency, especially for property transfers and document updates. Transactions are used in the following scenarios:

1. **Property Transfers**: When a property is transferred from one owner to another, multiple database updates are wrapped in a transaction.
2. **Document Verification**: When documents are verified, the document status and related property status updates are performed in a transaction.
3. **User Registration**: When a new user is registered with associated properties, the creation of user and property records is done in a transaction.

## Data Validation

Data validation is performed at multiple levels:

1. **API Level**: Input data is validated using Pydantic models before reaching the database.
2. **Database Level**: Constraints and checks are defined at the database level to ensure data integrity.
3. **Application Level**: Business logic validation is performed in service layers before database operations.

## Audit Trail

The RoTrust platform maintains an audit trail of all significant database changes, especially for property and transaction records. The audit trail includes:

1. **Creation and Update Timestamps**: All records include created_at and updated_at timestamps.
2. **User Attribution**: Changes are attributed to specific users when applicable.
3. **Change History**: For critical records like properties and transactions, a history of changes is maintained.

## Backup and Recovery

The database is backed up regularly using the following strategy:

1. **Daily Full Backups**: Complete database backups are performed daily.
2. **Point-in-Time Recovery**: Transaction logs are backed up continuously to enable point-in-time recovery.
3. **Backup Verification**: Backups are regularly verified to ensure they can be successfully restored.
4. **Multi-Region Replication**: For disaster recovery, the database is replicated to a secondary AWS region.