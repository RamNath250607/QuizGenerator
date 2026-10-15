# QuizCraft AI — Intelligent Quiz Generator & RAG Tutor

An AI-powered quiz generation platform built with **React**, **TypeScript**, **Tailwind CSS**, **FastAPI**, **ChromaDB**, and **Google Gemini API**.

---

## 🌟 Key Features

### 1. Mode 1: Quiz from Documents (RAG Mode)
- Upload **PDF**, **DOCX**, or **TXT** lecture notes and textbooks.
- High-speed text extraction with page tracking using **PyMuPDF** and **python-docx**.
- Overlapping semantic chunking and local vector embedding indexing via **ChromaDB**.
- Cites exact **page numbers** and source excerpts for every generated question.
- **Privacy First**: Uploaded documents and vector embeddings are stored in isolated sessions and can be purged with one click.

### 2. Mode 2: Quiz from Any Topic
- Generate university-level quizzes instantly without uploading documents.
- Supported topics include **DBMS**, **Python**, **Operating Systems**, **Artificial Intelligence**, **Machine Learning**, **Data Structures**, and custom subjects.
- **Shared Educational Cache**: Normalized topic caching speeds up response times and reduces LLM API consumption.

### 3. Interactive Quiz & Analytics
- Dynamic difficulty: **Easy**, **Medium**, **Hard**, or **Mixed**.
- Formats: **Multiple Choice (MCQ)**, **True/False**, or **Mixed**.
- Live timer, question palette with flag-for-review tags, and smooth progress tracking.
- Graded results with accuracy score rings, time breakdowns, and question-by-question explanations.
- **SQLite Learning History**: Tracks previous attempts, score trends, and overall study duration.

---

## 🎨 UI Color Palette

- **Indigo**: `#6366F1`
- **Violet**: `#8B5CF6`
- **Cyan**: `#06B6D4`
- **Coral / Rose**: `#FB7185`
- **Emerald**: `#10B981`
- **Lavender Background**: `#F5F3FF` (Light Mode) / `#020617` (Dark Mode)
- **Deep Navy Text**: `#1E1B4B` (Light Mode) / `#F8FAFC` (Dark Mode)

---

## 🚀 How to Run the Project Locally

### Prerequisites
- **Node.js**: v18+ or v24+
- **Python**: 3.10+ or 3.11+
- **Google Gemini API Key** (Optional, get free from [Google AI Studio](https://aistudio.google.com/))

---

### Step 1: Start the Backend (FastAPI)

1. Open a terminal and navigate to the `backend` folder:
   ```powershell
   cd backend
   ```

2. Install dependencies:
   ```powershell
   pip install -r requirements.txt
   ```

3. *(Optional)* Configure your Google Gemini API key:
   - Copy `.env.example` to `.env`:
     ```powershell
     copy .env.example .env
     ```
   - Open `.env` and add your key:
     ```env
     GEMINI_API_KEY=AIzaSy...
     ```
   *(Note: If no API key is provided, QuizCraft AI automatically uses its built-in educational knowledge engine!)*

4. Run the FastAPI development server:
   ```powershell
   python -m uvicorn main:app --reload --port 8000
   ```
   - Interactive Swagger API Documentation: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

---

### Step 2: Start the Frontend (React + Vite)

1. Open a second terminal and navigate to the `frontend` folder:
   ```powershell
   cd frontend
   ```

2. Install dependencies:
   ```powershell
   npm install
   ```

3. Start the Vite development server:
   ```powershell
   npm run dev
   ```

4. Open your browser at:
   👉 **http://localhost:5173**

---

## 📡 REST API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Health check & backend connection verification |
| `POST` | `/api/upload-document` | Uploads PDF/DOCX/TXT & creates ChromaDB vector index |
| `DELETE` | `/api/delete-document` | Purges uploaded document and resets ChromaDB vectors |
| `POST` | `/api/search-document` | Semantic vector similarity search against document chunks |
| `POST` | `/api/generate-quiz` | Master quiz generation (Document RAG or Topic) |
| `POST` | `/api/attempts` | Saves graded test attempt into SQLite |
| `GET` | `/api/attempts` | Retrieves past quiz attempts history |
| `GET` | `/api/analytics` | Returns aggregate metrics (average accuracy, total tests) |
| `DELETE` | `/api/attempts` | Resets quiz history for student privacy |
| `GET` | `/api/cache-stats` | Inspects shared educational topic cache status |

---

## 🔒 Privacy & Architecture Principles

- **Zero Document Leakage**: Uploaded documents are processed locally in an ephemeral ChromaDB collection and are **never** stored in the shared topic cache.
- **Local Persistence**: Test records and progress metrics are stored securely on your local disk in SQLite (`quizcraft.db`).
- **Resilience**: Operates seamlessly with or without an active internet connection or LLM API key.
