from typing import List, Dict, Any, Optional
import chromadb
from chromadb.config import Settings

class RAGService:
    def __init__(self):
        # Initialize in-memory ChromaDB client
        self.client = chromadb.Client(Settings(anonymized_telemetry=False))
        self.collection_name = "quizcraft_active_document"
        self._get_or_create_collection()

    def _get_or_create_collection(self):
        try:
            self.collection = self.client.get_or_create_collection(
                name=self.collection_name,
                metadata={"description": "Active study document embeddings for QuizCraft AI"}
            )
        except Exception:
            # Fallback re-creation
            self.client.delete_collection(name=self.collection_name)
            self.collection = self.client.create_collection(name=self.collection_name)

    def chunk_document(
        self,
        pages: List[Dict[str, Any]],
        filename: str,
        chunk_size: int = 500,
        chunk_overlap: int = 100
    ) -> List[Dict[str, Any]]:
        """
        Splits extracted pages into overlapping chunks while preserving page numbers.
        Overlapping ensures sentences on boundaries aren't severed.
        """
        chunks = []
        global_chunk_idx = 0

        for page_data in pages:
            page_num = page_data.get("page_number", 1)
            text = page_data.get("text", "").strip()

            if not text:
                continue

            start = 0
            text_len = len(text)

            while start < text_len:
                end = min(start + chunk_size, text_len)
                chunk_text = text[start:end].strip()

                if len(chunk_text) > 30:  # Skip tiny fragments
                    chunks.append({
                        "id": f"{filename}_p{page_num}_c{global_chunk_idx}",
                        "text": chunk_text,
                        "metadata": {
                            "page": page_num,
                            "filename": filename,
                            "chunk_index": global_chunk_idx
                        }
                    })
                    global_chunk_idx += 1

                # Move forward with overlap
                start += chunk_size - chunk_overlap
                if start >= text_len - chunk_overlap:
                    break

        return chunks

    def index_document(self, pages: List[Dict[str, Any]], filename: str) -> Dict[str, Any]:
        """
        Chunks the document and inserts all passages into ChromaDB vector database.
        """
        # Reset previous document collection to keep index fresh
        try:
            self.client.delete_collection(name=self.collection_name)
        except Exception:
            pass
        self._get_or_create_collection()

        chunks = self.chunk_document(pages, filename)

        if not chunks:
            return {"total_chunks": 0, "message": "No valid text chunks to index."}

        ids = [c["id"] for c in chunks]
        documents = [c["text"] for c in chunks]
        metadatas = [c["metadata"] for c in chunks]

        # Add into ChromaDB (embedding model automatically computes vector coordinates)
        self.collection.add(
            ids=ids,
            documents=documents,
            metadatas=metadatas
        )

        return {
            "total_chunks": len(chunks),
            "filename": filename,
            "message": f"Successfully chunked and indexed {len(chunks)} passages into ChromaDB."
        }

    def retrieve_context(self, query: str, top_k: int = 4) -> List[Dict[str, Any]]:
        """
        Performs semantic vector similarity search against the indexed document chunks.
        Returns top-k most relevant text passages with source page numbers.
        """
        if not self.collection or self.collection.count() == 0:
            return []

        results = self.collection.query(
            query_texts=[query],
            n_results=min(top_k, self.collection.count())
        )

        retrieved_passages = []
        if results and "documents" in results and results["documents"]:
            docs = results["documents"][0]
            metas = results["metadatas"][0] if "metadatas" in results else [{}] * len(docs)
            distances = results["distances"][0] if "distances" in results else [0.0] * len(docs)

            for doc_text, meta, dist in zip(docs, metas, distances):
                retrieved_passages.append({
                    "text": doc_text,
                    "page": meta.get("page", 1),
                    "filename": meta.get("filename", "Uploaded Document"),
                    "relevance_distance": round(float(dist), 4),
                    "source_reference": f"{meta.get('filename', 'Doc')}, Page {meta.get('page', 1)}"
                })

        return retrieved_passages

# Singleton instance
rag_service = RAGService()
