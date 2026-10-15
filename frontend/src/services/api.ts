import type { QuizData } from '../types/quiz';
import type { QuizMode } from '../components/ModeSelector';

const BACKEND_URL = 'http://127.0.0.1:8000';

export interface HealthStatus {
  status: string;
  app: string;
  version: string;
}

export interface DocumentExtractionMeta {
  filename: string;
  char_count: number;
  word_count: number;
  page_count: number;
  total_chunks: number;
  preview: string;
  message: string;
}

export interface RetrievedPassage {
  text: string;
  page: number;
  filename: string;
  relevance_distance: number;
  source_reference: string;
}

export interface RAGSearchResponse {
  query: string;
  results_count: number;
  passages: RetrievedPassage[];
}

export interface GenerateQuizPayload {
  mode: QuizMode;
  topic?: string;
  questionCount: number;
  difficulty: string;
  questionType: string;
  chapterOrSubtopic?: string;
  language: string;
}

export interface SaveAttemptPayload {
  title: string;
  topic_or_document: string;
  mode: string;
  score: number;
  total_questions: number;
  percentage: number;
  difficulty: string;
  time_spent_seconds: number;
}


export interface AttemptRecord {
  id: number;
  title: string;
  topic_or_document: string;
  mode: string;
  score: number;
  total_questions: number;
  percentage: number;
  difficulty: string;
  time_spent_seconds: number;
  completed_at: string;
}

export interface AnalyticsData {
  total_attempts: number;
  avg_percentage: number;
  total_questions_answered: number;
  total_correct_answers: number;
  highest_score: number;
  total_time_spent_seconds: number;
}

/**
 * Check backend health status (FastAPI)
 */
export async function checkBackendHealth(): Promise<HealthStatus | null> {
  try {
    const response = await fetch(`${BACKEND_URL}/api/health`, {
      method: 'GET',
    });
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

/**
 * Upload and extract text from document (PDF, DOCX, TXT) + Index in ChromaDB
 */
export async function uploadDocumentToBackend(file: File): Promise<DocumentExtractionMeta> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${BACKEND_URL}/api/upload-document`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.detail || `Upload failed with status: ${response.status}`);
  }

  return await response.json();
}

/**
 * Privacy Control: Delete uploaded document & clear ChromaDB vectors
 */
export async function deleteDocumentFromBackend(): Promise<void> {
  try {
    await fetch(`${BACKEND_URL}/api/delete-document`, {
      method: 'DELETE',
    });
  } catch (err) {
    console.warn('Failed to delete document from backend:', err);
  }
}

/**
 * Perform semantic similarity search on uploaded document in ChromaDB
 */
export async function searchDocumentInChroma(query: string, topK: number = 3): Promise<RAGSearchResponse> {
  const response = await fetch(`${BACKEND_URL}/api/search-document`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, top_k: topK }),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.detail || `RAG search failed with status: ${response.status}`);
  }

  return await response.json();
}

/**
 * Master Quiz Generation API call
 */
export async function generateQuizFromBackend(payload: GenerateQuizPayload): Promise<QuizData> {
  const response = await fetch(`${BACKEND_URL}/api/generate-quiz`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.detail || `Failed to generate quiz: ${response.statusText}`);
  }

  return await response.json();
}

/**
 * SQLite History & Analytics Services (Milestone 11)
 */
export async function saveQuizAttemptToBackend(payload: {
  title: string;
  topic_or_document: string;
  mode: string;
  score: number;
  total_questions: number;
  percentage: number;
  difficulty: string;
  time_spent_seconds: number;
}): Promise<void> {
  try {
    await fetch(`${BACKEND_URL}/api/attempts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.warn('Failed to record quiz attempt in SQLite:', err);
  }
}

export async function fetchQuizAttemptsFromBackend(): Promise<AttemptRecord[]> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/attempts`);
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

export async function fetchAnalyticsFromBackend(): Promise<AnalyticsData | null> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/analytics`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function clearQuizHistoryFromBackend(): Promise<void> {
  try {
    await fetch(`${BACKEND_URL}/api/attempts`, {
      method: 'DELETE',
    });
  } catch (err) {
    console.warn('Failed to reset history in SQLite:', err);
  }
}

/**
 * Fetch sample quiz from FastAPI backend
 */
export async function fetchSampleQuizFromBackend(): Promise<QuizData | null> {
  try {
    const response = await fetch(`${BACKEND_URL}/api/sample-quiz`, {
      method: 'GET',
    });
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}
