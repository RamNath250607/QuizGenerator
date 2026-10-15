from typing import List
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from schemas import (
    HealthResponse,
    QuizResponse,
    DocumentUploadResponse,
    RAGSearchRequest,
    RAGSearchResponse,
    GenerateQuizRequest,
    SaveAttemptRequest,
    AttemptRecord,
    AnalyticsResponse
)
from document_extractor import extract_document, DocumentExtractionResult
from rag_service import rag_service
from ai_generator import generate_rag_quiz, generate_topic_quiz
from topic_cache import topic_cache
from database import (
    save_quiz_attempt,
    get_all_attempts,
    get_analytics,
    clear_all_attempts
)

# 1. Initialize FastAPI Application
app = FastAPI(
    title="QuizCraft AI Backend",
    description="Intelligent Quiz Generator and RAG Service",
    version="1.0.0"
)

# In-memory store for currently active document
CURRENT_DOCUMENT: dict = {}

# 2. Configure Cross-Origin Resource Sharing (CORS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 3. Health Check Endpoint
@app.get("/api/health", response_model=HealthResponse)
def health_check():
    """Verify that backend server is online and operational."""
    return {
        "status": "ok",
        "app": "QuizCraft AI Backend",
        "version": "1.0.0"
    }

# 4. Document Upload & RAG Indexing Endpoint (Milestone 6 & 7)
@app.post("/api/upload-document", response_model=DocumentUploadResponse)
async def upload_document(file: UploadFile = File(...)):
    """Extracts text and indexes into ChromaDB vector database."""
    try:
        file_bytes = await file.read()
        if len(file_bytes) == 0:
            raise HTTPException(status_code=400, detail="Uploaded file is empty.")

        result: DocumentExtractionResult = extract_document(file_bytes, file.filename)

        if not result.full_text or result.char_count == 0:
            raise HTTPException(
                status_code=400,
                detail="No readable text found in document. It may be a scanned image or empty."
            )

        index_result = rag_service.index_document(result.pages, result.filename)

        CURRENT_DOCUMENT["filename"] = result.filename
        CURRENT_DOCUMENT["full_text"] = result.full_text
        CURRENT_DOCUMENT["pages"] = result.pages
        CURRENT_DOCUMENT["chunks_count"] = index_result.get("total_chunks", 0)

        return {
            "filename": result.filename,
            "char_count": result.char_count,
            "word_count": result.word_count,
            "page_count": result.page_count,
            "total_chunks": index_result.get("total_chunks", 0),
            "preview": result.to_dict()["preview"],
            "message": f"Extracted {result.word_count} words and indexed {index_result.get('total_chunks', 0)} chunks in ChromaDB."
        }

    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process document: {str(e)}")

# Privacy Control: Delete Document and Purge Vector Embeddings (Milestone 10)
@app.delete("/api/delete-document")
def delete_document():
    """Purges uploaded document text and resets the ChromaDB vector collection."""
    CURRENT_DOCUMENT.clear()
    try:
        rag_service.client.delete_collection(name=rag_service.collection_name)
        rag_service._get_or_create_collection()
    except Exception:
        pass
    return {
        "status": "success",
        "message": "Uploaded study document and all associated ChromaDB vector embeddings have been securely deleted."
    }

# 5. RAG Retrieval / Semantic Search Endpoint (Milestone 7)
@app.post("/api/search-document", response_model=RAGSearchResponse)
def search_document(req: RAGSearchRequest):
    """Semantic vector search against uploaded document chunks."""
    if not CURRENT_DOCUMENT.get("filename"):
        raise HTTPException(
            status_code=400,
            detail="No document has been uploaded yet. Please upload a study document first."
        )

    passages = rag_service.retrieve_context(req.query, top_k=req.top_k or 3)
    return {
        "query": req.query,
        "results_count": len(passages),
        "passages": passages
    }

# 6. Master Quiz Generation Endpoint (Mode 1 & Mode 2 - Milestones 8 & 9)
@app.post("/api/generate-quiz", response_model=QuizResponse)
def generate_quiz(req: GenerateQuizRequest):
    """Generates tailored quizzes for Document Mode or Topic Mode."""
    if req.mode == "document":
        if not CURRENT_DOCUMENT.get("filename"):
            raise HTTPException(
                status_code=400,
                detail="No document uploaded. Please upload a study material first for Mode 1."
            )

        search_query = req.chapterOrSubtopic.strip() if req.chapterOrSubtopic else "key definitions and principles"
        passages = rag_service.retrieve_context(search_query, top_k=max(req.questionCount, 4))

        if not passages:
            passages = [{
                "text": CURRENT_DOCUMENT.get("full_text", "")[:2000],
                "source_reference": f"{CURRENT_DOCUMENT.get('filename')}, Page 1"
            }]

        doc_name = CURRENT_DOCUMENT.get("filename", "Uploaded Study Notes")
        return generate_rag_quiz(passages, req.dict(), doc_name)

    else:
        topic_name = (req.topic or "Python Programming").strip()
        return generate_topic_quiz(topic_name, req.dict())

# 7. SQLite Quiz History & Analytics Endpoints (Milestone 11)
@app.post("/api/attempts")
def record_attempt(attempt: SaveAttemptRequest):
    """Save completed quiz attempt to SQLite"""
    attempt_id = save_quiz_attempt(
        title=attempt.title,
        topic_or_document=attempt.topic_or_document,
        mode=attempt.mode,
        score=attempt.score,
        total_questions=attempt.total_questions,
        percentage=attempt.percentage,
        difficulty=attempt.difficulty,
        time_spent_seconds=attempt.time_spent_seconds
    )
    return {"status": "saved", "attempt_id": attempt_id}

@app.get("/api/attempts", response_model=List[AttemptRecord])
def list_attempts():
    """Retrieve history of student's quiz attempts"""
    return get_all_attempts()

@app.get("/api/analytics", response_model=AnalyticsResponse)
def get_student_analytics():
    """Returns overall student performance analytics"""
    return get_analytics()

@app.delete("/api/attempts")
def clear_history():
    """Purges all past quiz attempts for student privacy"""
    clear_all_attempts()
    return {"status": "cleared", "message": "Quiz history has been successfully reset."}

# 8. Topic Cache Statistics (Milestone 9 & 10)
@app.get("/api/cache-stats")
def get_cache_stats():
    """Inspect shared educational topic cache status."""
    return {
        "cached_topics_count": topic_cache.count(),
        "status": "active",
        "privacy_notice": "Only public educational topic quizzes are cached. Uploaded documents are strictly private."
    }

# 9. Sample Quiz Endpoint
@app.get("/api/sample-quiz", response_model=QuizResponse)
def get_sample_quiz():
    """Returns a verified sample quiz directly from FastAPI backend."""
    return {
        "title": "Database Management Systems (From FastAPI)",
        "topicOrDocument": "DBMS Normalization & Concurrency",
        "totalQuestions": 3,
        "questions": [
            {
                "id": "py-q1",
                "questionText": "What does ACID stand for in Database Management Systems?",
                "type": "mcq",
                "options": [
                    "Atomicity, Consistency, Isolation, Durability",
                    "Accuracy, Control, Integrity, Data",
                    "Access, Concurrency, Indexing, Distribution",
                    "Authorization, Compatibility, Isolation, Durability"
                ],
                "correctAnswerIndex": 0,
                "explanation": "ACID stands for Atomicity, Consistency, Isolation, and Durability - four fundamental properties ensuring reliable transaction processing in databases.",
                "sourceReference": "Database Systems Concepts, Chapter 14",
                "difficulty": "easy"
            },
            {
                "id": "py-q2",
                "questionText": "In a relational database, a foreign key can never have NULL values.",
                "type": "true_false",
                "options": ["True", "False"],
                "correctAnswerIndex": 1,
                "explanation": "False. Unless explicitly marked with a NOT NULL constraint, a foreign key column is allowed to contain NULL values when an association does not exist.",
                "sourceReference": "Relational Model & Integrity Rules",
                "difficulty": "medium"
            },
            {
                "id": "py-q3",
                "questionText": "Which isolation level prevents Dirty Reads, Non-repeatable Reads, and Phantom Reads completely?",
                "type": "mcq",
                "options": [
                    "Read Uncommitted",
                    "Read Committed",
                    "Repeatable Read",
                    "Serializable"
                ],
                "correctAnswerIndex": 3,
                "explanation": "Serializable is the highest isolation level. It executes transactions in a manner such that the concurrent execution is equivalent to some serial execution, preventing all concurrency anomalies.",
                "sourceReference": "SQL Isolation Levels Standard",
                "difficulty": "hard"
            }
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
