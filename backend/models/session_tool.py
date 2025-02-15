"""
Associative table linking a session to a tool.
"""

from sqlalchemy import Column, String, ForeignKey
from models.base import Base

class SessionTool(Base):
    __tablename__ = "session_tools"

    id = Column(String, primary_key=True, index=True)
    session_id = Column(String, ForeignKey("sessions.session_id", ondelete="CASCADE"), index=True)
    tool_id = Column(String, ForeignKey("tools.id", ondelete="CASCADE"), index=True)

    def __repr__(self):
        return f"<SessionTool session_id={self.session_id} tool_id={self.tool_id}>"
