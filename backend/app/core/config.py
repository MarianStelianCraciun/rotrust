import os
from typing import Optional, List
from dotenv import load_dotenv
from pydantic import BaseModel
# In Pydantic v2, BaseSettings is moved to pydantic_settings
from pydantic_settings import BaseSettings

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
    
    # AWS settings
    AWS_REGION: str = os.getenv("AWS_REGION", "eu-central-1")
    AWS_ACCESS_KEY_ID: Optional[str] = os.getenv("AWS_ACCESS_KEY_ID")
    AWS_SECRET_ACCESS_KEY: Optional[str] = os.getenv("AWS_SECRET_ACCESS_KEY")
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    
    # S3 settings
    S3_BUCKET_NAME: str = os.getenv("S3_BUCKET_NAME", "rotrust-documents")
    S3_BACKUP_BUCKET: str = os.getenv("S3_BACKUP_BUCKET", "rotrust-backups")
    
    # Blockchain settings
    BLOCKCHAIN_NETWORK: str = os.getenv("BLOCKCHAIN_NETWORK", "development")
    BLOCKCHAIN_CHANNEL: str = os.getenv("BLOCKCHAIN_CHANNEL", "rotrust-channel")
    BLOCKCHAIN_CHAINCODE: str = os.getenv("BLOCKCHAIN_CHAINCODE", "rotrust-chaincode")
    
    model_config = {
        "case_sensitive": True,
        "env_file": ".env",
        "env_file_encoding": "utf-8",
        "extra": "ignore"
    }


# Create global settings object
settings = Settings()