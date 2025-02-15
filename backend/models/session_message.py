"""
Stores user/assistant messages for a session, including optional 'think' text.
"""

from sqlalchemy import Column, String, ForeignKey, Integer, Text
from models.base import Base

class SessionMessage(Base):
    __tablename__ = "session_messages"

    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    session_id = Column(String, ForeignKey("sessions.session_id", ondelete="CASCADE"), nullable=False, index=True)
    sender = Column(String, nullable=False)  # 'user' or 'assistant'
    content = Column(Text, nullable=False)
    think = Column(Text, nullable=True)

    def __repr__(self):
        return f"<SessionMessage id={self.id} sender={self.sender} session_id={self.session_id}>"
