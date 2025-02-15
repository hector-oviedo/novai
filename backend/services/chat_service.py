# services/chat_service.py

import uuid
import json
from typing import Optional
from sqlalchemy.orm import Session

from models.session import Session as ChatSession
from models.session_message import SessionMessage
from services.llm_service import LLMService

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
          1) Get/create session
          2) Insert user message in DB
          3) Call LLMService with entire conversation (multi-turn memory)
          4) Parse tokens for <think> tags
          5) Store final assistant message
        """

        # 1) get or create session
        session_obj = self._get_or_create_session(db, user_id, session_id)

        # 2) Insert user message so it's in the DB
        self._add_user_message(db, session_obj.session_id, user_message)

        # Prepare buffers for final text
        public_buffer = []
        think_buffer = []
        in_think_mode = False

        # 3) Stream from LLM, passing the entire conversation
        token_generator = self.llm_service.stream_infer(db, session_id)

        for token in token_generator:
            # 3a) Check if it's an LLM error token
            if token.startswith("LLMError:"):
                error_msg = token.replace("LLMError:", "").strip()
                # yield an "error" chunk
                yield self._json_chunk("error", error_msg)
                # store error in DB
                self._add_error_message(db, session_obj.session_id, error_msg)
                return  # stop streaming entirely

            # 4) Otherwise parse <think> tags
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

        # 5) Once streaming finishes normally, store the final assistant message
        final_public = "".join(public_buffer)
        final_think = "".join(think_buffer)
        self._add_assistant_message(db, session_obj.session_id, final_public, final_think)

    # -------------- Private Methods --------------

    def _get_or_create_session(self, db: Session, user_id: str, session_id: str):
        sess = db.query(ChatSession).filter_by(session_id=session_id, user_id=user_id).first()
        if sess:
            return sess
        new_sess = ChatSession(session_id=session_id, user_id=user_id, session_title=session_id)
        db.add(new_sess)
        db.commit()
        db.refresh(new_sess)
        return new_sess

    def _add_user_message(self, db: Session, session_id: str, content: str):
        """
        Insert a user message so MemoryService can find it in the DB.
        """
        msg = SessionMessage(
            session_id=session_id,
            sender="user",
            content=content
        )
        db.add(msg)
        db.commit()

    def _add_assistant_message(self, db: Session, session_id: str, public_text: str, think_text: str):
        msg = SessionMessage(
            session_id=session_id,
            sender="assistant",
            content=public_text,
            think=think_text
        )
        db.add(msg)
        db.commit()

    def _add_error_message(self, db: Session, session_id: str, error_text: str):
        """
        Insert an 'error' message in DB so we track inference errors in the conversation.
        """
        msg = SessionMessage(session_id=session_id, sender="error", content=error_text, think="")
        db.add(msg)
        db.commit()

    def _json_chunk(self, chunk_type: str, text: str) -> bytes:
        payload = {"type": chunk_type, "chunk": text}
        return (json.dumps(payload) + "\n").encode("utf-8")


chat_service = ChatService()
