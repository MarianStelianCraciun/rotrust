from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, EmailStr

# Import services
from app.services.auth_service import AuthService, get_current_user

# Create router
router = APIRouter()

# Define models
class UserBase(BaseModel):
    username: str
    email: EmailStr
    full_name: str

class UserCreate(UserBase):
    password: str
    role: Optional[str] = "user"

class UserResponse(UserBase):
    id: str
    role: str
    is_active: bool
    created_at: str

    model_config = {
        "from_attributes": True
    }

# Initialize service
auth_service = AuthService()

@router.post("/", response_model=Dict[str, Any], status_code=status.HTTP_201_CREATED)
async def create_user(user_data: UserCreate):
    """
    Create a new user.
    """
    try:
        user_id = auth_service.create_user(
            username=user_data.username,
            email=user_data.email,
            password=user_data.password,
            full_name=user_data.full_name,
            role=user_data.role
        )
        return {"user_id": user_id, "status": "created"}
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: Dict[str, Any] = Depends(get_current_user)):
    """
    Get information about the currently authenticated user.
    """
    return current_user

@router.get("/{user_id}", response_model=UserResponse)
async def get_user(user_id: str, current_user: Dict[str, Any] = Depends(get_current_user)):
    """
    Get user information by ID.
    """
    # Check if user has admin role or is requesting their own info
    if current_user["role"] != "admin" and current_user["id"] != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this user's information"
        )
    
    user = auth_service.get_user(user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with ID {user_id} not found"
        )
    
    return user