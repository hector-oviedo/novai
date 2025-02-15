"""
Associative table linking a session to a document.
"""

from sqlalchemy import Column, String, ForeignKey
from models.base import Base

class SessionDocument(Base):
    __tablename__ = "session_documents"

    id = Column(String, primary_key=True, index=True)
    session_id = Column(String, ForeignKey("sessions.session_id", ondelete="CASCADE"), index=True)
    document_id = Column(String, ForeignKey("documents.id", ondelete="CASCADE"), index=True)

    def __repr__(self):
        return f"<SessionDocument session_id={self.session_id} document_id={self.document_id}>"
