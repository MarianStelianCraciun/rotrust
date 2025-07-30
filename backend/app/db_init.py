import logging
from sqlalchemy import inspect
import os

from backend.app.core.database import engine, Base
from backend.app.models import User, Property, Transaction, Document

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def init_db(drop_all=False):
    """
    Initialize the database by creating all tables.
    
    Args:
        drop_all: If True, drop all existing tables before creating new ones
    
    This function creates all tables defined in the models.
    If drop_all is True, it will first drop all existing tables.
    """
    if drop_all:
        logger.info("Dropping all existing tables...")
        Base.metadata.drop_all(bind=engine)
        logger.info("All tables dropped successfully.")
    
    logger.info("Creating database tables...")
    
    # Create tables
    Base.metadata.create_all(bind=engine)
    
    # Get inspector to check tables
    inspector = inspect(engine)
    
    # Log created tables
    tables = inspector.get_table_names()
    logger.info(f"Created tables: {', '.join(tables)}")
    
    logger.info("Database initialization completed successfully.")

if __name__ == "__main__":
    import argparse
    
    # Parse command line arguments
    parser = argparse.ArgumentParser(description="Initialize the database")
    parser.add_argument("--drop-all", action="store_true", help="Drop all existing tables before creating new ones")
    args = parser.parse_args()
    
    # Initialize the database
    init_db(drop_all=args.drop_all)