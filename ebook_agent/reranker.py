from dataclasses import dataclass
from typing import List, Tuple
from .config import config
from .hybrid_indexer import SearchResult, DocumentChunk

try:
    from sentence_transformers import CrossEncoder
except ImportError:
    CrossEncoder = None


@dataclass
class RerankedResult:
    chunk: DocumentChunk
    rerank_score: float
    original_rrf_score: float
    dense_score: float
    sparse_score: float


class ResultReranker:
    """Cross-Encoder Reranker using ms-marco-MiniLM-L-6-v2 for deep semantic alignment."""

    def __init__(self, model_name: str = config.CROSS_ENCODER_MODEL_NAME):
        self.model_name = model_name
        self.model = None

    def _init_model(self):
        if self.model is None:
            if CrossEncoder is None:
                raise ImportError("sentence-transformers is not installed. Please install it.")
            self.model = CrossEncoder(self.model_name)

    def rerank(
        self,
        query: str,
        candidates: List[SearchResult],
        top_k: int = config.TOP_K_RERANKED
    ) -> List[RerankedResult]:
        if not candidates:
            return []

        # If only 1 candidate or CrossEncoder not available, fallback cleanly
        if len(candidates) <= 1:
            c = candidates[0]
            return [
                RerankedResult(
                    chunk=c.chunk,
                    rerank_score=c.score,
                    original_rrf_score=c.score,
                    dense_score=c.dense_score,
                    sparse_score=c.sparse_score
                )
            ]

        try:
            self._init_model()
            pairs = [(query, res.chunk.text) for res in candidates]
            scores = self.model.predict(pairs)

            scored_candidates: List[Tuple[SearchResult, float]] = list(zip(candidates, scores))
            # Sort descending by cross-encoder score
            scored_candidates.sort(key=lambda x: x[1], reverse=True)

            reranked_results: List[RerankedResult] = []
            for item, ce_score in scored_candidates[:top_k]:
                reranked_results.append(
                    RerankedResult(
                        chunk=item.chunk,
                        rerank_score=float(ce_score),
                        original_rrf_score=item.score,
                        dense_score=item.dense_score,
                        sparse_score=item.sparse_score,
                    )
                )

            return reranked_results
        except Exception as e:
            # Fallback to hybrid RRF scores if cross encoder fails
            print(f"Warning: CrossEncoder reranking failed ({e}), using RRF scores.")
            return [
                RerankedResult(
                    chunk=c.chunk,
                    rerank_score=c.score,
                    original_rrf_score=c.score,
                    dense_score=c.dense_score,
                    sparse_score=c.sparse_score
                )
                for c in candidates[:top_k]
            ]
