from typing import List, Optional, Literal
from pydantic import BaseModel

class QuestionSchema(BaseModel):
    id: str
    questionText: str
    type: Literal['mcq', 'true_false']
    options: List[str]
    correctAnswerIndex: int
    explanation: str
    sourceReference: Optional[str] = None
    difficulty: Literal['easy', 'medium', 'hard']

class QuizResponse(BaseModel):
    title: str
    topicOrDocument: str
    totalQuestions: int
    questions: List[QuestionSchema]

class HealthResponse(BaseModel):
    status: str
    app: str
    version: str

class DocumentUploadResponse(BaseModel):
    filename: str
    char_count: int
    word_count: int
    page_count: int
    total_chunks: int
    preview: str
    message: str

class RAGSearchRequest(BaseModel):
    query: str
    top_k: Optional[int] = 3

class RetrievedPassage(BaseModel):
    text: str
    page: int
    filename: str
    relevance_distance: float
    source_reference: str

class RAGSearchResponse(BaseModel):
    query: str
    results_count: int
    passages: List[RetrievedPassage]

class GenerateQuizRequest(BaseModel):
    mode: Literal['document', 'topic']
    topic: Optional[str] = None
    questionCount: int = 5
    difficulty: Literal['easy', 'medium', 'hard', 'mixed'] = 'medium'
    questionType: Literal['mcq', 'true_false', 'mixed'] = 'mcq'
    chapterOrSubtopic: Optional[str] = None
    language: str = 'en'

class SaveAttemptRequest(BaseModel):
    title: str
    topic_or_document: str
    mode: str
    score: int
    total_questions: int
    percentage: int
    difficulty: str
    time_spent_seconds: int

class AttemptRecord(BaseModel):
    id: int
    title: str
    topic_or_document: str
    mode: str
    score: int
    total_questions: int
    percentage: int
    difficulty: str
    time_spent_seconds: int
    completed_at: str

class AnalyticsResponse(BaseModel):
    total_attempts: int
    avg_percentage: float
    total_questions_answered: int
    total_correct_answers: int
    highest_score: int
    total_time_spent_seconds: int
