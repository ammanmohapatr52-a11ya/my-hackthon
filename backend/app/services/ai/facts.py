import json
import re
from datetime import date
from pathlib import Path
from typing import List, Tuple
from backend.app.core.config import settings
from backend.app.schemas.ai import FactItem

STOP_WORDS = {
    "who", "is", "the", "of", "in", "what", "a", "an", "are", "was", "were", "for", "to",
    "and", "on", "at", "which", "by", "this", "that", "with", "from", "as", "it", "how",
    "can", "you", "tell", "me", "about", "explain", "describe", "define", "give", "state"
}

CURRENT_KEYWORDS = {"current", "present", "now", "today", "incumbent", "latest", "वर्तमान"}
PAST_FIRST_KEYWORDS = {"first", "former", "1947", "past", "history", "earliest", "पहले", "प्रथम"}

def stem_word(w: str) -> str:
    """Lightweight morphological stemmer for academic and scientific terms."""
    w = w.lower().strip()
    if w.endswith("'s"):
        w = w[:-2]
    for sfx in ("ing", "tion", "tions", "ies", "es", "ed", "ly", "al", "ic", "s"):
        if len(w) > len(sfx) + 3 and w.endswith(sfx):
            w = w[:-len(sfx)]
            break
    return w

EXPANSIONS = [
    (r"\bpm\b", "prime minister pm"),
    (r"\bcm\b", "chief minister cm"),
    (r"\bcji\b", "chief justice of india cji"),
    (r"\bsc\b", "supreme court sc"),
    (r"\bisro\b", "isro space agency"),
    (r"\bdna\b", "dna deoxyribonucleic acid"),
    (r"\brna\b", "rna ribonucleic acid"),
    (r"\batp\b", "atp adenosine triphosphate energy"),
    (r"\bml\b", "machine learning ml"),
    (r"\bai\b", "artificial intelligence ai"),
    (r"\bthermo\b", "thermodynamics thermo"),
    (r"\bcalc\b", "calculus calculus"),
    (r"\bnewtons\b", "newton newton"),
]

def normalize_text(text: str) -> Tuple[str, str, set, set]:
    clean = re.sub(r"[^\w\s]", " ", text.lower()).strip()
    expanded = clean
    for pattern, replacement in EXPANSIONS:
        expanded = re.sub(pattern, replacement, expanded)
    
    tokens = {w for w in expanded.split() if len(w) >= 2 and w not in STOP_WORDS}
    stems = {stem_word(w) for w in tokens if len(w) >= 2}
    return clean, expanded, tokens, stems

class FactRetriever:
    def __init__(self, facts_dir: Path = settings.FACTS_DIR):
        self.facts_dir = facts_dir
        self.facts: List[FactItem] = []
        self.load_facts()

    def load_facts(self):
        self.facts.clear()
        if not self.facts_dir.exists():
            return
        
        for file in self.facts_dir.glob("*.json"):
            try:
                data = json.loads(file.read_text(encoding="utf-8"))
                for item in data:
                    self.facts.append(FactItem(**item))
            except Exception as e:
                print(f"Error loading fact file {file}: {e}")

    def retrieve(self, query: str, limit: int = 3) -> List[FactItem]:
        today_iso = date.today().isoformat()
        clean_q, expanded_q, q_tokens, q_stems = normalize_text(query)
        if not q_tokens and len(clean_q) < 2:
            return []

        query_is_current = any(kw in clean_q for kw in CURRENT_KEYWORDS)
        query_is_first = any(kw in clean_q for kw in PAST_FIRST_KEYWORDS)

        scored: List[Tuple[float, FactItem]] = []

        for fact in self.facts:
            # Check expiry
            if fact.valid_until and fact.valid_until < today_iso:
                continue

            best_variant_score = 0.0
            for variant in fact.question_variants:
                var_clean, var_expanded, var_tokens, var_stems = normalize_text(variant)
                var_is_current = any(kw in var_clean for kw in CURRENT_KEYWORDS)
                var_is_first = any(kw in var_clean for kw in PAST_FIRST_KEYWORDS)

                # Temporal contradiction guard: prevent first/historical officeholders from matching current queries
                if query_is_current and var_is_first:
                    continue
                if query_is_first and var_is_current:
                    continue

                v_score = 0.0
                if clean_q == var_clean:
                    v_score = 100.0
                elif len(clean_q) >= 8 and len(var_clean) >= 8 and (clean_q in var_clean or var_clean in clean_q):
                    v_score = 80.0
                elif len(expanded_q) >= 8 and len(var_expanded) >= 8 and (expanded_q in var_expanded or var_expanded in expanded_q):
                    v_score = 70.0
                else:
                    # Token and stem intersection
                    common_tokens = q_tokens.intersection(var_tokens)
                    common_stems = q_stems.intersection(var_stems)
                    
                    token_coverage = len(common_tokens) / len(q_tokens) if q_tokens else 0
                    stem_coverage = len(common_stems) / len(q_stems) if q_stems else 0
                    
                    if len(common_tokens) >= 2:
                        v_score = 35.0 + (len(common_tokens) * 12.0 * token_coverage)
                    elif len(common_stems) >= 2:
                        v_score = 30.0 + (len(common_stems) * 10.0 * stem_coverage)
                    elif len(common_tokens) == 1 and len(q_tokens) <= 2:
                        v_score = 35.0

                if v_score > best_variant_score:
                    best_variant_score = v_score

            # Reinforce with answer text overlap only if variant matched plausibly
            final_score = best_variant_score
            if best_variant_score >= 25.0:
                ans_clean, _, ans_tokens, ans_stems = normalize_text(f"{fact.answer} {fact.details}")
                ans_overlap = len(q_tokens.intersection(ans_tokens)) + len(q_stems.intersection(ans_stems)) * 0.5
                final_score += (ans_overlap * 2.0)

            # Strict cutoff: score must be at least 30.0 to prevent false-positive matches (no overfitting)
            if final_score >= 30.0:
                scored.append((final_score, fact))

        scored.sort(key=lambda x: x[0], reverse=True)
        return [f for _, f in scored[:limit]]

    def format_facts_block(self, matched_facts: List[FactItem]) -> str:
        if not matched_facts:
            return ""
        
        lines = ["FACTS (verified; use these over your memory):"]
        for idx, fact in enumerate(matched_facts, 1):
            lines.append(f"[{idx}] {fact.answer} {fact.details} (verified: {fact.verified_on}, source: {fact.source})")
        return "\n".join(lines)

fact_retriever = FactRetriever()

