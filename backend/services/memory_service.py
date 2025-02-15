# services/memory_service.py

from typing import List
from sqlalchemy.orm import Session
from llama_index.core.llms import ChatMessage
from models.session_message import SessionMessage

class MemoryService:
    """
    Builds a list of ChatMessage objects from the session's history,
    in chronological order. The newest user message is already stored
    in the DB before we fetch, so the conversation includes it too.
    """

    @staticmethod
    def build_chat_history(db: Session, session_id: str) -> List[ChatMessage]:
        """
        1) Fetch all session_messages for this session_id,
           ordered by ascending ID.
        2) Convert each message into ChatMessage(role='user'|'assistant', content=...).
           - Optional: skip 'error' messages if you don't want them in the prompt.
        3) Return the ChatMessage list to be used by LLMService.
        """

        msg_rows = (
            db.query(SessionMessage)
            .filter_by(session_id=session_id)
            .order_by(SessionMessage.id.asc())
            .all()
        )

        chat_history = []
        for row in msg_rows:
            # If you prefer to skip error messages, do:
            if row.sender == "error":
                continue

            if row.sender == "user":
                role = "user"
            elif row.sender == "assistant":
                role = "assistant"
            else:
                # Could handle "system" or other custom roles
                role = "user"  # default fallback

            chat_history.append(ChatMessage(role=role, content=row.content))

        return chat_history
