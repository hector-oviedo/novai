from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from pydantic import BaseModel
from typing import List
from rag import rag_service

router = APIRouter()

@router.post("/upload", tags=["RAG"])
async def upload_document(doc_id: str = Form(...), file: UploadFile = File(...)):
    if file.content_type != "text/plain":
        raise HTTPException(status_code=400, detail="Only text files are allowed.")
    content = await file.read()
    text = content.decode("utf-8")
    result = rag_service.upload_document(doc_id, text)
    return result

@router.delete("/delete", tags=["RAG"])
def delete_document(doc_id: str):
    result = rag_service.delete_document(doc_id)
    return result

@router.get("/chunks", tags=["RAG"])
def get_chunks(doc_id: str):
    result = rag_service.get_chunks(doc_id)
    return {"doc_id": doc_id, "chunks": result}

@router.get("/embeddings", tags=["RAG"])
def get_embeddings(doc_id: str):
    result = rag_service.get_embeddings(doc_id)
    return {"doc_id": doc_id, "embeddings": result}

class QueryRequest(BaseModel):
    prompt: str
    docs: List[str]

@router.post("/query", tags=["RAG"])
def query_documents(query: QueryRequest):
    result = rag_service.query(query.prompt, query.docs)
    return result

@router.get("/list", tags=["RAG"])
def list_documents():
    result = rag_service.list_documents()
    return {"documents": result}

@router.delete("/clean", tags=["RAG"])
def clean_database():
    result = rag_service.clean_database()
    return result

# --- To test with Postman:
# 1. POST http://localhost:8000/rag/upload
#    Body (form-data): key: doc_id (text), key: file (file, only .txt)
#
# 2. DELETE http://localhost:8000/rag/delete?doc_id=YOUR_DOC_ID
#
# 3. GET http://localhost:8000/rag/chunks?doc_id=YOUR_DOC_ID
#
# 4. GET http://localhost:8000/rag/embeddings?doc_id=YOUR_DOC_ID
#
# 5. GET http://localhost:8000/rag/list
#
# 6. DELETE http://localhost:8000/rag/clean
#
# 7. POST http://localhost:8000/rag/query
#    Body (raw, JSON):
#    {
#       "prompt": "Your query text",
#       "docs": ["doc_id1", "doc_id2"]
#    }
