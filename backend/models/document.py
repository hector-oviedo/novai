"""
Stores user documents. Real file data might be handled externally or in a separate storage system.
"""

from sqlalchemy import Column, String, Text
from models.base import Base
from sqlalchemy.orm import relationship

class Document(Base):
    __tablename__ = "documents"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, index=True)
    name = Column(String, nullable=True)
    description = Column(Text, nullable=True)
    filename = Column(Text, nullable=True)

    sessions = relationship("SessionDocument", backref="document", cascade="all, delete")

    def __repr__(self):
        return f"<Document id={self.id} name={self.name}>"
