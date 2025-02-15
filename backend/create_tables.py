"""
Script to recreate all tables. Useful for a fresh start or after schema changes.
"""

import os
import asyncio
from sqlalchemy import create_engine
from models.base import Base
from config import Config

DATABASE_FILE = Config.DATABASE_URL.replace("sqlite:///", "")

async def reset_database():
    engine = create_engine(Config.DATABASE_URL, connect_args={"check_same_thread": False})
    
    if os.path.exists(DATABASE_FILE):
        print("Database exists. Dropping tables...")
        Base.metadata.drop_all(engine)
        print("Tables dropped.")
    else:
        print("Database file does not exist. Creating new one...")

    Base.metadata.create_all(engine)
    print("Tables created successfully!")

async def main():
    await reset_database()

if __name__ == "__main__":
    asyncio.run(main())
