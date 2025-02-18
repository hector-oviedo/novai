# File: rag/rag_engine.py
from llama_index.core import Document, StorageContext, VectorStoreIndex, Settings
from llama_index.vector_stores.chroma import ChromaVectorStore
from llama_index.embeddings.huggingface import HuggingFaceEmbedding

def query_with_llama(prompt: str, docs: list):
    # Convert dict docs to LlamaIndex Document objects.
    documents = [
        Document(text=doc["text"], metadata={"doc_id": doc["doc_id"], "chunk_index": doc["chunk_index"]})
        for doc in docs
    ]
    embed_model = HuggingFaceEmbedding(model_name="BAAI/bge-small-en-v1.5")
    import chromadb
    db = chromadb.PersistentClient(path="./data/chroma_db")
    collection = db.get_or_create_collection(name="rag_collection")
    vector_store = ChromaVectorStore(chroma_collection=collection)
    storage_context = StorageContext.from_defaults(vector_store=vector_store)
    index = VectorStoreIndex.from_documents(documents, storage_context=storage_context, embed_model=embed_model)
    
    # Disable the global LLM so that synthesis is skipped.
    Settings.llm = None

    # Use retrieval-only mode.
    query_engine = index.as_query_engine(llm=None)
    response = query_engine.query(prompt)
    return {"result": str(response)}
