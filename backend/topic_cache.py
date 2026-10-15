import re
from typing import Dict, Any, Optional

class TopicCache:
    """
    In-memory or persistent cache for general educational topic quizzes.
    IMPORTANT (Privacy Rule): Only public educational topics are cached.
    Uploaded documents and private RAG extractions are NEVER cached here.
    """
    def __init__(self):
        self._cache: Dict[str, Dict[str, Any]] = {}

    def normalize_topic(self, topic: str) -> str:
        """
        Normalizes topic strings to canonical keys.
        e.g., 'DBMS & SQL' -> 'dbms', 'Operating Systems' -> 'operating_systems'
        """
        t = topic.lower().strip()
        t = re.sub(r'[^a-z0-9\s]', '', t)
        t = re.sub(r'\s+', '_', t)

        aliases = {
            'dbms': 'dbms',
            'dbms_sql': 'dbms',
            'database': 'dbms',
            'database_management_systems': 'dbms',
            'os': 'operating_systems',
            'operating_system': 'operating_systems',
            'operating_systems': 'operating_systems',
            'python': 'python',
            'python_programming': 'python',
            'ai': 'artificial_intelligence',
            'artificial_intelligence': 'artificial_intelligence',
            'ml': 'machine_learning',
            'machine_learning': 'machine_learning',
            'dsa': 'data_structures',
            'data_structures': 'data_structures',
            'data_structures__algorithms': 'data_structures',
            'computer_networks': 'computer_networks',
            'networks': 'computer_networks',
            'software_engineering': 'software_engineering',
        }

        return aliases.get(t, t)

    def get_cache_key(self, topic: str, difficulty: str, question_type: str, count: int) -> str:
        norm = self.normalize_topic(topic)
        return f"{norm}:{difficulty}:{question_type}:{count}"

    def get(self, topic: str, difficulty: str, question_type: str, count: int) -> Optional[Dict[str, Any]]:
        key = self.get_cache_key(topic, difficulty, question_type, count)
        return self._cache.get(key)

    def set(self, topic: str, difficulty: str, question_type: str, count: int, quiz_data: Dict[str, Any]):
        key = self.get_cache_key(topic, difficulty, question_type, count)
        # Mark clearly as cached general educational knowledge
        cached_copy = dict(quiz_data)
        cached_copy["is_cached"] = True
        self._cache[key] = cached_copy

    def count(self) -> int:
        return len(self._cache)

    def clear(self):
        self._cache.clear()

topic_cache = TopicCache()
