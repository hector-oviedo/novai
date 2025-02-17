# routes/documents.py

from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, Form
from sqlalchemy.orm import Session
import uuid
from typing import Optional

from database import get_db
from security import get_current_user_id
from models.document import Document
from models.session_document import SessionDocument
from services.RAGService import RAGService  # <-- import here

router = APIRouter()

@router.get("/list")
def list_documents(
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user_id)
):
    docs = db.query(Document).filter(Document.user_id == user_id).all()
    result = []
    for d in docs:
        attached_sessions = (
            db.query(SessionDocument.session_id)
              .filter(SessionDocument.document_id == d.id)
              .all()
        )
        session_ids = [s[0] for s in attached_sessions]
        result.append({
            "id": d.id,
            "name": d.name,
            "description": d.description,
            "content": d.content,
            "sessions": session_ids
        })
    return result

@router.post("/upload")
async def upload_document(
    name: str = Form(...),
    description: Optional[str] = Form(None),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user_id)
):
    doc_id = str(uuid.uuid4())

    # 1) Actually read the file contents into memory
    contents_bytes = await file.read()
    try:
        text_str = contents_bytes.decode("utf-8", errors="ignore")
    except UnicodeDecodeError:
        text_str = ""  # or raise an HTTPException if needed

    # 2) Insert into your Document table
    new_doc = Document(
        id=doc_id,
        user_id=user_id,
        name=name,
        description=description,
        content=file.filename  # still storing the filename in 'content' col
    )
    db.add(new_doc)
    db.commit()
    db.refresh(new_doc)

    # 3) Also call RAG ingest
    RAGService.ingest_document(db, doc_id, text_str)

    return {
        "message": "Document uploaded",
        "id": new_doc.id,
        "name": new_doc.name,
        "description": new_doc.description
    }

@router.post("/delete")
def delete_document(
    payload: dict,
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user_id)
):
    doc_id = payload.get("doc_id")
    if not doc_id:
        raise HTTPException(status_code=400, detail="doc_id is required.")

    doc = (
        db.query(Document)
          .filter(Document.id == doc_id, Document.user_id == user_id)
          .first()
    )
    if not doc:
        raise HTTPException(
            status_code=404,
            detail="Document not found or not owned by user."
        )

    # remove from DB
    db.delete(doc)
    db.commit()

    # Also remove from RAG store
    rag_service.remove_document(doc_id)

    return {"message": "Document deleted"}


@router.post("/attach")
def attach_document_to_session(
    payload: dict,
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user_id)
):
    doc_id = payload.get("doc_id")
    session_id = payload.get("session_id")
    if not doc_id or not session_id:
        raise HTTPException(status_code=400, detail="doc_id and session_id are required.")

    # check ownership
    doc = db.query(Document).filter(
        Document.id == doc_id,
        Document.user_id == user_id
    ).first()
    if not doc:
        raise HTTPException(
            status_code=404,
            detail="Document not found or not owned by user."
        )

    attach_id = str(uuid.uuid4())
    attachment = SessionDocument(
        id=attach_id, session_id=session_id, document_id=doc_id
    )
    db.add(attachment)
    db.commit()
    return {"message": "Document attached"}

@router.post("/detach")
def detach_document_from_session(
    payload: dict,
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user_id)
):
    doc_id = payload.get("doc_id")
    session_id = payload.get("session_id")
    if not doc_id or not session_id:
        raise HTTPException(status_code=400, detail="doc_id and session_id are required.")

    attach = db.query(SessionDocument).filter(
        SessionDocument.document_id == doc_id,
        SessionDocument.session_id == session_id
    ).first()
    if not attach:
        raise HTTPException(
            status_code=404,
            detail="Document not attached to this session."
        )

    db.delete(attach)
    db.commit()
    return {"message": "Document detached"}
