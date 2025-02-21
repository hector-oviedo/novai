from rag.rag_vector_storage import ChromaDBHandler
from rag.rag_engine import rag_query

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

def list_documents():
    return vector_storage.list_documents()

def clean_database():
    return vector_storage.clean_database()

def query(prompt: str, doc_ids: list):
    return rag_query(vector_storage, prompt, doc_ids)