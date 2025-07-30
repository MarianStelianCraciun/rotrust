from backend.app.models.base import BaseModel
from backend.app.models.user import User
from backend.app.models.property import Property
from backend.app.models.transaction import Transaction
from backend.app.models.document import Document

# Export all models
__all__ = [
    "BaseModel",
    "User",
    "Property",
    "Transaction",
    "Document"
]