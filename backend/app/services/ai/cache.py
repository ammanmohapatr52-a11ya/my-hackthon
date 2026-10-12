import hashlib
from typing import Dict, List, Optional
from backend.app.core.config import settings
from backend.app.schemas.ai import ExplanationObject

class LocalAICache:
    def __init__(self, max_size: int = 500):
        self.max_size = max_size
        self._store: Dict[str, ExplanationObject] = {}

    def compute_key(
        self,
        question: str,
        level: int,
        model: str,
        fact_ids: List[str],
        language: str = "en"
    ) -> str:
        norm_q = " ".join(question.strip().lower().split())
        facts_str = ",".join(sorted(fact_ids))
        raw = f"{norm_q}:{level}:{model}:{settings.PROMPT_VERSION}:{facts_str}:{language}"
        return hashlib.sha256(raw.encode("utf-8")).hexdigest()

    def get(self, key: str) -> Optional[ExplanationObject]:
        return self._store.get(key)

    def set(self, key: str, value: ExplanationObject):
        if len(self._store) >= self.max_size:
            # Evict an oldest entry
            first_key = next(iter(self._store))
            del self._store[first_key]
        self._store[key] = value

    def clear(self):
        self._store.clear()

ai_cache = LocalAICache()
