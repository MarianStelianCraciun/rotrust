"""
Blockchain Data Models for RoTrust.

This module defines the data models for blockchain records, including property
ownership records, transaction history, and other blockchain-related data structures.

Implementation Guidelines:
1. Define Pydantic models for blockchain data structures
2. Ensure models are compatible with Hyperledger Fabric data structures
3. Include validation rules for data integrity
4. Implement serialization/deserialization methods for blockchain data
5. Define relationships between models where applicable
"""

from typing import Dict, List, Optional, Any, Union
from pydantic import BaseModel, Field, field_validator
from datetime import datetime
import uuid


class BlockchainTransaction(BaseModel):
    """
    Model representing a blockchain transaction.
    
    This model captures the metadata for a transaction recorded on the blockchain,
    including transaction ID, timestamp, and transaction type.
    """
    
    transaction_id: str = Field(
        default_factory=lambda: str(uuid.uuid4()),
        description="Unique identifier for the transaction"
    )
    timestamp: datetime = Field(
        default_factory=datetime.utcnow,
        description="Timestamp when the transaction was created"
    )
    transaction_type: str = Field(
        description="Type of transaction (e.g., 'create', 'update', 'transfer')"
    )
    channel_id: str = Field(
        description="Hyperledger Fabric channel ID"
    )
    chaincode_id: str = Field(
        description="Hyperledger Fabric chaincode ID"
    )
    creator_msp_id: str = Field(
        description="MSP ID of the transaction creator"
    )
    endorsements: List[str] = Field(
        default_factory=list,
        description="List of endorsements for the transaction"
    )
    
    model_config = {
        "json_encoders": {
            datetime: lambda dt: dt.isoformat()
        }
    }


class PropertyRecord(BaseModel):
    """
    Model representing a property record on the blockchain.
    
    This model captures the property details stored on the blockchain,
    including property ID, address, owner, and property attributes.
    """
    
    property_id: str = Field(
        description="Unique identifier for the property"
    )
    address: str = Field(
        description="Physical address of the property"
    )
    owner_id: str = Field(
        description="ID of the current property owner"
    )
    property_type: str = Field(
        description="Type of property (e.g., 'apartment', 'house', 'land')"
    )
    size: float = Field(
        description="Size of the property in square meters"
    )
    registration_date: datetime = Field(
        description="Date when the property was registered"
    )
    status: str = Field(
        description="Current status of the property (e.g., 'active', 'pending', 'inactive')"
    )
    attributes: Dict[str, Any] = Field(
        default_factory=dict,
        description="Additional property attributes"
    )
    
    @field_validator('property_type')
    def validate_property_type(cls, v):
        """Validate property type."""
        valid_types = ['apartment', 'house', 'land', 'commercial', 'industrial']
        if v not in valid_types:
            raise ValueError(f"Property type must be one of {valid_types}")
        return v
    
    @field_validator('status')
    def validate_status(cls, v):
        """Validate property status."""
        valid_statuses = ['active', 'pending', 'inactive']
        if v not in valid_statuses:
            raise ValueError(f"Status must be one of {valid_statuses}")
        return v
    
    model_config = {
        "json_encoders": {
            datetime: lambda dt: dt.isoformat()
        }
    }


class OwnershipTransfer(BaseModel):
    """
    Model representing an ownership transfer transaction.
    
    This model captures the details of a property ownership transfer,
    including the property ID, previous owner, new owner, and transfer details.
    """
    
    transfer_id: str = Field(
        default_factory=lambda: str(uuid.uuid4()),
        description="Unique identifier for the transfer"
    )
    property_id: str = Field(
        description="ID of the property being transferred"
    )
    previous_owner_id: str = Field(
        description="ID of the previous property owner"
    )
    new_owner_id: str = Field(
        description="ID of the new property owner"
    )
    transfer_date: datetime = Field(
        default_factory=datetime.utcnow,
        description="Date when the transfer occurred"
    )
    transaction_id: str = Field(
        description="ID of the blockchain transaction"
    )
    price: Optional[float] = Field(
        None,
        description="Price of the property transfer (if applicable)"
    )
    notes: Optional[str] = Field(
        None,
        description="Additional notes about the transfer"
    )
    
    model_config = {
        "json_encoders": {
            datetime: lambda dt: dt.isoformat()
        }
    }


class PropertyHistory(BaseModel):
    """
    Model representing the history of a property.
    
    This model captures the complete history of a property,
    including all transactions and ownership transfers.
    """
    
    property_id: str = Field(
        description="ID of the property"
    )
    transactions: List[BlockchainTransaction] = Field(
        default_factory=list,
        description="List of transactions related to the property"
    )
    ownership_transfers: List[OwnershipTransfer] = Field(
        default_factory=list,
        description="List of ownership transfers for the property"
    )
    
    model_config = {
        "json_encoders": {
            datetime: lambda dt: dt.isoformat()
        }
    }


class BlockchainQueryResult(BaseModel):
    """
    Model representing the result of a blockchain query.
    
    This model captures the result of a query to the blockchain,
    including the query status and result data.
    """
    
    query_id: str = Field(
        default_factory=lambda: str(uuid.uuid4()),
        description="Unique identifier for the query"
    )
    query_timestamp: datetime = Field(
        default_factory=datetime.utcnow,
        description="Timestamp when the query was executed"
    )
    query_status: str = Field(
        description="Status of the query (e.g., 'success', 'error')"
    )
    result_count: int = Field(
        description="Number of results returned by the query"
    )
    results: List[Dict[str, Any]] = Field(
        default_factory=list,
        description="List of query results"
    )
    error_message: Optional[str] = Field(
        None,
        description="Error message (if query_status is 'error')"
    )
    
    @field_validator('query_status')
    def validate_query_status(cls, v):
        """Validate query status."""
        valid_statuses = ['success', 'error', 'pending']
        if v not in valid_statuses:
            raise ValueError(f"Query status must be one of {valid_statuses}")
        return v
    
    model_config = {
        "json_encoders": {
            datetime: lambda dt: dt.isoformat()
        }
    }