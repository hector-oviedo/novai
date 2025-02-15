"""
Session model linking to a user. Each session references session_messages.
"""

from sqlalchemy import Column, String, ForeignKey
from sqlalchemy.orm import relationship
from models.base import Base

class Session(Base):
    __tablename__ = "sessions"

    session_id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.user_id"), nullable=False)
    session_title = Column(String, nullable=True)

    messages = relationship("SessionMessage", backref="session", cascade="all, delete")

    def __repr__(self):
        return f"<Session session_id={self.session_id} user_id={self.user_id}>"
