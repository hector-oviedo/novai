import logging
import uuid


class RAGService:
    """
    High-level Retrieval-Augmented Generation Service.
    Provides methods to ingest documents, remove documents, and retrieve relevant snippets.
    """
    def ingest_document(self, file, doc_id: str = None) -> str:
        return ""

    def remove_document(self, doc_id: str) -> str:
        return False
    
    def retrieve_relevant(self, doc_ids: list[str], prompt: str) -> str:
        return "prompt"

    def retrieve_snippet(self, doc_ids: list[str], prompt: str) -> str:
        return prompt
