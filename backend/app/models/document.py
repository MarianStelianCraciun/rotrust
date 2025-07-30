from sqlalchemy import Column, String, ForeignKey, Text, Date
from sqlalchemy.orm import relationship
from datetime import date

from backend.app.models.base import BaseModel

class Document(BaseModel):
    """
    Document model for property-related documents according to Romanian standards.
    
    Attributes:
        title: Title of the document
        document_type: Type of document according to Romanian classification
                      (e.g., "extras carte funciară", "certificat fiscal", "contract vânzare-cumpărare",
                       "certificat energetic", "certificat urbanism", "autorizație construcție")
        document_number: Official document number/identifier
        issuing_authority: Authority that issued the document
                          (e.g., "ANCPI", "Primăria", "Notar Public")
        issue_date: Date when the document was issued
        expiry_date: Date when the document expires (if applicable)
        file_path: Path to the stored document file
        is_original: Whether this is an original document or a copy
        is_verified: Whether the document has been verified by an authority
        description: Optional description of the document
        property_id: ID of the property this document belongs to
        property: The property this document belongs to
    """
    __tablename__ = "documents"
    
    title = Column(String, nullable=False)
    document_type = Column(String, nullable=False, index=True)
    document_number = Column(String, nullable=True, index=True)
    issuing_authority = Column(String, nullable=True)
    issue_date = Column(Date, nullable=True)
    expiry_date = Column(Date, nullable=True)
    file_path = Column(String, nullable=False)
    is_original = Column(String, default="copie", nullable=False)  # "original" or "copie"
    is_verified = Column(String, default="neverificat", nullable=False)  # "verificat" or "neverificat"
    description = Column(Text, nullable=True)
    
    # Foreign keys
    property_id = Column(String, ForeignKey("properties.id"), nullable=False, index=True)
    
    # Relationships
    property = relationship("Property", back_populates="documents")
    
    def __repr__(self):
        return f"<Document {self.id}: {self.title} ({self.document_type})>"