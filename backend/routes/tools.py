"""
Tools management: listing available tools, attaching/detaching to sessions, etc.
User ID is inferred from the JWT in the HttpOnly cookie.
"""

from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
import uuid

from database import get_db
from security import get_current_user_id
from models.tool import Tool
from models.session_tool import SessionTool

router = APIRouter()

@router.get("/list")
def list_tools(
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user_id)
):
    """
    Return all available tools (for demonstration, not user-specific).
    If you want user-specific filtering, do it here.
    """
    tools = db.query(Tool).all()
    results = []
    for t in tools:
        session_tools = db.query(SessionTool).filter(SessionTool.tool_id == t.id).all()
        # Could gather sessions if you want to see which sessions are attached
        results.append({
            "id": t.id,
            "name": t.name,
            "description": t.description,
            "rules": t.rules,
            "sessions": [st.session_id for st in session_tools]
        })
    return results

@router.post("/attach")
def attach_tool(
    payload: dict,
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user_id)
):
    """
    Attach a tool to a session. Expects { "tool_id": "...", "session_id": "..." } in JSON.
    """
    tool_id = payload.get("tool_id")
    session_id = payload.get("session_id")
    if not tool_id or not session_id:
        raise HTTPException(status_code=400, detail="tool_id and session_id required.")

    # Optionally check session belongs to user
    # Optionally check user permissions for this tool

    new_attach = SessionTool(
        id=str(uuid.uuid4()),
        session_id=session_id,
        tool_id=tool_id
    )
    db.add(new_attach)
    db.commit()
    return {"message": "Tool attached to session"}

@router.post("/detach")
def detach_tool(
    payload: dict,
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user_id)
):
    """
    Detach a tool from a session. Expects { "tool_id": "...", "session_id": "..." } in JSON.
    """
    tool_id = payload.get("tool_id")
    session_id = payload.get("session_id")
    if not tool_id or not session_id:
        raise HTTPException(status_code=400, detail="tool_id and session_id required.")

    st = db.query(SessionTool).filter(
        SessionTool.session_id == session_id,
        SessionTool.tool_id == tool_id
    ).first()
    if not st:
        raise HTTPException(status_code=404, detail="Tool not found in this session.")

    db.delete(st)
    db.commit()
    return {"message": "Tool detached from session"}
