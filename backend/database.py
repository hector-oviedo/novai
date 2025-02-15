"""
Database module for initializing and managing the DB connection via SQLAlchemy.
"""

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from config import Config
from models.base import Base
from utils.logger import get_logger

logger = get_logger(__name__)

engine = create_engine(Config.DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def init_db():
    """
    Create all tables if they don't exist.
    """
    logger.debug("Initializing database (creating tables if needed).")
    try:
        import models.user
        import models.session
        import models.session_message
        import models.document
        import models.session_document
        import models.tool
        import models.session_tool

        Base.metadata.create_all(bind=engine)
        logger.debug("Database initialization complete.")
    except Exception as e:
        logger.error(f"Error initializing database: {e}")
        raise e

def get_db():
    """
    Dependency that provides a database session context.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
