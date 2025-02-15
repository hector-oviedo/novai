from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from database import get_db
from security import get_current_user_id
from services.chat_service import chat_service

router = APIRouter()

@router.post("/stream")
def stream_inference(
    payload: dict,
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user_id)
):
    """
    POST /chat/stream
    Body: { "session_id": "...", "user_message": "..." }
    Streams the LLM's output as newline-delimited JSON lines.
    """
    session_id = payload.get("session_id")
    user_message = payload.get("user_message")
    if not session_id or not user_message:
        raise HTTPException(
            status_code=400,
            detail="session_id and user_message are required."
        )

    # pass db in as the first param
    generator = chat_service.start_stream_inference(db, user_id, session_id, user_message)
    return StreamingResponse(generator, media_type="text/plain")

@router.post("/stop")
def stop_inference():
    """
    Cancels streaming if supported.
    """
    chat_service.llm_service.stop_inference()
    return {"message": "Inference stopped"}
