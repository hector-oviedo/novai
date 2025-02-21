import os
import uuid
import chromadb
from llama_index.embeddings.huggingface import HuggingFaceEmbedding

class ChromaDBHandler:
    def __init__(self, db_path: str = "./data/chroma_db", collection_name: str = "rag_collection"):
        # Ensure the data directory exists.
        os.makedirs(os.path.dirname(db_path), exist_ok=True)
        self.db_path = db_path
        self.client = chromadb.PersistentClient(path=db_path)
        self.collection = self.client.get_or_create_collection(name=collection_name)
        # Initialize embedding model.
        self.embed_model = HuggingFaceEmbedding(model_name="BAAI/bge-small-en-v1.5")
        self.chunk_size = 500  # characters per chunk

    def split_text(self, text: str):
        return [text[i : i + self.chunk_size] for i in range(0, len(text), self.chunk_size)]

    def add_document(self, doc_id: str, text: str):
        chunks = self.split_text(text)
        documents = chunks
        embeddings = []
        metadatas = []
        ids = []
        for i, chunk in enumerate(chunks):
            emb = self.embed_model.get_text_embedding(chunk)
            embeddings.append(emb)
            metadatas.append({"doc_id": doc_id, "chunk_index": i})
            ids.append(str(uuid.uuid4()))
        self.collection.add(documents=documents, embeddings=embeddings, metadatas=metadatas, ids=ids)
        return {"status": "success", "doc_id": doc_id, "chunks_added": len(chunks)}

    def delete_document(self, doc_id: str):
        # Delete all entries where doc_id equals the provided value
        self.collection.delete(where={"doc_id": doc_id})
        return {"status": "success", "doc_id": doc_id}

    def get_chunks(self, doc_id: str):
        res = self.collection.get(where={"doc_id": doc_id}, include=["documents"])
        return res.get("documents", [])

    def get_embeddings(self, doc_id: str):
        res = self.collection.get(where={"doc_id": doc_id}, include=["embeddings"])
        embeddings = res.get("embeddings", [])
        processed = []
        for emb in embeddings:
            try:
                processed.append(emb.tolist())
            except AttributeError:
                processed.append(emb)
        return processed

    def list_documents(self):
        """
        Returns a list of unique doc_ids present in the vector store.
        Only considers metadata entries that are dictionaries containing a 'doc_id' key.
        """
        res = self.collection.get(include=["metadatas"])
        metadatas = res.get("metadatas", [])
        flat = []
        for item in metadatas:
            if isinstance(item, list):
                flat.extend(item)
            else:
                flat.append(item)
        doc_ids = { m["doc_id"] for m in flat if isinstance(m, dict) and "doc_id" in m }
        return list(doc_ids)

    def clean_database(self):
        """
        Completely deletes all entries from the collection.
        Uses a filter that matches any entry with a non-empty 'doc_id'.
        """
        self.collection.delete(where={"doc_id": {"$ne": ""}})
        return {"status": "success", "message": "All entries deleted"}

