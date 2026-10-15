import os
import json
import re
from typing import List, Dict, Any, Optional
from dotenv import load_dotenv
from topic_cache import topic_cache
from educational_kb import get_curated_topic_questions

load_dotenv()

def clean_json_text(text: str) -> str:
    """Strip markdown code block tags if present in LLM response"""
    text = text.strip()
    match = re.search(r"```(?:json)?\s*([\s\S]*?)\s*```", text)
    if match:
        return match.group(1).strip()
    return text

def validate_and_normalize_quiz(quiz_data: Dict[str, Any], default_title: str) -> Dict[str, Any]:
    """Validates question counts, option boundaries, indices, and sources"""
    questions = quiz_data.get("questions", [])
    valid_questions = []

    for idx, q in enumerate(questions):
        q_text = q.get("questionText", "").strip()
        options = q.get("options", [])
        correct_idx = q.get("correctAnswerIndex", 0)
        q_type = q.get("type", "mcq")

        if not q_text or len(options) < 2:
            continue

        if not (0 <= correct_idx < len(options)):
            correct_idx = 0

        valid_questions.append({
            "id": f"gen-q{idx + 1}",
            "questionText": q_text,
            "type": "true_false" if len(options) == 2 or q_type == "true_false" else "mcq",
            "options": options,
            "correctAnswerIndex": correct_idx,
            "explanation": q.get("explanation", "Verified based on study source material."),
            "sourceReference": q.get("sourceReference", "Educational Knowledge Base"),
            "difficulty": q.get("difficulty", "medium")
        })

    return {
        "title": quiz_data.get("title", default_title),
        "topicOrDocument": quiz_data.get("topicOrDocument", "Study Topic"),
        "totalQuestions": len(valid_questions),
        "questions": valid_questions
    }

def generate_quiz_with_gemini(
    context_text: str,
    question_count: int,
    difficulty: str,
    question_type: str,
    language: str,
    topic_or_doc_name: str,
    is_topic_mode: bool = False
) -> Optional[Dict[str, Any]]:
    """Generates structured questions using Google Gemini API"""
    api_key = os.getenv("GEMINI_API_KEY", "").strip()
    if not api_key or api_key == "your_gemini_api_key_here":
        return None

    try:
        from google import genai
        client = genai.Client(api_key=api_key)

        mode_instruction = (
            f"Generate educational questions based on standard curriculum knowledge of: '{topic_or_doc_name}'."
            if is_topic_mode
            else f"Generate questions based strictly on the provided study context:\n=== CONTEXT ===\n{context_text}\n==============="
        )

        prompt = f"""
You are an expert university professor and quiz author for QuizCraft AI.
{mode_instruction}

REQUIREMENTS:
1. Total Questions: Exactly {question_count}
2. Difficulty: {difficulty} (easy, medium, hard, or mixed)
3. Question Type: {question_type} (mcq: 4 distinct choices, true_false: 2 choices, or mixed)
4. Language: {language}
5. For EVERY question, include:
   - "questionText": Clear, unambiguous academic question.
   - "type": "mcq" or "true_false"
   - "options": Array of options (4 for MCQ, 2 ['True', 'False'] for True/False).
   - "correctAnswerIndex": 0-based integer index of the correct option.
   - "explanation": Clear educational rationale explaining why the answer is correct.
   - "sourceReference": Trusted academic textbook or curriculum standard (e.g., 'CLRS Algorithms', 'Silberschatz OS', 'Python Docs').
   - "difficulty": "easy", "medium", or "hard"

OUTPUT FORMAT:
Respond ONLY with a valid JSON object matching:
{{
  "title": "Comprehensive Quiz: {topic_or_doc_name}",
  "topicOrDocument": "{topic_or_doc_name}",
  "totalQuestions": {question_count},
  "questions": [ ... ]
}}
"""
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
        )

        raw_text = clean_json_text(response.text)
        parsed_json = json.loads(raw_text)
        return validate_and_normalize_quiz(parsed_json, f"Quiz on {topic_or_doc_name}")

    except Exception as e:
        print(f"[Warning] Gemini API call error: {e}. Falling back to rule-based generation.")
        return None

def generate_fallback_rag_quiz(
    passages: List[Dict[str, Any]],
    question_count: int,
    difficulty: str,
    doc_name: str
) -> Dict[str, Any]:
    """Generates questions from extracted document passages"""
    questions = []
    for i in range(min(question_count, max(len(passages), 1))):
        passage = passages[i % len(passages)] if passages else {
            "text": "Database transactions enforce ACID properties.",
            "source_reference": f"{doc_name}, Page 1"
        }
        text = passage.get("text", "")
        source = passage.get("source_reference", f"{doc_name}, Page 1")

        if "deadlock" in text.lower():
            questions.append({
                "id": f"rag-q{i+1}",
                "questionText": "According to the study material on deadlocks, which algorithm can be used for deadlock avoidance by verifying a safe sequence?",
                "type": "mcq",
                "options": [
                    "Dijkstra's Banker's Algorithm",
                    "Round Robin Algorithm",
                    "Shortest Job First",
                    "First-Come First-Served"
                ],
                "correctAnswerIndex": 0,
                "explanation": "Banker's Algorithm tests for safety by simulating the allocation of predetermined maximum possible amounts of all resources.",
                "sourceReference": source,
                "difficulty": difficulty if difficulty != "mixed" else "medium"
            })
        elif "scheduling" in text.lower() or "round robin" in text.lower():
            questions.append({
                "id": f"rag-q{i+1}",
                "questionText": "In Round Robin CPU scheduling, what happens if the time quantum allocated to processes is set excessively high?",
                "type": "mcq",
                "options": [
                    "It degenerates into First-Come, First-Served (FCFS) scheduling",
                    "Context-switching overhead dominates CPU utilization",
                    "Turnaround time becomes provably optimal",
                    "Processes enter deadlock automatically"
                ],
                "correctAnswerIndex": 0,
                "explanation": "If the time quantum is very large, each process finishes its CPU burst before the timer expires, behaving exactly like FCFS.",
                "sourceReference": source,
                "difficulty": difficulty if difficulty != "mixed" else "easy"
            })
        elif "acid" in text.lower() or "durability" in text.lower() or "transaction" in text.lower():
            questions.append({
                "id": f"rag-q{i+1}",
                "questionText": "Based on the transaction management notes, which ACID property ensures committed modifications survive power failure or crash?",
                "type": "mcq",
                "options": [
                    "Atomicity",
                    "Consistency",
                    "Isolation",
                    "Durability"
                ],
                "correctAnswerIndex": 3,
                "explanation": "Durability guarantees that once a transaction commits, its changes are written to non-volatile storage and will never be lost.",
                "sourceReference": source,
                "difficulty": difficulty if difficulty != "mixed" else "medium"
            })
        else:
            snippet = text[:90] + "..." if len(text) > 90 else text
            questions.append({
                "id": f"rag-q{i+1}",
                "questionText": f"Regarding the key concept in the document: '{snippet}', is this statement directly supported by the study notes?",
                "type": "true_false",
                "options": ["True", "False"],
                "correctAnswerIndex": 0,
                "explanation": f"True. This statement is directly referenced in: {source}.",
                "sourceReference": source,
                "difficulty": difficulty if difficulty != "mixed" else "easy"
            })

    return {
        "title": f"RAG Generated Quiz: {doc_name}",
        "topicOrDocument": doc_name,
        "totalQuestions": len(questions),
        "questions": questions
    }

def generate_rag_quiz(
    passages: List[Dict[str, Any]],
    settings: Dict[str, Any],
    doc_name: str
) -> Dict[str, Any]:
    """Generates Mode 1 (Document RAG) quiz. Never cached in shared cache for privacy."""
    q_count = settings.get("questionCount", 5)
    diff = settings.get("difficulty", "medium")
    q_type = settings.get("questionType", "mcq")
    lang = settings.get("language", "en")

    combined_context = "\n\n".join([
        f"[{p.get('source_reference', 'Source')}]:\n{p.get('text', '')}"
        for p in passages
    ])

    gemini_result = generate_quiz_with_gemini(
        context_text=combined_context,
        question_count=q_count,
        difficulty=diff,
        question_type=q_type,
        language=lang,
        topic_or_doc_name=doc_name,
        is_topic_mode=False
    )

    if gemini_result and len(gemini_result.get("questions", [])) > 0:
        return gemini_result

    return generate_fallback_rag_quiz(passages, q_count, diff, doc_name)

def generate_topic_quiz(
    topic: str,
    settings: Dict[str, Any]
) -> Dict[str, Any]:
    """
    Generates Mode 2 (Topic-Based) quiz using public educational knowledge.
    Leverages TopicCache for lightning-fast repeated queries.
    """
    q_count = settings.get("questionCount", 5)
    diff = settings.get("difficulty", "medium")
    q_type = settings.get("questionType", "mcq")
    lang = settings.get("language", "en")

    # 1. Check Topic Cache first (Shared Educational Cache)
    cached = topic_cache.get(topic, diff, q_type, q_count)
    if cached:
        return cached

    # 2. Try Gemini API
    gemini_result = generate_quiz_with_gemini(
        context_text="",
        question_count=q_count,
        difficulty=diff,
        question_type=q_type,
        language=lang,
        topic_or_doc_name=topic,
        is_topic_mode=True
    )

    if gemini_result and len(gemini_result.get("questions", [])) > 0:
        topic_cache.set(topic, diff, q_type, q_count, gemini_result)
        return gemini_result

    # 3. Fallback to Curated Educational Question Bank
    norm_key = topic_cache.normalize_topic(topic)
    curated_questions = get_curated_topic_questions(norm_key, q_count, diff)
    
    quiz_data = {
        "title": f"Mastery Quiz: {topic.title()}",
        "topicOrDocument": topic,
        "totalQuestions": len(curated_questions),
        "questions": curated_questions
    }

    # Store in topic cache
    topic_cache.set(topic, diff, q_type, q_count, quiz_data)
    return quiz_data
