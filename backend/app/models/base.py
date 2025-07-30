from sqlalchemy import Column, String, DateTime
from sqlalchemy.sql import func
import uuid

from backend.app.core.database import Base

def generate_uuid():
    """Generate a UUID for model IDs"""
    return str(uuid.uuid4())

class BaseModel(Base):
    """
    Base model class with common fields for all models.
    
    This is an abstract base class and should not be instantiated directly.
    """
    __abstract__ = True
    
    id = Column(String, primary_key=True, default=generate_uuid, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)