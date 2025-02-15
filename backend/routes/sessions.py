"""
sessions.py

Routes that manage sessions and their messages:
- GET /sessions
- POST /sessions
- DELETE /sessions/{session_id}
- GET /sessions/{session_id}/messages
- POST /sessions/{session_id}/messages
- PUT /sessions/{session_id}/messages/{message_id}
- DELETE /sessions/{session_id}/messages/{message_id}
"""

from fastapi import APIRouter, Depends, HTTPException
from typing import Optional
from sqlalchemy.orm import Session

from database import get_db
from security import get_current_user_id
from models.session import Session as ChatSession
from models.session_message import SessionMessage
import uuid

router = APIRouter()

@router.get("/")
def list_sessions(
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user_id)
):
    """
    GET /sessions
    Returns all sessions for the current user.
    """
    sessions = db.query(ChatSession).filter_by(user_id=user_id).all()
    return [
        {
            "session_id": s.session_id,
            "title": s.session_title
        }
        for s in sessions
    ]

@router.post("/")
def create_session(
    payload: dict,
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user_id)
):
    """
    POST /sessions
    Body: { "title": "My session title" }
    Creates a new session for the user.
    """
    title: Optional[str] = payload.get("title")
    new_id = str(uuid.uuid4())
    new_session = ChatSession(
        session_id=new_id,
        user_id=user_id,
        session_title=title if title else new_id
    )
    db.add(new_session)
    db.commit()
    db.refresh(new_session)
    return {
        "session_id": new_session.session_id,
        "title": new_session.session_title
    }

@router.delete("/{session_id}")
def delete_session(
    session_id: str,
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user_id)
):
    """
    DELETE /sessions/{session_id}
    Removes a session if owned by the user.
    """
    session_obj = db.query(ChatSession).filter_by(session_id=session_id, user_id=user_id).first()
    if not session_obj:
        raise HTTPException(status_code=404, detail="Session not found or not owned by user.")

    db.delete(session_obj)
    db.commit()
    return {"message": f"Session {session_id} deleted"}

@router.get("/{session_id}/messages")
def get_session_messages(
    session_id: str,
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user_id),
    last_id: Optional[int] = None,
    limit: int = 20
):
    """
    GET /sessions/{session_id}/messages?last_id=...&limit=...
    Returns the last N messages for the session, or older than last_id if given.
    """
    session_obj = db.query(ChatSession).filter_by(session_id=session_id, user_id=user_id).first()
    if not session_obj:
        raise HTTPException(status_code=404, detail="Session not found")

    query = db.query(SessionMessage).filter_by(session_id=session_id)
    if last_id:
        query = query.filter(SessionMessage.id < last_id)
    query = query.order_by(SessionMessage.id.desc()).limit(limit)

    messages = query.all()
    messages_sorted = sorted(messages, key=lambda m: m.id)

    return [
        {
            "id": m.id,
            "sender": m.sender,
            "content": m.content,
            "think": m.think
        }
        for m in messages_sorted
    ]

@router.post("/{session_id}/messages")
def add_message(
    session_id: str,
    payload: dict,
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user_id)
):
    """
    POST /sessions/{session_id}/messages
    Body: { "sender": "user|assistant", "content": "...", "think": "..." }
    Adds a message to the session.
    """
    sender = payload.get("sender")
    content = payload.get("content")
    think = payload.get("think", "")

    if not sender or not content:
        raise HTTPException(status_code=400, detail="sender and content are required.")

    session_obj = db.query(ChatSession).filter_by(session_id=session_id, user_id=user_id).first()
    if not session_obj:
        raise HTTPException(status_code=404, detail="Session not found")

    new_msg = SessionMessage(
        session_id=session_id,
        sender=sender,
        content=content,
        think=think
    )
    db.add(new_msg)
    db.commit()
    db.refresh(new_msg)
    return {
        "id": new_msg.id,
        "sender": new_msg.sender,
        "content": new_msg.content,
        "think": new_msg.think
    }

@router.put("/{session_id}/messages/{message_id}")
def update_message(
    session_id: str,
    message_id: int,
    payload: dict,
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user_id)
):
    """
    PUT /sessions/{session_id}/messages/{message_id}
    Body: { "content": "...", "think": "..." } (optional)
    Updates an existing message if it belongs to that session & user.
    """
    content = payload.get("content")
    think = payload.get("think", "")

    msg_obj = db.query(SessionMessage).join(ChatSession).filter(
        SessionMessage.id == message_id,
        ChatSession.session_id == session_id,
        ChatSession.user_id == user_id
    ).first()
    if not msg_obj:
        raise HTTPException(status_code=404, detail="Message not found or not owned by user.")

    if content is not None:
        msg_obj.content = content
    if think is not None:
        msg_obj.think = think
    db.commit()
    db.refresh(msg_obj)
    return {
        "id": msg_obj.id,
        "sender": msg_obj.sender,
        "content": msg_obj.content,
        "think": msg_obj.think
    }

@router.delete("/{session_id}/messages/{message_id}")
def delete_message(
    session_id: str,
    message_id: int,
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user_id)
):
    """
    DELETE /sessions/{session_id}/messages/{message_id}
    Removes a specific message in that session.
    """
    msg_obj = db.query(SessionMessage).join(ChatSession).filter(
        SessionMessage.id == message_id,
        ChatSession.session_id == session_id,
        ChatSession.user_id == user_id
    ).first()
    if not msg_obj:
        raise HTTPException(status_code=404, detail="Message not found or not owned by user.")

    db.delete(msg_obj)
    db.commit()
    return {"message": f"Message {message_id} deleted"}
