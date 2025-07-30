import logging
from sqlalchemy.orm import Session

from backend.app.core.database import SessionLocal
from backend.app.models import User, Property, Transaction, Document

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def verify_data():
    """Query and display data from the database to verify it was properly inserted"""
    logger.info("Verifying database contents...")
    
    # Create session
    db = SessionLocal()
    try:
        # Query users
        users = db.query(User).all()
        logger.info(f"Found {len(users)} users:")
        for user in users:
            logger.info(f"  - {user.username} ({user.role}): {user.full_name}, {user.email}")
            logger.info(f"    CNP: {user.cnp}, ID: {user.id_type} {user.id_number}")
            logger.info(f"    Address: {user.address}, Phone: {user.phone}")
        
        # Query properties
        properties = db.query(Property).all()
        logger.info(f"\nFound {len(properties)} properties:")
        for prop in properties:
            owner = db.query(User).filter(User.id == prop.owner_id).first()
            logger.info(f"  - {prop.address} ({prop.property_type}, {prop.status})")
            logger.info(f"    Cadastral Number: {prop.cadastral_number}, Land Book: {prop.land_book_number}")
            logger.info(f"    Size: {prop.size} sqm, Rooms: {prop.rooms}, Floor: {prop.floor}")
            if prop.building_year:
                logger.info(f"    Building Year: {prop.building_year}, Energy Certificate: {prop.energy_certificate}")
            if prop.property_type == "teren":
                logger.info(f"    Land Category: {prop.land_category}, Land Usage: {prop.land_usage}")
            logger.info(f"    Owner: {owner.username} ({owner.full_name})")
        
        # Query documents
        documents = db.query(Document).all()
        logger.info(f"\nFound {len(documents)} documents:")
        for doc in documents:
            property = db.query(Property).filter(Property.id == doc.property_id).first()
            logger.info(f"  - {doc.title} ({doc.document_type})")
            logger.info(f"    Document Number: {doc.document_number}, Issuing Authority: {doc.issuing_authority}")
            logger.info(f"    Issue Date: {doc.issue_date}, Expiry Date: {doc.expiry_date}")
            logger.info(f"    Original: {doc.is_original}, Verified: {doc.is_verified}")
            logger.info(f"    Property: {property.address}")
            logger.info(f"    File: {doc.file_path}")
        
        # Query transactions
        transactions = db.query(Transaction).all()
        logger.info(f"\nFound {len(transactions)} transactions:")
        for txn in transactions:
            property = db.query(Property).filter(Property.id == txn.property_id).first()
            seller = db.query(User).filter(User.id == txn.seller_id).first()
            buyer = db.query(User).filter(User.id == txn.buyer_id).first()
            logger.info(f"  - Transaction {txn.id} ({txn.status})")
            logger.info(f"    Property: {property.address}")
            logger.info(f"    Contract: {txn.contract_number} dated {txn.contract_date}")
            logger.info(f"    Notary: {txn.notary_name} (License: {txn.notary_license})")
            logger.info(f"    Price: {txn.price:.2f} RON, Price per sqm: {txn.price_per_sqm:.2f} RON")
            logger.info(f"    Payment Method: {txn.payment_method}")
            logger.info(f"    Tax: {txn.tax_value:.2f} RON, VAT Applied: {'Yes' if txn.vat_applied else 'No'}")
            if txn.vat_value:
                logger.info(f"    VAT Value: {txn.vat_value:.2f} RON")
            logger.info(f"    Fiscal Receipt: {txn.fiscal_receipt_number}")
            logger.info(f"    Seller: {seller.username} ({seller.full_name})")
            logger.info(f"    Buyer: {buyer.username} ({buyer.full_name})")
        
        logger.info("\nDatabase verification completed successfully.")
    
    except Exception as e:
        logger.error(f"Error verifying database: {str(e)}")
    finally:
        db.close()

if __name__ == "__main__":
    verify_data()