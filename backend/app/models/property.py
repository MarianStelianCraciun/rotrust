from sqlalchemy import Column, String, Float, Integer, ForeignKey, Text, Date, Boolean
from sqlalchemy.orm import relationship

from backend.app.models.base import BaseModel

class Property(BaseModel):
    """
    Property model for real estate properties according to Romanian standards.
    
    Attributes:
        cadastral_number: Unique cadastral number (număr cadastral) assigned by ANCPI
        land_book_number: Land book number (număr carte funciară) for the property
        address: Full address of the property
        property_type: Type of property according to Romanian classification
                      (e.g., "apartament", "casă", "teren", "spațiu comercial")
        size: Size of the property in square meters
        rooms: Number of rooms (for residential properties)
        floor: Floor number for apartments (etaj)
        building_year: Year when the building was constructed
        energy_certificate: Energy efficiency certificate rating (A-G)
        has_parking: Whether the property includes parking
        land_category: Category of land according to Romanian classification
                      (e.g., "intravilan", "extravilan", "agricol", "forestier")
        land_usage: Usage type for land (e.g., "construcții", "arabil", "pășune")
        description: Detailed description of the property
        status: Status of the property (e.g., "activ", "vândut", "rezervat")
        owner_id: ID of the property owner
        owner: User who owns the property
        documents: Documents associated with the property
        transactions: Transactions involving this property
    """
    __tablename__ = "properties"
    
    cadastral_number = Column(String, unique=True, index=True, nullable=False)
    land_book_number = Column(String, unique=True, index=True, nullable=False)
    address = Column(String, nullable=False, index=True)
    property_type = Column(String, nullable=False, index=True)
    size = Column(Float, nullable=False)
    rooms = Column(Integer, nullable=True)
    floor = Column(Integer, nullable=True)
    building_year = Column(Integer, nullable=True)
    energy_certificate = Column(String, nullable=True)
    has_parking = Column(Boolean, default=False, nullable=False)
    land_category = Column(String, nullable=True)
    land_usage = Column(String, nullable=True)
    description = Column(Text, nullable=True)
    status = Column(String, default="activ", nullable=False, index=True)
    
    # Foreign keys
    owner_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    
    # Relationships
    owner = relationship("User", back_populates="properties")
    documents = relationship("Document", back_populates="property", cascade="all, delete-orphan")
    transactions = relationship("Transaction", back_populates="property", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Property {self.id}: {self.address}>"