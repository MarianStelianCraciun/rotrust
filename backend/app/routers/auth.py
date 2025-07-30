from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from typing import Dict, Any
from datetime import timedelta

# Import services
from app.services.auth_service import auth_service, get_current_user, ACCESS_TOKEN_EXPIRE_MINUTES

# Create router
router = APIRouter()

@router.post("/token", response_model=Dict[str, str])
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    """
    Authenticate user and provide access token.
    """
    # Authenticate user
    user = auth_service.authenticate_user(form_data.username, form_data.password)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth_service.create_access_token(
        data={"sub": user["id"]},
        expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/refresh", response_model=Dict[str, str])
async def refresh_token(current_user: Dict[str, Any] = Depends(get_current_user)):
    """
    Refresh the access token.
    """
    # Create new access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth_service.create_access_token(
        data={"sub": current_user["id"]},
        expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/verify", response_model=Dict[str, bool])
async def verify_token(current_user: Dict[str, Any] = Depends(get_current_user)):
    """
    Verify if the token is valid.
    """
    return {"valid": True}