"""
Test script to verify that the blockchain models work correctly with the updated Pydantic version.
"""

import sys
import os

# Add the parent directory to the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.app.blockchain.models.blockchain_models import (
    BlockchainTransaction,
    PropertyRecord,
    OwnershipTransfer,
    PropertyHistory,
    BlockchainQueryResult
)
from datetime import datetime

def test_blockchain_transaction():
    """Test BlockchainTransaction model."""
    transaction = BlockchainTransaction(
        transaction_type="create",
        channel_id="test-channel",
        chaincode_id="test-chaincode",
        creator_msp_id="test-msp"
    )
    
    # Verify that the model has the required fields
    assert transaction.transaction_id is not None
    assert transaction.timestamp is not None
    assert transaction.transaction_type == "create"
    assert transaction.channel_id == "test-channel"
    assert transaction.chaincode_id == "test-chaincode"
    assert transaction.creator_msp_id == "test-msp"
    assert transaction.endorsements == []
    
    # Verify that the model can be serialized to JSON
    json_data = transaction.model_dump_json()
    assert json_data is not None
    
    print("BlockchainTransaction test passed")

def test_property_record():
    """Test PropertyRecord model."""
    # Test with valid property_type and status
    property_record = PropertyRecord(
        property_id="test-property",
        address="123 Test St",
        owner_id="test-owner",
        property_type="apartment",
        size=100.0,
        registration_date=datetime.utcnow(),
        status="active"
    )
    
    # Verify that the model has the required fields
    assert property_record.property_id == "test-property"
    assert property_record.address == "123 Test St"
    assert property_record.owner_id == "test-owner"
    assert property_record.property_type == "apartment"
    assert property_record.size == 100.0
    assert property_record.registration_date is not None
    assert property_record.status == "active"
    assert property_record.attributes == {}
    
    # Test field_validator for property_type
    try:
        PropertyRecord(
            property_id="test-property",
            address="123 Test St",
            owner_id="test-owner",
            property_type="invalid",
            size=100.0,
            registration_date=datetime.utcnow(),
            status="active"
        )
        assert False, "Should have raised a validation error for invalid property_type"
    except ValueError as e:
        assert "Property type must be one of" in str(e)
    
    # Test field_validator for status
    try:
        PropertyRecord(
            property_id="test-property",
            address="123 Test St",
            owner_id="test-owner",
            property_type="apartment",
            size=100.0,
            registration_date=datetime.utcnow(),
            status="invalid"
        )
        assert False, "Should have raised a validation error for invalid status"
    except ValueError as e:
        assert "Status must be one of" in str(e)
    
    print("PropertyRecord test passed")

def test_ownership_transfer():
    """Test OwnershipTransfer model."""
    transfer = OwnershipTransfer(
        property_id="test-property",
        previous_owner_id="previous-owner",
        new_owner_id="new-owner",
        transaction_id="test-transaction"
    )
    
    # Verify that the model has the required fields
    assert transfer.transfer_id is not None
    assert transfer.property_id == "test-property"
    assert transfer.previous_owner_id == "previous-owner"
    assert transfer.new_owner_id == "new-owner"
    assert transfer.transfer_date is not None
    assert transfer.transaction_id == "test-transaction"
    assert transfer.price is None
    assert transfer.notes is None
    
    print("OwnershipTransfer test passed")

def test_property_history():
    """Test PropertyHistory model."""
    history = PropertyHistory(
        property_id="test-property"
    )
    
    # Verify that the model has the required fields
    assert history.property_id == "test-property"
    assert history.transactions == []
    assert history.ownership_transfers == []
    
    print("PropertyHistory test passed")

def test_blockchain_query_result():
    """Test BlockchainQueryResult model."""
    # Test with valid query_status
    query_result = BlockchainQueryResult(
        query_status="success",
        result_count=0
    )
    
    # Verify that the model has the required fields
    assert query_result.query_id is not None
    assert query_result.query_timestamp is not None
    assert query_result.query_status == "success"
    assert query_result.result_count == 0
    assert query_result.results == []
    assert query_result.error_message is None
    
    # Test field_validator for query_status
    try:
        BlockchainQueryResult(
            query_status="invalid",
            result_count=0
        )
        assert False, "Should have raised a validation error for invalid query_status"
    except ValueError as e:
        assert "Query status must be one of" in str(e)
    
    print("BlockchainQueryResult test passed")

def run_tests():
    """Run all tests."""
    print("Running tests for blockchain models...")
    test_blockchain_transaction()
    test_property_record()
    test_ownership_transfer()
    test_property_history()
    test_blockchain_query_result()
    print("All tests passed!")

if __name__ == "__main__":
    run_tests()