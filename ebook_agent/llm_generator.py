import os
from typing import List, Dict, Any, Optional
from .config import config
from .reranker import RerankedResult
from .hybrid_indexer import DocumentChunk

# Support both google.generativeai and modern google.genai
_GEMINI_CLIENT_TYPE = None
try:
    import google.generativeai as genai
    _GEMINI_CLIENT_TYPE = "google.generativeai"
except ImportError:
    try:
        from google import genai
        _GEMINI_CLIENT_TYPE = "google.genai"
    except ImportError:
        _GEMINI_CLIENT_TYPE = None


class GeminiLLMGenerator:
    """Production Gemini Generator with strict grounding, anti-hallucination protocols, and multilingual output."""

    def __init__(self, api_key: Optional[str] = None, model_name: str = config.DEFAULT_GEMINI_MODEL):
        self.api_key = api_key or os.getenv("GEMINI_API_KEY", "")
        self.model_name = model_name
        self._configured = False
        if self.api_key:
            self.configure(self.api_key)

    def configure(self, api_key: str):
        self.api_key = api_key
        if not api_key:
            self._configured = False
            return

        if _GEMINI_CLIENT_TYPE == "google.generativeai":
            genai.configure(api_key=api_key)
            self._configured = True
        elif _GEMINI_CLIENT_TYPE == "google.genai":
            self.client = genai.Client(api_key=api_key)
            self._configured = True
        else:
            self._configured = False

    def is_configured(self) -> bool:
        return self._configured and bool(self.api_key)

    def _call_gemini(self, prompt: str, system_instruction: str = "") -> str:
        if not self.is_configured():
            raise ValueError(
                "Gemini API Key is not configured. Please set the GEMINI_API_KEY environment variable or enter it in the sidebar."
            )

        if _GEMINI_CLIENT_TYPE == "google.generativeai":
            model = genai.GenerativeModel(
                model_name=self.model_name,
                system_instruction=system_instruction if system_instruction else None,
                generation_config={"temperature": 0.2, "top_p": 0.95}
            )
            response = model.generate_content(prompt)
            return response.text.strip()
        elif _GEMINI_CLIENT_TYPE == "google.genai":
            config_kwargs = {"temperature": 0.2, "top_p": 0.95}
            if system_instruction:
                config_kwargs["system_instruction"] = system_instruction
            response = self.client.models.generate_content(
                model=self.model_name,
                contents=prompt,
                config=config_kwargs
            )
            return response.text.strip()
        else:
            raise ImportError(
                "Neither `google-generativeai` nor `google-genai` is installed. Please run `pip install google-generativeai`."
            )

    def generate_grounded_answer(
        self,
        query: str,
        reranked_results: List[RerankedResult],
        target_language: str = "English",
    ) -> Dict[str, Any]:
        """Generates grounded answer with exact page citations and zero hallucination."""
        if not reranked_results:
            return {
                "answer": "No relevant text passages could be found in the uploaded document to answer this query.",
                "citations": [],
                "source_passages": [],
                "language": target_language
            }

        # Build context blocks with metadata
        context_blocks = []
        citations_meta = []
        for i, res in enumerate(reranked_results, 1):
            ch = res.chunk
            citation_tag = f"[Source {i}: Page {ch.page}, Chapter: {ch.chapter}]"
            context_blocks.append(f"{citation_tag}\n{ch.text}\n")
            citations_meta.append({
                "source_index": i,
                "page": ch.page,
                "chapter": ch.chapter,
                "chunk_id": ch.chunk_id,
                "rerank_score": round(res.rerank_score, 4),
                "text": ch.text
            })

        context_str = "\n".join(context_blocks)

        system_prompt = f"""You are the "E-Book Intelligence Agent", a truthful, precise academic briefing, reasoning, and problem-solving assistant.
Strict Anti-Hallucination & Problem Solving Mandates:
1. Grounding: Anchor all answers, theorems, definitions, and claims in the provided Source Passages.
2. Problem Solving & Deductions: When asked to solve an exercise, numerical question, or mathematical proof, use the relevant definitions and formulas from the book to present clear, rigorous step-by-step derivations ($LaTeX$).
3. Citations: Every key claim or formula MUST be followed by its exact citation tag, e.g. [Page X, Chapter Y].
4. Language Requirement: Respond completely in {target_language}. Maintain formulas and technical notations cleanly.
5. Tone: Academic, rigorous, direct, step-by-step, and structured.
"""

        user_prompt = f"""CONTEXT PASSAGES FROM UPLOADED E-BOOK:
----------------------------------------
{context_str}
----------------------------------------

USER QUESTION / EXERCISE:
"{query}"

Please provide a comprehensive, strictly-grounded solution or answer in {target_language} citing exact pages and chapters. If the concepts are completely absent from the text, state that clearly:
"""

        generated_text = self._call_gemini(prompt=user_prompt, system_instruction=system_prompt)

        return {
            "answer": generated_text,
            "citations": citations_meta,
            "source_passages": citations_meta,
            "language": target_language
        }

    def solve_book_exercise(
        self,
        exercise_query: str,
        reranked_results: List[RerankedResult],
        target_language: str = "English",
    ) -> Dict[str, Any]:
        """Solves textbook questions, mathematical proofs, and numerical exercises with exact formulas and page citations."""
        if not reranked_results:
            return {
                "solution": "No relevant textbook passages or formulas found to solve this exercise.",
                "steps": [],
                "citations": [],
                "language": target_language
            }

        context_blocks = []
        citations_meta = []
        for i, res in enumerate(reranked_results, 1):
            ch = res.chunk
            context_blocks.append(f"[Source {i}: Page {ch.page}, Chapter: {ch.chapter}]\n{ch.text}\n")
            citations_meta.append({
                "page": ch.page,
                "chapter": ch.chapter,
                "chunk_id": ch.chunk_id,
                "score": round(res.rerank_score, 4)
            })

        context_str = "\n".join(context_blocks)

        system_prompt = f"""You are the Master Academic Exercise and Problem-Solving Tutor.
Strict Pedagogical Directives:
1. Provide a step-by-step mathematical or scientific derivation formatted in clean LaTeX ($...$ and $$...$$).
2. Explicitly cite the textbook page or theorem used for each calculation step.
3. Include an algebraic verification or dimensional back-check at the conclusion.
4. Compose all explanatory text in {target_language}. Keep standard mathematical notation international and clean.
"""

        user_prompt = f"""TEXTBOOK PASSAGES & FORMULAS:
----------------------------------------
{context_str}
----------------------------------------

PROBLEM / EXERCISE:
"{exercise_query}"

Generate complete step-by-step solution with citations in {target_language}:
"""

        generated = self._call_gemini(prompt=user_prompt, system_instruction=system_prompt)
        return {
            "solution": generated,
            "citations": citations_meta,
            "language": target_language
        }

    def generate_chapter_briefing(
        self,
        chapter_title: str,
        start_page: int,
        end_page: int,
        chapter_chunks: List[DocumentChunk],
        target_language: str = "English",
    ) -> Dict[str, Any]:
        """Generates an executive briefing for an entire chapter or lecture."""
        if not chapter_chunks:
            return {
                "briefing": f"No text content found for chapter: {chapter_title}",
                "chapter": chapter_title,
                "page_range": f"{start_page}–{end_page}",
            }

        # Select representative chunks across the chapter (up to 12 chunks)
        step = max(1, len(chapter_chunks) // 12)
        sampled_chunks = chapter_chunks[::step][:12]

        excerpts = []
        for chk in sampled_chunks:
            excerpts.append(f"[Page {chk.page}]\n{chk.text[:1200]}")

        combined_text = "\n\n---\n\n".join(excerpts)

        system_prompt = f"""You are an expert Academic Synthesizer and Research Analyst.
Your task is to produce a comprehensive, structured briefing of the specified chapter/lecture from an academic e-book.

The briefing MUST contain the following 4 structured sections:
1. **Overview**: Executive summary outlining the purpose, context, and scope.
2. **Key Concepts**: Core definitions, foundational principles, and formulas/theorems.
3. **Important Points**: Detailed technical breakdown, key facts, and nuances with page citations.
4. **Key Takeaway**: High-impact recap, summary checklist, and main conclusion.

Language Mandate: You MUST compose the complete briefing in {target_language}.
Truthfulness: Synthesize strictly from the provided text excerpts.
"""

        user_prompt = f"""CHAPTER TITLE: {chapter_title}
PAGE RANGE: Pages {start_page} to {end_page}

CHAPTER EXCERPTS:
----------------------------------------
{combined_text}
----------------------------------------

Generate the 4-part structured briefing in {target_language}:
"""

        briefing_text = self._call_gemini(prompt=user_prompt, system_instruction=system_prompt)

        return {
            "briefing": briefing_text,
            "chapter": chapter_title,
            "page_range": f"{start_page}–{end_page}",
            "chunks_analyzed": len(sampled_chunks),
            "language": target_language,
        }

    def generate_whole_book_briefing(
        self,
        book_title: str,
        total_pages: int,
        chapters: list,
        all_chunks: List[DocumentChunk],
        target_language: str = "English",
        batch_slice_title: str = "Whole Book",
    ) -> Dict[str, Any]:
        """Generates a high-level briefing synthesizing multiple chapters across the book."""
        step = max(1, len(all_chunks) // 16)
        sampled_chunks = all_chunks[::step][:16]

        excerpts = [f"[Page {c.page}, {c.chapter}]\n{c.text[:800]}" for c in sampled_chunks]
        combined = "\n\n---\n\n".join(excerpts)

        system_prompt = f"""You are a Master Academic Synthesizer.
Produce an overarching briefing for the uploaded book: "{book_title}" ({batch_slice_title}).
Required Sections:
1. **Overview**: Broad thematic scope, author's intent, and structural flow.
2. **Key Concepts**: Crucial academic foundations spanning these chapters.
3. **Important Points**: Major arguments, methodology, and central findings.
4. **Key Takeaway**: Core insights for study, research, and review.

Language: Write in {target_language}.
"""

        user_prompt = f"""BOOK / SECTION: {book_title} ({batch_slice_title})
PAGES: 1 to {total_pages}

REPRESENTATIVE EXCERPTS:
----------------------------------------
{combined}
----------------------------------------

Generate the comprehensive briefing in {target_language}:
"""
        briefing_text = self._call_gemini(prompt=user_prompt, system_instruction=system_prompt)
        return {
            "briefing": briefing_text,
            "scope": batch_slice_title,
            "language": target_language,
        }
