"""
User model for storing user credentials and optional email.
"""

from sqlalchemy import Column, String
from models.base import Base

class User(Base):
    __tablename__ = "users"

    user_id = Column(String, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    password = Column(String, nullable=False)  # hashed password
    email = Column(String, nullable=True)

    def __repr__(self):
        return f"<User username={self.username} user_id={self.user_id}>"
