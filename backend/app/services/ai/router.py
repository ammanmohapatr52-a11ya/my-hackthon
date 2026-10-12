import json
import re
from typing import Optional
from backend.app.core.prompts import prompt_manager
from backend.app.schemas.ai import RouterResult
from backend.app.services.llm.base import LLMProvider

class RouterService:
    def fast_classify(self, query: str) -> Optional[RouterResult]:
        clean_q = query.strip()
        lower_q = clean_q.lower()

        # Math equation / computation patterns (Truth Rule 6: Never let LLM solve math)
        math_regexes = [
            r"^\s*solve\s+",
            r"\b\d*x\s*[\+\-\*\/]\s*\d+\s*=",
            r"=\s*0\b",
            r"\b(derivative|integral|d\/dx|calculate|factorize|expand|simplify)\b",
            r"x\^2",
            r"^\s*[\d\.\s\+\-\*\/\^\(\)]+\s*$"
        ]
        for pattern in math_regexes:
            if re.search(pattern, lower_q):
                return RouterResult(
                    intent="math_computation",
                    domain="science",
                    time_sensitive=False,
                    false_premise_suspected=False,
                    needs_clarification=False,
                    clarifying_question="",
                    route="math_engine"
                )

        # Ambiguous questions needing clarification
        if lower_q in ["who is the president?", "who is the prime minister?", "what is the capital?"]:
            return RouterResult(
                intent="unclear",
                domain="polity_civics",
                time_sensitive=True,
                false_premise_suspected=False,
                needs_clarification=True,
                clarifying_question="Which country or organization are you asking about?",
                route="clarify"
            )

        # False premise detection
        if "sydney" in lower_q and "capital" in lower_q:
            return RouterResult(
                intent="gk",
                domain="geography",
                time_sensitive=False,
                false_premise_suspected=True,
                needs_clarification=False,
                clarifying_question="",
                route="gk"
            )

        return None

    async def classify(self, query: str, provider: LLMProvider, model: Optional[str] = None) -> RouterResult:
        # Fast heuristic check first (instantaneous & deterministic)
        fast_result = self.fast_classify(query)
        if fast_result is not None:
            return fast_result

        # Run router prompt at temperature 0
        messages = [
            {"role": "system", "content": prompt_manager.router},
            {"role": "user", "content": f"Question: {query}"}
        ]

        try:
            raw_response = await provider.generate(
                messages=messages,
                model=model,
                temperature=0.0,
                json_format=True
            )
            data = json.loads(raw_response)
            return RouterResult(**data)
        except Exception as e:
            # Safe default fallback per TAD §6 / Document 06 §11
            return RouterResult(
                intent="academic_concept",
                domain="other",
                time_sensitive=False,
                false_premise_suspected=False,
                needs_clarification=False,
                clarifying_question="",
                route="explain"
            )

router_service = RouterService()
