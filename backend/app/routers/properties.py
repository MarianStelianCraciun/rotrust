from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Dict, Any, Optional
from pydantic import BaseModel

# Import services
from app.services.property_service import PropertyService
from app.services.auth_service import get_current_user

# Create router
router = APIRouter()

# Define models
class PropertyBase(BaseModel):
    address: str
    property_type: str
    size: float
    rooms: Optional[int] = None
    description: Optional[str] = None

class PropertyCreate(PropertyBase):
    owner_id: str
    documents: List[str]

class PropertyResponse(PropertyBase):
    id: str
    owner_id: str
    status: str
    created_at: str
    updated_at: str

    class Config:
        orm_mode = True

# Initialize service
property_service = PropertyService()

@router.post("/", response_model=Dict[str, Any], status_code=status.HTTP_201_CREATED)
async def register_property(property_data: PropertyCreate, current_user = Depends(get_current_user)):
    """
    Register a new property on the blockchain.
    """
    try:
        property_id = property_service.register_property(
            address=property_data.address,
            owner_id=property_data.owner_id,
            property_details={
                "type": property_data.property_type,
                "size": property_data.size,
                "rooms": property_data.rooms,
                "description": property_data.description
            },
            documents=property_data.documents
        )
        return {"property_id": property_id, "status": "registered"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{property_id}", response_model=PropertyResponse)
async def get_property(property_id: str, current_user = Depends(get_current_user)):
    """
    Get property details by ID.
    """
    try:
        property_data = property_service.get_property(property_id)
        if not property_data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Property with ID {property_id} not found"
            )
        return property_data
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/", response_model=List[PropertyResponse])
async def list_properties(
    owner_id: Optional[str] = None,
    property_type: Optional[str] = None,
    current_user = Depends(get_current_user)
):
    """
    List properties with optional filtering.
    """
    try:
        filters = {}
        if owner_id:
            filters["owner_id"] = owner_id
        if property_type:
            filters["property_type"] = property_type
            
        properties = property_service.list_properties(filters)
        return properties
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.put("/{property_id}", response_model=Dict[str, Any])
async def update_property(
    property_id: str,
    property_data: PropertyBase,
    current_user = Depends(get_current_user)
):
    """
    Update property details.
    """
    try:
        success = property_service.update_property(
            property_id=property_id,
            property_details={
                "address": property_data.address,
                "type": property_data.property_type,
                "size": property_data.size,
                "rooms": property_data.rooms,
                "description": property_data.description
            }
        )
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Property with ID {property_id} not found or update failed"
            )
        return {"property_id": property_id, "status": "updated"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))