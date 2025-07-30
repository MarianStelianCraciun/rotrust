import logging
import random
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from passlib.context import CryptContext

from backend.app.core.database import SessionLocal, engine
from backend.app.models import User, Property, Transaction, Document
from backend.app.db_init import init_db

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Setup password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Sample data for Romanian context
USERS = [
    {
        "username": "admin",
        "email": "admin@rotrust.ro",
        "password": "admin123",
        "full_name": "Administrator Sistem",
        "role": "admin",
        "cnp": "1800101123456",
        "id_type": "carte de identitate",
        "id_number": "RT123456",
        "id_issued_by": "SPCLEP Sector 1",
        "address": "Str. Victoriei nr. 1, București",
        "phone": "+40721123456"
    },
    {
        "username": "agent1",
        "email": "agent1@rotrust.ro",
        "password": "password123",
        "full_name": "Ion Popescu",
        "role": "agent",
        "cnp": "1800202123456",
        "id_type": "carte de identitate",
        "id_number": "RT234567",
        "id_issued_by": "SPCLEP Sector 2",
        "address": "Str. Unirii nr. 10, București",
        "phone": "+40722123456"
    },
    {
        "username": "agent2",
        "email": "agent2@rotrust.ro",
        "password": "password123",
        "full_name": "Maria Ionescu",
        "role": "agent",
        "cnp": "2800303123456",
        "id_type": "carte de identitate",
        "id_number": "RT345678",
        "id_issued_by": "SPCLEP Sector 3",
        "address": "Str. Decebal nr. 5, București",
        "phone": "+40723123456"
    },
    {
        "username": "user1",
        "email": "user1@example.com",
        "password": "password123",
        "full_name": "Vasile Marin",
        "role": "utilizator",
        "cnp": "1800404123456",
        "id_type": "carte de identitate",
        "id_number": "RT456789",
        "id_issued_by": "SPCLEP Sector 4",
        "address": "Str. Mihai Bravu nr. 15, București",
        "phone": "+40724123456"
    },
    {
        "username": "user2",
        "email": "user2@example.com",
        "password": "password123",
        "full_name": "Elena Vasilescu",
        "role": "utilizator",
        "cnp": "2800505123456",
        "id_type": "carte de identitate",
        "id_number": "RT567890",
        "id_issued_by": "SPCLEP Sector 5",
        "address": "Str. Dristor nr. 20, București",
        "phone": "+40725123456"
    },
    {
        "username": "user3",
        "email": "user3@example.com",
        "password": "password123",
        "full_name": "Gheorghe Popa",
        "role": "utilizator",
        "cnp": "1800606123456",
        "id_type": "carte de identitate",
        "id_number": "RT678901",
        "id_issued_by": "SPCLEP Sector 6",
        "address": "Str. Titan nr. 25, București",
        "phone": "+40726123456"
    }
]

PROPERTY_TYPES = ["apartament", "casă", "teren", "spațiu comercial", "spațiu industrial"]
PROPERTY_STATUSES = ["activ", "vândut", "rezervat"]
PAYMENT_METHODS = ["credit ipotecar", "cash", "transfer bancar"]
TRANSACTION_STATUSES = ["în așteptare", "finalizat", "anulat"]
DOCUMENT_TYPES = ["extras carte funciară", "certificat fiscal", "contract vânzare-cumpărare", 
                  "certificat energetic", "certificat urbanism", "autorizație construcție"]
LAND_CATEGORIES = ["intravilan", "extravilan", "agricol", "forestier"]
LAND_USAGES = ["construcții", "arabil", "pășune", "fâneață", "vie", "livadă"]

ADDRESSES = [
    "Str. Victoriei nr. 10, București",
    "Str. Unirii nr. 15, Cluj-Napoca",
    "Str. Republicii nr. 20, Timișoara",
    "Str. Independenței nr. 25, Iași",
    "Str. Libertății nr. 30, Constanța",
    "Str. Decebal nr. 35, Brașov",
    "Str. Traian nr. 40, Craiova",
    "Str. Mihai Viteazu nr. 45, Galați",
    "Str. Ștefan cel Mare nr. 50, Oradea",
    "Str. Avram Iancu nr. 55, Brăila"
]

def create_users(db: Session):
    """Create sample users"""
    logger.info("Creating sample users...")
    
    created_users = []
    for user_data in USERS:
        # Check if user already exists
        existing_user = db.query(User).filter(User.username == user_data["username"]).first()
        if existing_user:
            logger.info(f"User {user_data['username']} already exists, skipping...")
            created_users.append(existing_user)
            continue
        
        # Create new user
        hashed_password = pwd_context.hash(user_data["password"])
        
        # Generate random dates for ID documents
        issue_date = datetime.now() - timedelta(days=random.randint(365, 1825))  # 1-5 years ago
        expiry_date = issue_date + timedelta(days=3650)  # Valid for 10 years
        
        user = User(
            username=user_data["username"],
            email=user_data["email"],
            hashed_password=hashed_password,
            full_name=user_data["full_name"],
            role=user_data["role"],
            cnp=user_data["cnp"],
            id_type=user_data["id_type"],
            id_number=user_data["id_number"],
            id_issued_by=user_data["id_issued_by"],
            id_issue_date=issue_date.date(),
            id_expiry_date=expiry_date.date(),
            address=user_data["address"],
            phone=user_data["phone"]
        )
        db.add(user)
        created_users.append(user)
        logger.info(f"Created user: {user.username}")
    
    db.commit()
    return created_users

def create_properties(db: Session, users):
    """Create sample properties"""
    logger.info("Creating sample properties...")
    
    created_properties = []
    for i, address in enumerate(ADDRESSES):
        # Assign to a random user (excluding admin)
        owner = random.choice([u for u in users if u.role != "admin"])
        
        # Generate random property data
        property_type = random.choice(PROPERTY_TYPES)
        cadastral_number = f"CAD{random.randint(10000, 99999)}"
        land_book_number = f"CF{random.randint(10000, 99999)}"
        
        # Create property
        property = Property(
            cadastral_number=cadastral_number,
            land_book_number=land_book_number,
            address=address,
            property_type=property_type,
            size=random.uniform(50.0, 500.0),
            rooms=random.randint(1, 6) if property_type in ["apartament", "casă"] else None,
            floor=random.randint(1, 10) if property_type == "apartament" else None,
            building_year=random.randint(1960, 2023) if property_type in ["apartament", "casă", "spațiu comercial"] else None,
            energy_certificate=random.choice(["A", "B", "C", "D"]) if property_type in ["apartament", "casă"] else None,
            has_parking=random.choice([True, False]) if property_type in ["apartament", "casă", "spațiu comercial"] else False,
            land_category=random.choice(LAND_CATEGORIES) if property_type == "teren" else None,
            land_usage=random.choice(LAND_USAGES) if property_type == "teren" else None,
            description=f"Proprietate de tip {property_type} situată în {address}",
            status=random.choice(PROPERTY_STATUSES),
            owner_id=owner.id
        )
        db.add(property)
        created_properties.append(property)
        logger.info(f"Created property: {property.address}")
    
    db.commit()
    return created_properties

def create_documents(db: Session, properties):
    """Create sample documents for properties"""
    logger.info("Creating sample documents...")
    
    created_documents = []
    for property in properties:
        # Create 1-3 documents per property
        for _ in range(random.randint(1, 3)):
            doc_type = random.choice(DOCUMENT_TYPES)
            
            # Generate random dates
            issue_date = datetime.now() - timedelta(days=random.randint(30, 365))
            expiry_date = issue_date + timedelta(days=random.randint(365, 1825)) if doc_type in ["certificat fiscal", "certificat energetic", "certificat urbanism"] else None
            
            document = Document(
                title=f"{doc_type.capitalize()} pentru {property.address}",
                document_type=doc_type,
                document_number=f"DOC{random.randint(10000, 99999)}",
                issuing_authority=random.choice(["ANCPI", "Primăria", "Notar Public", "ANAF"]),
                issue_date=issue_date.date(),
                expiry_date=expiry_date.date() if expiry_date else None,
                file_path=f"/uploads/documents/{property.id}_{doc_type}_{random.randint(1000, 9999)}.pdf",
                is_original=random.choice(["original", "copie"]),
                is_verified=random.choice(["verificat", "neverificat"]),
                description=f"Document {doc_type} pentru proprietatea de la adresa {property.address}",
                property_id=property.id
            )
            db.add(document)
            created_documents.append(document)
            logger.info(f"Created document: {document.title}")
    
    db.commit()
    return created_documents

def create_transactions(db: Session, properties, users):
    """Create sample transactions"""
    logger.info("Creating sample transactions...")
    
    created_transactions = []
    # Only create transactions for some properties
    for property in random.sample(properties, min(5, len(properties))):
        # Skip properties that are not sold or reserved
        if property.status == "activ":
            continue
        
        # Get seller (current owner)
        seller = db.query(User).filter(User.id == property.owner_id).first()
        
        # Get buyer (different from seller)
        potential_buyers = [u for u in users if u.id != seller.id and u.role != "admin"]
        if not potential_buyers:
            continue
        buyer = random.choice(potential_buyers)
        
        # Generate random transaction data
        price = random.uniform(50000.0, 500000.0)
        price_per_sqm = price / property.size if property.size else None
        contract_date = datetime.now() - timedelta(days=random.randint(1, 180))
        
        # Create transaction
        transaction = Transaction(
            property_id=property.id,
            seller_id=seller.id,
            buyer_id=buyer.id,
            price=price,
            price_per_sqm=price_per_sqm,
            payment_method=random.choice(PAYMENT_METHODS),
            contract_number=f"CTR{random.randint(10000, 99999)}",
            contract_date=contract_date.date(),
            notary_name=f"Notar {random.choice(['Popescu', 'Ionescu', 'Vasilescu'])}",
            notary_license=f"NP{random.randint(1000, 9999)}",
            tax_value=price * 0.02,  # 2% tax
            vat_applied=random.choice([0, 1]),
            vat_value=price * 0.19 if random.choice([0, 1]) else None,  # 19% VAT if applied
            fiscal_receipt_number=f"FR{random.randint(10000, 99999)}",
            notes=f"Tranzacție pentru proprietatea de la adresa {property.address}",
            status="finalizat" if property.status == "vândut" else "în așteptare"
        )
        db.add(transaction)
        created_transactions.append(transaction)
        logger.info(f"Created transaction: {transaction.id} for property {property.address}")
    
    db.commit()
    return created_transactions

def populate_db(drop_all=False):
    """
    Populate the database with sample data
    
    Args:
        drop_all: If True, drop all existing tables before creating new ones
    """
    logger.info("Starting database population with mock data...")
    
    # Initialize database if needed
    init_db(drop_all=drop_all)
    
    # Create session
    db = SessionLocal()
    try:
        # Check if data already exists
        user_count = db.query(User).count()
        if user_count > 0:
            logger.info(f"Database already contains {user_count} users.")
            proceed = input("Database already contains data. Do you want to proceed? (y/n): ")
            if proceed.lower() != 'y':
                logger.info("Database population cancelled.")
                return
        
        # Create data
        users = create_users(db)
        properties = create_properties(db, users)
        documents = create_documents(db, properties)
        transactions = create_transactions(db, properties, users)
        
        logger.info("Database population completed successfully.")
        logger.info(f"Created {len(users)} users, {len(properties)} properties, {len(documents)} documents, and {len(transactions)} transactions.")
    
    except Exception as e:
        logger.error(f"Error populating database: {str(e)}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    import argparse
    
    # Parse command line arguments
    parser = argparse.ArgumentParser(description="Populate the database with sample data")
    parser.add_argument("--drop-all", action="store_true", help="Drop all existing tables before creating new ones")
    args = parser.parse_args()
    
    # Populate the database
    populate_db(drop_all=args.drop_all)