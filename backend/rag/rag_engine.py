# rag_engine.py
from llama_index.embeddings.huggingface import HuggingFaceEmbedding
from typing import List

def rag_query(vector_storage, prompt: str, doc_ids: List[str]):
    # 1. Embed prompt
    embed_model = vector_storage.embed_model  # same HuggingFaceEmbedding
    prompt_embedding = embed_model.get_text_embedding(prompt)

    # 2. Filter for doc_ids
    where_clause = {"doc_id": {"$in": doc_ids}} if doc_ids else {}

    # 3. Query top-k relevant chunks
    results = vector_storage.collection.query(
        query_embeddings=[prompt_embedding],
        n_results=3,
        where=where_clause,
        include=["documents"]
    )

    # 4. Return concatenated retrieved text
    retrieved_chunks = results["documents"][0] if results and results.get("documents") else []
    return "\n\n".join(retrieved_chunks)
