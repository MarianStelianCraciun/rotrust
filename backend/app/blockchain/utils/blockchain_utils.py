"""
Blockchain Utilities for Amazon Managed Blockchain (Hyperledger Fabric).

This module provides utility functions and helpers for blockchain operations,
including cryptographic functions, data conversion, and configuration management.

Implementation Guidelines:
1. Implement cryptographic functions for blockchain operations
2. Create data conversion utilities for blockchain data
3. Implement configuration management for blockchain settings
4. Add helper functions for common blockchain operations
5. Implement error handling and validation utilities
"""

import os
import json
import base64
import hashlib
import datetime
from typing import Dict, List, Optional, Any, Union


def generate_transaction_id(timestamp: datetime.datetime = None) -> str:
    """
    Generate a unique transaction ID for blockchain transactions.
    
    Args:
        timestamp (datetime.datetime, optional): Timestamp to use for ID generation.
            Defaults to current UTC time.
            
    Returns:
        str: A unique transaction ID
    """
    if timestamp is None:
        timestamp = datetime.datetime.utcnow()
    
    # Create a unique string based on timestamp
    timestamp_str = timestamp.isoformat()
    
    # Generate a hash of the timestamp
    hash_obj = hashlib.sha256(timestamp_str.encode())
    hash_hex = hash_obj.hexdigest()
    
    # Return a portion of the hash as the transaction ID
    return hash_hex[:24]


def hash_document(document_content: bytes) -> str:
    """
    Generate a hash of a document for blockchain storage.
    
    Args:
        document_content (bytes): The document content to hash
        
    Returns:
        str: The document hash
    """
    # Generate SHA-256 hash of the document
    hash_obj = hashlib.sha256(document_content)
    hash_hex = hash_obj.hexdigest()
    
    return hash_hex


def encode_for_blockchain(data: Dict[str, Any]) -> str:
    """
    Encode data for storage on the blockchain.
    
    Args:
        data (Dict[str, Any]): The data to encode
        
    Returns:
        str: The encoded data as a JSON string
    """
    # Convert datetime objects to ISO format strings
    def json_serializer(obj):
        if isinstance(obj, datetime.datetime):
            return obj.isoformat()
        raise TypeError(f"Type {type(obj)} not serializable")
    
    # Serialize the data to JSON
    json_data = json.dumps(data, default=json_serializer)
    
    return json_data


def decode_from_blockchain(encoded_data: str) -> Dict[str, Any]:
    """
    Decode data from the blockchain.
    
    Args:
        encoded_data (str): The encoded data from the blockchain
        
    Returns:
        Dict[str, Any]: The decoded data
    """
    # Parse the JSON data
    data = json.loads(encoded_data)
    
    # Convert ISO format strings back to datetime objects
    for key, value in data.items():
        if isinstance(value, str) and len(value) > 10:
            try:
                data[key] = datetime.datetime.fromisoformat(value)
            except ValueError:
                # Not a valid ISO format datetime string
                pass
    
    return data


def get_blockchain_config() -> Dict[str, str]:
    """
    Get blockchain configuration from environment variables.
    
    Returns:
        Dict[str, str]: The blockchain configuration
    """
    config = {
        "network_id": os.getenv("BLOCKCHAIN_NETWORK_ID", "n-XXXXXXXXX"),
        "member_id": os.getenv("BLOCKCHAIN_MEMBER_ID", "m-XXXXXXXXX"),
        "channel_name": os.getenv("BLOCKCHAIN_CHANNEL_NAME", "rotrust-channel"),
        "chaincode_name": os.getenv("BLOCKCHAIN_CHAINCODE_NAME", "rotrust-chaincode"),
        "msp_id": os.getenv("BLOCKCHAIN_MSP_ID", "m-XXXXXXXXX"),
        "endpoint": os.getenv("BLOCKCHAIN_ENDPOINT", "https://managedblockchain.eu-central-1.amazonaws.com"),
        "region": os.getenv("AWS_REGION", "eu-central-1")
    }
    
    return config


def validate_property_data(property_data: Dict[str, Any]) -> List[str]:
    """
    Validate property data for blockchain storage.
    
    Args:
        property_data (Dict[str, Any]): The property data to validate
        
    Returns:
        List[str]: List of validation errors, empty if valid
    """
    errors = []
    
    # Check required fields
    required_fields = ["property_id", "address", "owner_id", "property_type", "size", "status"]
    for field in required_fields:
        if field not in property_data or not property_data[field]:
            errors.append(f"Missing required field: {field}")
    
    # Validate property type
    if "property_type" in property_data:
        valid_types = ["apartment", "house", "land", "commercial", "industrial"]
        if property_data["property_type"] not in valid_types:
            errors.append(f"Invalid property type: {property_data['property_type']}. Must be one of {valid_types}")
    
    # Validate status
    if "status" in property_data:
        valid_statuses = ["active", "pending", "inactive"]
        if property_data["status"] not in valid_statuses:
            errors.append(f"Invalid status: {property_data['status']}. Must be one of {valid_statuses}")
    
    # Validate size
    if "size" in property_data:
        try:
            size = float(property_data["size"])
            if size <= 0:
                errors.append("Size must be greater than 0")
        except (ValueError, TypeError):
            errors.append("Size must be a number")
    
    return errors


def format_blockchain_error(error: Exception) -> Dict[str, Any]:
    """
    Format a blockchain error for API responses.
    
    Args:
        error (Exception): The blockchain error
        
    Returns:
        Dict[str, Any]: Formatted error response
    """
    error_response = {
        "error": True,
        "message": str(error),
        "error_type": error.__class__.__name__,
        "timestamp": datetime.datetime.utcnow().isoformat()
    }
    
    return error_response


def create_event_payload(event_type: str, data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Create a payload for blockchain events.
    
    Args:
        event_type (str): The type of event
        data (Dict[str, Any]): The event data
        
    Returns:
        Dict[str, Any]: The event payload
    """
    payload = {
        "event_type": event_type,
        "timestamp": datetime.datetime.utcnow().isoformat(),
        "data": data
    }
    
    return payload


def parse_blockchain_response(response: str) -> Dict[str, Any]:
    """
    Parse a response from the blockchain.
    
    Args:
        response (str): The blockchain response
        
    Returns:
        Dict[str, Any]: The parsed response
    """
    try:
        # Try to parse as JSON
        parsed_response = json.loads(response)
        return parsed_response
    except json.JSONDecodeError:
        # If not JSON, return as plain text
        return {"response": response}


def generate_certificate_request(org_name: str, common_name: str) -> Dict[str, Any]:
    """
    Generate a certificate request for blockchain identity.
    
    Args:
        org_name (str): The organization name
        common_name (str): The common name for the certificate
        
    Returns:
        Dict[str, Any]: The certificate request
    """
    # This is a placeholder for certificate request generation
    # In a real implementation, this would use cryptographic libraries
    # to generate a proper certificate signing request
    
    request = {
        "org_name": org_name,
        "common_name": common_name,
        "timestamp": datetime.datetime.utcnow().isoformat()
    }
    
    return request