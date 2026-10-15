import sqlite3
import os
from datetime import datetime
from typing import List, Dict, Any

DB_PATH = os.path.join(os.path.dirname(__file__), "quizcraft.db")

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """Initializes SQLite tables for student quiz history and analytics"""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS quiz_attempts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            topic_or_document TEXT NOT NULL,
            mode TEXT NOT NULL,
            score INTEGER NOT NULL,
            total_questions INTEGER NOT NULL,
            percentage INTEGER NOT NULL,
            difficulty TEXT NOT NULL,
            time_spent_seconds INTEGER NOT NULL,
            completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    """)
    conn.commit()
    conn.close()

def save_quiz_attempt(
    title: str,
    topic_or_document: str,
    mode: str,
    score: int,
    total_questions: int,
    percentage: int,
    difficulty: str,
    time_spent_seconds: int
) -> int:
    """Records a student's quiz attempt into SQLite"""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO quiz_attempts (
            title, topic_or_document, mode, score, total_questions, percentage, difficulty, time_spent_seconds, completed_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        title,
        topic_or_document,
        mode,
        score,
        total_questions,
        percentage,
        difficulty,
        time_spent_seconds,
        datetime.utcnow().isoformat()
    ))
    attempt_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return attempt_id

def get_all_attempts(limit: int = 50) -> List[Dict[str, Any]]:
    """Retrieves previous quiz attempts ordered by most recent"""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT id, title, topic_or_document, mode, score, total_questions, percentage, difficulty, time_spent_seconds, completed_at
        FROM quiz_attempts
        ORDER BY id DESC
        LIMIT ?
    """, (limit,))
    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]

def get_analytics() -> Dict[str, Any]:
    """Calculates student learning analytics across all quiz attempts"""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT 
            COUNT(*) as total_attempts,
            COALESCE(AVG(percentage), 0) as avg_percentage,
            COALESCE(SUM(total_questions), 0) as total_questions_answered,
            COALESCE(SUM(score), 0) as total_correct_answers,
            COALESCE(MAX(percentage), 0) as highest_score,
            COALESCE(SUM(time_spent_seconds), 0) as total_time_spent
        FROM quiz_attempts
    """)
    row = cursor.fetchone()
    conn.close()

    return {
        "total_attempts": row["total_attempts"],
        "avg_percentage": round(row["avg_percentage"], 1),
        "total_questions_answered": row["total_questions_answered"],
        "total_correct_answers": row["total_correct_answers"],
        "highest_score": row["highest_score"],
        "total_time_spent_seconds": row["total_time_spent"]
    }

def clear_all_attempts():
    """Purges quiz history for student privacy control"""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM quiz_attempts;")
    conn.commit()
    conn.close()

# Initialize tables on import
init_db()
