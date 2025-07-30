from typing import Dict, Optional, Any
from datetime import datetime, timedelta
import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from passlib.context import CryptContext
import os
import logging
import uuid

# This is a mock implementation for demonstration purposes
# In a real implementation, this would use a database and proper security measures

# Setup password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Setup OAuth2 with Password flow
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/token")

# JWT settings
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "development_secret_key")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

class AuthService:
    def __init__(self):
        self.logger = logging.getLogger(__name__)
        # Mock user database for demonstration
        self.users = {}
        
        # Create a default admin user
        self.create_user(
            username="admin",
            email="admin@rotrust.ro",
            password="admin123",  # In production, use a secure password
            full_name="Admin User",
            role="admin"
        )
    
    def create_user(self, username: str, email: str, password: str, full_name: str, role: str = "user") -> str:
        """
        Create a new user.
        
        Args:
            username: Username
            email: Email address
            password: Plain text password (will be hashed)
            full_name: User's full name
            role: User role (default: "user")
            
        Returns:
            str: User ID
        """
        try:
            # Check if username or email already exists
            for user in self.users.values():
                if user["username"] == username:
                    raise ValueError("Username already exists")
                if user["email"] == email:
                    raise ValueError("Email already exists")
            
            # Generate user ID
            user_id = f"USER-{uuid.uuid4().hex[:8].upper()}"
            
            # Hash the password
            hashed_password = pwd_context.hash(password)
            
            # Create user record
            now = datetime.now().isoformat()
            user_record = {
                "id": user_id,
                "username": username,
                "email": email,
                "hashed_password": hashed_password,
                "full_name": full_name,
                "role": role,
                "is_active": True,
                "created_at": now,
                "updated_at": now
            }
            
            # Store user
            self.users[user_id] = user_record
            
            self.logger.info(f"User created: {user_id}")
            return user_id
            
        except Exception as e:
            self.logger.error(f"Error creating user: {str(e)}")
            raise Exception(f"Failed to create user: {str(e)}")
    
    def authenticate_user(self, username: str, password: str) -> Optional[Dict[str, Any]]:
        """
        Authenticate a user with username and password.
        
        Args:
            username: Username
            password: Plain text password
            
        Returns:
            Dict or None: User data if authentication successful, None otherwise
        """
        try:
            # Find user by username
            user = None
            for u in self.users.values():
                if u["username"] == username:
                    user = u
                    break
            
            if not user:
                return None
            
            # Verify password
            if not pwd_context.verify(password, user["hashed_password"]):
                return None
            
            # Check if user is active
            if not user["is_active"]:
                return None
                
            return user
            
        except Exception as e:
            self.logger.error(f"Error authenticating user: {str(e)}")
            return None
    
    def create_access_token(self, data: Dict[str, Any], expires_delta: Optional[timedelta] = None) -> str:
        """
        Create a JWT access token.
        
        Args:
            data: Data to encode in the token
            expires_delta: Optional expiration time
            
        Returns:
            str: JWT token
        """
        to_encode = data.copy()
        
        # Set expiration time
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
            
        to_encode.update({"exp": expire})
        
        # Create JWT token
        encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
        return encoded_jwt
    
    def get_user(self, user_id: str) -> Optional[Dict[str, Any]]:
        """
        Get user by ID.
        
        Args:
            user_id: User ID
            
        Returns:
            Dict or None: User data if found, None otherwise
        """
        return self.users.get(user_id)


# Create global instance
auth_service = AuthService()

async def get_current_user(token: str = Depends(oauth2_scheme)):
    """
    Get the current user from the JWT token.
    
    Args:
        token: JWT token
        
    Returns:
        Dict: User data
        
    Raises:
        HTTPException: If token is invalid or user not found
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        # Decode JWT token
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        
        if user_id is None:
            raise credentials_exception
            
        # Get user from database
        user = auth_service.get_user(user_id)
        
        if user is None:
            raise credentials_exception
            
        return user
        
    except jwt.PyJWTError:
        raise credentials_exception