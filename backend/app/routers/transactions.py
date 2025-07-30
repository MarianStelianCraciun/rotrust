from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Dict, Any, Optional
from pydantic import BaseModel
from datetime import datetime

# Import services
from app.services.transaction_service import TransactionService
from app.services.auth_service import get_current_user

# Create router
router = APIRouter()

# Define models
class TransferRequest(BaseModel):
    property_id: str
    seller_id: str
    buyer_id: str
    price: float
    payment_method: str
    notes: Optional[str] = None

class TransactionResponse(BaseModel):
    id: str
    property_id: str
    seller_id: str
    buyer_id: str
    price: float
    payment_method: str
    status: str
    notes: Optional[str] = None
    created_at: str
    updated_at: str

    class Config:
        orm_mode = True
        from_attributes = True

# Initialize service
transaction_service = TransactionService()

@router.post("/transfers/", response_model=Dict[str, Any], status_code=status.HTTP_201_CREATED)
async def transfer_property(transfer_data: TransferRequest, current_user = Depends(get_current_user)):
    """
    Initiate a property transfer transaction.
    """
    try:
        transaction_id = transaction_service.execute_transfer(
            property_id=transfer_data.property_id,
            seller_id=transfer_data.seller_id,
            buyer_id=transfer_data.buyer_id,
            price=transfer_data.price,
            payment_method=transfer_data.payment_method,
            notes=transfer_data.notes
        )
        return {"transaction_id": transaction_id, "status": "completed"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/transfers/{transaction_id}", response_model=TransactionResponse)
async def get_transaction(transaction_id: str, current_user = Depends(get_current_user)):
    """
    Get transaction details by ID.
    """
    try:
        transaction = transaction_service.get_transaction(transaction_id)
        if not transaction:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Transaction with ID {transaction_id} not found"
            )
        return transaction
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/transfers/", response_model=List[TransactionResponse])
async def list_transactions(
    property_id: Optional[str] = None,
    seller_id: Optional[str] = None,
    buyer_id: Optional[str] = None,
    status: Optional[str] = None,
    current_user = Depends(get_current_user)
):
    """
    List transactions with optional filtering.
    """
    try:
        filters = {}
        if property_id:
            filters["property_id"] = property_id
        if seller_id:
            filters["seller_id"] = seller_id
        if buyer_id:
            filters["buyer_id"] = buyer_id
        if status:
            filters["status"] = status
            
        transactions = transaction_service.list_transactions(filters)
        return transactions
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.put("/transfers/{transaction_id}/cancel", response_model=Dict[str, Any])
async def cancel_transaction(transaction_id: str, current_user = Depends(get_current_user)):
    """
    Cancel a pending transaction.
    """
    try:
        success = transaction_service.cancel_transaction(transaction_id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Transaction with ID {transaction_id} not found or cannot be cancelled"
            )
        return {"transaction_id": transaction_id, "status": "cancelled"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))