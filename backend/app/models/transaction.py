from sqlalchemy import Column, String, Float, ForeignKey, Text, Date, Integer
from sqlalchemy.orm import relationship
from datetime import date

from backend.app.models.base import BaseModel

class Transaction(BaseModel):
    """
    Transaction model for property transfers according to Romanian standards.
    
    Attributes:
        property_id: ID of the property being transferred
        seller_id: ID of the seller
        buyer_id: ID of the buyer
        price: Transaction price in RON (Romanian Leu)
        price_per_sqm: Price per square meter
        payment_method: Payment method (e.g., "credit ipotecar", "cash", "transfer bancar")
        contract_number: Official contract number
        contract_date: Date when the contract was signed
        notary_name: Name of the notary who authenticated the contract
        notary_license: License number of the notary
        tax_value: Value of the transaction tax
        vat_applied: Whether VAT was applied to the transaction
        vat_value: Value of the VAT if applied
        fiscal_receipt_number: Number of the fiscal receipt
        notes: Optional transaction notes
        status: Status of the transaction (e.g., "în așteptare", "finalizat", "anulat")
        property: The property being transferred
        seller: The user selling the property
        buyer: The user buying the property
    """
    __tablename__ = "transactions"
    
    price = Column(Float, nullable=False)
    price_per_sqm = Column(Float, nullable=True)
    payment_method = Column(String, nullable=False)
    contract_number = Column(String, nullable=True, index=True)
    contract_date = Column(Date, nullable=True)
    notary_name = Column(String, nullable=True)
    notary_license = Column(String, nullable=True)
    tax_value = Column(Float, nullable=True)
    vat_applied = Column(Integer, default=0, nullable=False)  # 0=No, 1=Yes
    vat_value = Column(Float, nullable=True)
    fiscal_receipt_number = Column(String, nullable=True)
    notes = Column(Text, nullable=True)
    status = Column(String, default="în așteptare", nullable=False, index=True)
    
    # Foreign keys
    property_id = Column(String, ForeignKey("properties.id"), nullable=False, index=True)
    seller_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    buyer_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    
    # Relationships
    property = relationship("Property", back_populates="transactions")
    seller = relationship("User", foreign_keys=[seller_id], back_populates="transactions_as_seller")
    buyer = relationship("User", foreign_keys=[buyer_id], back_populates="transactions_as_buyer")
    
    def __repr__(self):
        return f"<Transaction {self.id}: {self.property_id} from {self.seller_id} to {self.buyer_id}>"