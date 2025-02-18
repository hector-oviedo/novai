# File: rag/rag_service.py
from rag.rag_vector_storage import ChromaDBHandler
from rag.rag_engine import query_with_llama

# Instantiate one persistent vector store handler
vector_storage = ChromaDBHandler()

def upload_document(doc_id: str, text: str):
    return vector_storage.add_document(doc_id, text)

def delete_document(doc_id: str):
    return vector_storage.delete_document(doc_id)

def get_chunks(doc_id: str):
    return vector_storage.get_chunks(doc_id)

def get_embeddings(doc_id: str):
    return vector_storage.get_embeddings(doc_id)

def query(prompt: str, docs: list):
    # Gather all document chunks for the given doc_ids.
    documents = vector_storage.get_documents_for_ids(docs)
    if not documents:
        return {"result": "No documents found for given doc_ids."}
    return query_with_llama(prompt, documents)
