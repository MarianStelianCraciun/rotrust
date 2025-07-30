from sqlalchemy import Column, String, Boolean, Date
from sqlalchemy.orm import relationship
from datetime import date

from backend.app.models.base import BaseModel

class User(BaseModel):
    """
    User model for authentication and authorization according to Romanian standards.
    
    Attributes:
        username: Unique username for the user
        email: Email address of the user
        hashed_password: Hashed password for authentication
        full_name: Full name of the user
        cnp: Romanian personal identification number (Cod Numeric Personal)
        id_type: Type of ID document (e.g., "carte de identitate", "pașaport")
        id_number: ID document number
        id_issued_by: Authority that issued the ID document
        id_issue_date: Date when the ID document was issued
        id_expiry_date: Date when the ID document expires
        address: User's address
        phone: User's phone number
        role: Role of the user (e.g., "admin", "utilizator", "agent")
        is_active: Whether the user account is active
        properties: Properties owned by the user
        transactions_as_buyer: Transactions where the user is the buyer
        transactions_as_seller: Transactions where the user is the seller
    """
    __tablename__ = "users"
    
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    cnp = Column(String, unique=True, index=True, nullable=True)
    id_type = Column(String, nullable=True)
    id_number = Column(String, nullable=True)
    id_issued_by = Column(String, nullable=True)
    id_issue_date = Column(Date, nullable=True)
    id_expiry_date = Column(Date, nullable=True)
    address = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    role = Column(String, default="utilizator", nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    
    # Relationships
    properties = relationship("Property", back_populates="owner", cascade="all, delete-orphan")
    transactions_as_buyer = relationship(
        "Transaction", 
        foreign_keys="Transaction.buyer_id", 
        back_populates="buyer"
    )
    transactions_as_seller = relationship(
        "Transaction", 
        foreign_keys="Transaction.seller_id", 
        back_populates="seller"
    )
    
    def __repr__(self):
        return f"<User {self.username}>"