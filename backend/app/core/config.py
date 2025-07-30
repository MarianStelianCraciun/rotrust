import os
from pydantic import BaseSettings
from typing import Optional, List
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Settings(BaseSettings):
    """
    Application settings.
    
    These settings can be configured using environment variables.
    """
    # API settings
    API_V1_STR: str = "/api"
    PROJECT_NAME: str = "RoTrust"
    DESCRIPTION: str = "A blockchain-based platform for real estate transactions in Romania"
    VERSION: str = "0.1.0"
    
    # CORS settings
    BACKEND_CORS_ORIGINS: List[str] = ["*"]
    
    # JWT settings
    SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", "development_secret_key")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Database settings
    DATABASE_URL: Optional[str] = os.getenv("DATABASE_URL", "sqlite:///./rotrust.db")
    
    # Blockchain settings
    BLOCKCHAIN_NETWORK: str = os.getenv("BLOCKCHAIN_NETWORK", "development")
    BLOCKCHAIN_CHANNEL: str = os.getenv("BLOCKCHAIN_CHANNEL", "rotrust-channel")
    BLOCKCHAIN_CHAINCODE: str = os.getenv("BLOCKCHAIN_CHAINCODE", "rotrust-chaincode")
    
    class Config:
        case_sensitive = True


# Create global settings object
settings = Settings()