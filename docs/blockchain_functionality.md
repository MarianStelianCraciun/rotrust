# RoTrust Blockchain Functionality

This document provides detailed documentation for the blockchain functionality in the RoTrust platform, including the blockchain models, services, and integration with the rest of the application.

## Table of Contents

1. [Overview](#overview)
2. [Blockchain Models](#blockchain-models)
3. [Blockchain Service](#blockchain-service)
4. [Integration Points](#integration-points)
5. [Transaction Flow](#transaction-flow)
6. [Security Considerations](#security-considerations)

## Overview

RoTrust uses Amazon Managed Blockchain with Hyperledger Fabric to provide an immutable ledger for property transactions and ownership records. The blockchain component ensures that all property transfers and ownership changes are recorded in a tamper-proof manner, providing a reliable source of truth for property ownership.

The blockchain functionality is implemented through a set of Pydantic models that define the data structures for blockchain records, and a service layer that provides methods for interacting with the blockchain network.

## Blockchain Models

The blockchain models define the data structures for blockchain records. These models are implemented using Pydantic and include validation rules to ensure data integrity.

### BlockchainTransaction

The `BlockchainTransaction` model represents a transaction recorded on the blockchain.

```python
class BlockchainTransaction(BaseModel):
    """Model representing a blockchain transaction."""
    transaction_id: str
    timestamp: datetime
    transaction_type: str
    channel_id: str
    chaincode_id: str
    creator_msp_id: str
    endorsements: list[str]
```

**Fields:**
- `transaction_id`: Unique identifier for the transaction
- `timestamp`: Timestamp when the transaction was created
- `transaction_type`: Type of transaction (e.g., 'create', 'update', 'transfer')
- `channel_id`: Hyperledger Fabric channel ID
- `chaincode_id`: Hyperledger Fabric chaincode ID
- `creator_msp_id`: MSP ID of the transaction creator
- `endorsements`: List of endorsements for the transaction

### PropertyRecord

The `PropertyRecord` model represents a property record on the blockchain.

```python
class PropertyRecord(BaseModel):
    property_id: str
    address: str
    owner_id: str
    property_type: str
    size: float
    registration_date: datetime
    status: str
    attributes: Dict[str, Any]
```

**Fields:**
- `property_id`: Unique identifier for the property
- `address`: Physical address of the property
- `owner_id`: ID of the current property owner
- `property_type`: Type of property (e.g., 'apartment', 'house', 'land')
- `size`: Size of the property in square meters
- `registration_date`: Date when the property was registered
- `status`: Current status of the property (e.g., 'active', 'pending', 'inactive')
- `attributes`: Additional property attributes

**Validation:**
- `property_type` must be one of: 'apartment', 'house', 'land', 'commercial', 'industrial'
- `status` must be one of: 'active', 'pending', 'inactive'

### OwnershipTransfer

The `OwnershipTransfer` model represents an ownership transfer transaction.

```python
class OwnershipTransfer(BaseModel):
    transfer_id: str
    property_id: str
    previous_owner_id: str
    new_owner_id: str
    transfer_date: datetime
    transaction_id: str
    price: Optional[float]
    notes: Optional[str]
```

**Fields:**
- `transfer_id`: Unique identifier for the transfer
- `property_id`: ID of the property being transferred
- `previous_owner_id`: ID of the previous property owner
- `new_owner_id`: ID of the new property owner
- `transfer_date`: Date when the transfer occurred
- `transaction_id`: ID of the blockchain transaction
- `price`: Price of the property transfer (if applicable)
- `notes`: Additional notes about the transfer

### PropertyHistory

The `PropertyHistory` model represents the history of a property.

```python
class PropertyHistory(BaseModel):
    property_id: str
    transactions: List[BlockchainTransaction]
    ownership_transfers: List[OwnershipTransfer]
```

**Fields:**
- `property_id`: ID of the property
- `transactions`: List of transactions related to the property
- `ownership_transfers`: List of ownership transfers for the property

### BlockchainQueryResult

The `BlockchainQueryResult` model represents the result of a blockchain query.

```python
class BlockchainQueryResult(BaseModel):
    query_id: str
    query_timestamp: datetime
    query_status: str
    result_count: int
    results: List[Dict[str, Any]]
    error_message: Optional[str]
```

**Fields:**
- `query_id`: Unique identifier for the query
- `query_timestamp`: Timestamp when the query was executed
- `query_status`: Status of the query (e.g., 'success', 'error')
- `result_count`: Number of results returned by the query
- `results`: List of query results
- `error_message`: Error message (if query_status is 'error')

**Validation:**
- `query_status` must be one of: 'success', 'error', 'pending'

## Blockchain Service

The `BlockchainService` class provides methods for interacting with the blockchain network. It handles the connection to the Amazon Managed Blockchain network and provides methods for submitting transactions and querying the blockchain.

### Initialization

```python
def __init__(self, network_id: str, member_id: str, channel_name: str, chaincode_name: str)
```

**Parameters:**
- `network_id`: ID of the Amazon Managed Blockchain network
- `member_id`: ID of the member in the network
- `channel_name`: Name of the Hyperledger Fabric channel
- `chaincode_name`: Name of the Hyperledger Fabric chaincode

### Connection

```python
def connect(self)
```

Establishes a connection to the Amazon Managed Blockchain network.

### Transaction Submission

```python
def submit_transaction(self, function_name: str, args: List[str]) -> BlockchainTransaction
```

**Parameters:**
- `function_name`: Name of the chaincode function to invoke
- `args`: List of arguments for the chaincode function

**Returns:**
- `BlockchainTransaction`: Transaction record for the submitted transaction

### Blockchain Query

```python
def query_blockchain(self, function_name: str, args: List[str]) -> BlockchainQueryResult
```

**Parameters:**
- `function_name`: Name of the chaincode function to query
- `args`: List of arguments for the chaincode function

**Returns:**
- `BlockchainQueryResult`: Query result from the blockchain

### Property Registration

```python
def register_property(self, property_data: PropertyRecord) -> str
```

**Parameters:**
- `property_data`: Property record to register on the blockchain

**Returns:**
- `str`: ID of the registered property

### Property Retrieval

```python
def get_property(self, property_id: str) -> PropertyRecord
```

**Parameters:**
- `property_id`: ID of the property to retrieve

**Returns:**
- `PropertyRecord`: Property record from the blockchain

### Ownership Transfer

```python
def transfer_ownership(self, property_id: str, new_owner_id: str) -> OwnershipTransfer
```

**Parameters:**
- `property_id`: ID of the property to transfer
- `new_owner_id`: ID of the new owner

**Returns:**
- `OwnershipTransfer`: Ownership transfer record

### Property History Retrieval

```python
def get_property_history(self, property_id: str) -> PropertyHistory
```

**Parameters:**
- `property_id`: ID of the property to retrieve history for

**Returns:**
- `PropertyHistory`: History of the property

### Property Query by Owner

```python
def query_properties_by_owner(self, owner_id: str) -> List[PropertyRecord]
```

**Parameters:**
- `owner_id`: ID of the owner to query properties for

**Returns:**
- `List[PropertyRecord]`: List of properties owned by the specified owner

## Integration Points

The blockchain functionality is integrated with the rest of the RoTrust platform through several integration points:

### API Integration

The blockchain functionality is exposed through the API endpoints in the `properties` and `transactions` routers. These endpoints allow clients to interact with the blockchain through a RESTful API.

### Service Integration

The blockchain service is integrated with other services in the application, such as the `PropertyService` and `TransactionService`. These services use the blockchain service to record property registrations and transfers on the blockchain.

### Database Synchronization

The blockchain records are synchronized with the database to ensure consistency between the blockchain and the database. This synchronization is handled by event listeners that update the database when blockchain events occur.

## Transaction Flow

The transaction flow for property transfers involves several steps:

1. **Initiate Transfer**: A user initiates a property transfer through the API.
2. **Validate Transfer**: The application validates the transfer request, checking that the user is authorized to transfer the property.
3. **Record Transfer**: The application records the transfer on the blockchain using the `transfer_ownership` method of the blockchain service.
4. **Update Database**: The application updates the database to reflect the new ownership.
5. **Notify Parties**: The application notifies the buyer and seller of the completed transfer.

## Security Considerations

The blockchain functionality includes several security considerations:

### Authentication and Authorization

Access to the blockchain is controlled through authentication and authorization mechanisms. Only authorized users can submit transactions to the blockchain.

### Data Validation

All data submitted to the blockchain is validated using the Pydantic models to ensure data integrity.

### Transaction Endorsement

Transactions are endorsed by multiple parties before being committed to the blockchain, ensuring that all parties agree to the transaction.

### Audit Trail

All blockchain transactions are recorded in an immutable ledger, providing a complete audit trail of all property transfers and ownership changes.

### Encryption

Sensitive data is encrypted before being stored on the blockchain, ensuring that only authorized parties can access the data.

## Conclusion

The blockchain functionality in the RoTrust platform provides a secure and reliable way to record property ownership and transfers. By leveraging Amazon Managed Blockchain with Hyperledger Fabric, RoTrust ensures that property records are tamper-proof and can be trusted by all parties involved in real estate transactions.