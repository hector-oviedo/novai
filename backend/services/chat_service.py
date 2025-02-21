# File: services/chat_service.py
import uuid
import json
from typing import Optional
from sqlalchemy.orm import Session
from utils.logger import get_logger

from models.session import Session as ChatSession
from models.session_message import SessionMessage
from services.llm_service import LLMService
from rag import rag_service

logger = get_logger(__name__)

class ChatService:
    def __init__(self):
        self.llm_service = LLMService()

    def start_stream_inference(
        self,
        db: Session,
        user_id: str,
        session_id: str,
        user_message: str
    ):
        """
        Streams JSON lines of the form:
          { "type": "thinking"|"public"|"error", "chunk": "..." }
        Steps:
          1) Get or create the session
          2) Insert user message in DB
          3) Retrieve a RAG snippet (if docs attached), store as 'system' message
          4) Call LLMService with entire conversation
          5) Parse tokens for <think> tags
          6) Store final assistant message
        """

        # 1) Get or create session
        session_obj = self._get_or_create_session(db, user_id, session_id)

        # 2) Insert the user's new message
        self._add_user_message(db, session_obj.session_id, user_message)

        # 3) Check for attached documents and, if any, retrieve context via RAG.
        from models.session_document import SessionDocument
        attached = db.query(SessionDocument).filter(SessionDocument.session_id == session_id).all()
        doc_ids = [att.document_id for att in attached]
        logger.debug(f"Session {session_id} attached doc_ids: {doc_ids}")

        # Retrieve context if docs attached
        if doc_ids:
            rag_context = rag_service.query(user_message, doc_ids)
            if rag_context:
                self._add_system_message(db, session_obj.session_id, f"Relevant info:\n{rag_context}")

        # 4) Stream from LLM, passing the entire conversation (user + system + older messages)
        token_generator = self.llm_service.stream_infer(db, session_id)

        # Prepare buffers for final assistant text
        public_buffer = []
        think_buffer = []
        in_think_mode = False

        for token in token_generator:
            # 4a) Check if it's an LLM error token
            if token.startswith("LLMError:"):
                error_msg = token.replace("LLMError:", "").strip()
                yield self._json_chunk("error", error_msg)
                self._add_error_message(db, session_obj.session_id, error_msg)
                return  # Stop streaming entirely

            # 5) Parse <think> tags for chain-of-thought
            cursor = 0
            while cursor < len(token):
                if not in_think_mode:
                    idx = token.find("<think>", cursor)
                    if idx == -1:
                        chunk = token[cursor:]
                        public_buffer.append(chunk)
                        yield self._json_chunk("public", chunk)
                        break
                    else:
                        chunk = token[cursor:idx]
                        if chunk:
                            public_buffer.append(chunk)
                            yield self._json_chunk("public", chunk)
                        cursor = idx + len("<think>")
                        in_think_mode = True
                else:
                    idx = token.find("</think>", cursor)
                    if idx == -1:
                        think_chunk = token[cursor:]
                        think_buffer.append(think_chunk)
                        yield self._json_chunk("thinking", think_chunk)
                        break
                    else:
                        chunk = token[cursor:idx]
                        think_buffer.append(chunk)
                        yield self._json_chunk("thinking", chunk)
                        cursor = idx + len("</think>")
                        in_think_mode = False

        # 6) Store final assistant message
        final_public = "".join(public_buffer)
        final_think = "".join(think_buffer)
        self._add_assistant_message(db, session_obj.session_id, final_public, final_think)

    # -------------- Private Methods --------------
    def _get_or_create_session(self, db: Session, user_id: str, session_id: str):
        sess = db.query(ChatSession).filter_by(session_id=session_id, user_id=user_id).first()
        if sess:
            return sess
        new_sess = ChatSession(
            session_id=session_id,
            user_id=user_id,
            session_title=session_id
        )
        db.add(new_sess)
        db.commit()
        db.refresh(new_sess)
        return new_sess

    def _add_user_message(self, db: Session, session_id: str, content: str):
        msg = SessionMessage(
            session_id=session_id,
            sender="user",
            content=content or ""
        )
        db.add(msg)
        db.commit()

    def _add_system_message(self, db: Session, session_id: str, snippet: str):
        msg = SessionMessage(
            session_id=session_id,
            sender="system",
            content=snippet or "",
            think=""
        )
        db.add(msg)
        db.commit()

    def _add_assistant_message(self, db: Session, session_id: str, public_text: str, think_text: str):
        msg = SessionMessage(
            session_id=session_id,
            sender="assistant",
            content=public_text or "",
            think=think_text or ""
        )
        db.add(msg)
        db.commit()

    def _add_error_message(self, db: Session, session_id: str, error_text: str):
        msg = SessionMessage(
            session_id=session_id,
            sender="error",
            content=error_text or "",
            think=""
        )
        db.add(msg)
        db.commit()

    def _json_chunk(self, chunk_type: str, text: str) -> bytes:
        payload = {"type": chunk_type, "chunk": text}
        return (json.dumps(payload) + "\n").encode("utf-8")


chat_service = ChatService()
