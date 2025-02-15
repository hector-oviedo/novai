"""
Tool model representing external function-like plugins (e.g. internet, weather).
"""

from sqlalchemy import Column, String, Text
from models.base import Base
from sqlalchemy.orm import relationship

class Tool(Base):
    __tablename__ = "tools"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    rules = Column(Text, nullable=False)

    sessions = relationship("SessionTool", backref="tool", cascade="all, delete")

    def __repr__(self):
        return f"<Tool id={self.id} name={self.name}>"
