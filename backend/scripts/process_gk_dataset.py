import csv
import json
import re
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent
CSV_PATH = BASE_DIR / "backend" / "data" / "general_knowledge_qa.csv"
BACKEND_FACTS_PATH = BASE_DIR / "backend" / "data" / "facts" / "archive_gk_facts.json"
FRONTEND_FACTS_PATH = BASE_DIR / "frontend" / "src" / "ai" / "facts" / "archiveGkFacts.ts"
FRONTEND_DECK_PATH = BASE_DIR / "frontend" / "src" / "storage" / "gkDeck.ts"

def clean_text(text: str) -> str:
    if not text:
        return ""
    text = text.strip()
    # Normalize quotes and non-breaking spaces
    text = text.replace("\u00a0", " ").replace("’", "'").replace("“", '"').replace("”", '"')
    return text

def slugify(text: str) -> str:
    return re.sub(r"[^a-z0-9]+", "_", text.lower()).strip("_")

def extract_variants(q: str) -> list[str]:
    clean_q = clean_text(q)
    variants = [clean_q]
    
    # Lowercase without punctuation
    no_punc = re.sub(r"[?.!,;:]+", "", clean_q).strip()
    if no_punc.lower() != clean_q.lower():
        variants.append(no_punc)
    
    # If multiple choice options embedded in question like "What is X? a) ... b) ...", strip options
    mcq_match = re.search(r"^(.*?)(?:\s+[a-d]\)|\s+a\.\s+)", clean_q, re.IGNORECASE)
    if mcq_match:
        base_q = mcq_match.group(1).strip()
        if len(base_q) > 5 and base_q not in variants:
            variants.append(base_q)
            variants.append(re.sub(r"[?.!,;:]+", "", base_q).strip())

    return list(dict.fromkeys(variants))

def main():
    if not CSV_PATH.exists():
        print(f"Error: CSV not found at {CSV_PATH}")
        return

    facts = []
    flashcards = []

    with open(CSV_PATH, mode="r", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        for idx, row in enumerate(reader, 1):
            raw_q = clean_text(row.get("question", ""))
            raw_ans = clean_text(row.get("answer", ""))
            q_type = clean_text(row.get("question_type", "General Knowledge"))
            img = clean_text(row.get("image", ""))

            if not raw_q or not raw_ans:
                continue

            # Format image path to /images/X.jpeg
            img_path = None
            if img:
                img_clean = img.replace("\\", "/").lstrip("/")
                if img_clean.startswith("images/"):
                    img_path = f"/{img_clean}"
                else:
                    img_path = f"/images/{img_clean}"

            variants = extract_variants(raw_q)
            category_slug = slugify(q_type) or "general_knowledge"

            # Clean multiple-choice prefix in answer (e.g., "B. Library" -> "Library")
            clean_ans = raw_ans
            mcq_ans_match = re.match(r"^[A-D][\.\)]\s*(.*)", raw_ans, re.IGNORECASE)
            if mcq_ans_match:
                clean_ans = mcq_ans_match.group(1).strip()

            fact_item = {
                "id": f"archive-gk-{idx:04d}",
                "category": category_slug,
                "question_variants": variants,
                "answer": clean_ans,
                "details": f"Question: {raw_q} | Topic: {q_type}.",
                "source": f"Academic GK ({q_type})",
                "verified_on": "2026-10-11",
                "valid_until": None,
                "image": img_path
            }
            facts.append(fact_item)

            flashcards.append({
                "front": raw_q,
                "back": clean_ans,
                "category": q_type,
                "image": img_path
            })

    print(f"Processed {len(facts)} GK questions from CSV.")

    # 1. Save Backend Facts JSON
    BACKEND_FACTS_PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(BACKEND_FACTS_PATH, mode="w", encoding="utf-8") as f:
        json.dump(facts, f, indent=2, ensure_ascii=False)
    print(f"Saved backend facts to {BACKEND_FACTS_PATH}")

    # 2. Save Frontend Facts TS
    FRONTEND_FACTS_PATH.parent.mkdir(parents=True, exist_ok=True)
    ts_content = f"""/**
 * Auto-generated archive GK facts pack from general_knowledge_qa.csv
 * Total questions: {len(facts)}
 */
import type {{ VerifiedFact }} from './factPack';

export const ARCHIVE_GK_FACTS: VerifiedFact[] = {json.dumps(facts, indent=2, ensure_ascii=False)};
"""
    with open(FRONTEND_FACTS_PATH, mode="w", encoding="utf-8") as f:
        f.write(ts_content)
    print(f"Saved frontend facts to {FRONTEND_FACTS_PATH}")

    # 3. Save Flashcard deck TS
    FRONTEND_DECK_PATH.parent.mkdir(parents=True, exist_ok=True)
    deck_content = f"""/**
 * Pre-packaged GK Kids & Classes Flashcard Deck ({len(flashcards)} cards)
 */
export interface SeedGKCard {{
  front: string;
  back: string;
  category: string;
  image?: string;
}}

export const ARCHIVE_GK_CARDS: SeedGKCard[] = {json.dumps(flashcards, indent=2, ensure_ascii=False)};
"""
    with open(FRONTEND_DECK_PATH, mode="w", encoding="utf-8") as f:
        f.write(deck_content)
    print(f"Saved flashcard deck to {FRONTEND_DECK_PATH}")

if __name__ == "__main__":
    main()
