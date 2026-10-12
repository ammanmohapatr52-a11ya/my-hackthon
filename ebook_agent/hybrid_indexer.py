import re
from dataclasses import dataclass
from typing import List, Dict, Any, Tuple
try:
    import numpy as np
except ImportError:
    np = None

try:
    import faiss
except ImportError:
    faiss = None

try:
    from sentence_transformers import SentenceTransformer
except ImportError:
    SentenceTransformer = None

try:
    from rank_bm25 import BM25Okapi
except ImportError:
    BM25Okapi = None

from .config import config
from .pdf_parser import ParsedDocument


@dataclass
class DocumentChunk:
    chunk_id: str
    page: int
    chapter: str
    text: str
    word_count: int


@dataclass
class SearchResult:
    chunk: DocumentChunk
    score: float
    dense_rank: int = -1
    sparse_rank: int = -1
    dense_score: float = 0.0
    sparse_score: float = 0.0


class TextChunker:
    """Sliding-window word-level chunker preserving sentence boundaries and metadata."""

    def __init__(self, chunk_size: int = config.CHUNK_SIZE_WORDS, overlap: int = config.CHUNK_OVERLAP_WORDS):
        self.chunk_size = chunk_size
        self.overlap = overlap

    def chunk_document(self, parsed_doc: ParsedDocument) -> List[DocumentChunk]:
        chunks: List[DocumentChunk] = []
        chunk_idx = 1

        for page in parsed_doc.pages:
            text = page.text.strip()
            if not text:
                continue

            chapter_title = parsed_doc.get_chapter_for_page(page.page_number)
            words = text.split()

            if len(words) <= self.chunk_size:
                chunks.append(
                    DocumentChunk(
                        chunk_id=f"chk_p{page.page_number}_{chunk_idx}",
                        page=page.page_number,
                        chapter=chapter_title,
                        text=text,
                        word_count=len(words),
                    )
                )
                chunk_idx += 1
            else:
                step = self.chunk_size - self.overlap
                if step <= 0:
                    step = self.chunk_size // 2

                for start in range(0, len(words), step):
                    chunk_words = words[start : start + self.chunk_size]
                    if len(chunk_words) < 20 and start > 0:
                        continue  # skip tiny trailing snippets
                    
                    chunk_text = " ".join(chunk_words)
                    chunks.append(
                        DocumentChunk(
                            chunk_id=f"chk_p{page.page_number}_{chunk_idx}",
                            page=page.page_number,
                            chapter=chapter_title,
                            text=chunk_text,
                            word_count=len(chunk_words),
                        )
                    )
                    chunk_idx += 1

        return chunks


class HybridSearchIndex:
    """Production Hybrid Retrieval combining FAISS Dense Vector Search and BM25 Sparse Search via RRF."""

    def __init__(
        self,
        embedding_model_name: str = config.EMBEDDING_MODEL_NAME,
        rrf_k: int = config.RRF_K
    ):
        self.embedding_model_name = embedding_model_name
        self.rrf_k = rrf_k
        self.chunks: List[DocumentChunk] = []

        # Vector Engine
        self.encoder = None
        self.faiss_index = None
        self.dimension = 384

        # Keyword Engine
        self.bm25 = None
        self.tokenized_corpus: List[List[str]] = []

    def _init_encoder(self):
        if self.encoder is None:
            if SentenceTransformer is None:
                raise ImportError("sentence-transformers is not installed. Please install it.")
            self.encoder = SentenceTransformer(self.embedding_model_name)

    @staticmethod
    def _tokenize(text: str) -> List[str]:
        # Fast alphanumeric lowercased tokens
        return re.findall(r"\b\w+\b", text.lower())

    def build_index(self, chunks: List[DocumentChunk]):
        if not chunks:
            raise ValueError("Cannot build index with empty chunk list.")

        self.chunks = chunks
        self._init_encoder()

        # 1. Build Dense Index with FAISS
        texts = [chunk.text for chunk in chunks]
        embeddings = self.encoder.encode(texts, batch_size=32, show_progress_bar=False, normalize_embeddings=True)
        embeddings = np.array(embeddings, dtype=np.float32)

        self.dimension = embeddings.shape[1]
        if faiss is None:
            raise ImportError("faiss-cpu is not installed. Please install it.")

        # Inner Product with normalized vectors gives Cosine Similarity
        self.faiss_index = faiss.IndexFlatIP(self.dimension)
        self.faiss_index.add(embeddings)

        # 2. Build Sparse Index with BM25
        if BM25Okapi is None:
            raise ImportError("rank-bm25 is not installed. Please install it.")

        self.tokenized_corpus = [self._tokenize(t) for t in texts]
        self.bm25 = BM25Okapi(self.tokenized_corpus)

    def search_hybrid(
        self,
        query: str,
        top_k_bm25: int = config.TOP_K_SPARSE_BM25,
        top_k_dense: int = config.TOP_K_DENSE_FAISS,
        top_k_hybrid: int = config.TOP_K_HYBRID_RRF,
    ) -> List[SearchResult]:
        if not self.chunks or self.faiss_index is None or self.bm25 is None:
            return []

        # 1. Sparse Search (BM25)
        query_tokens = self._tokenize(query)
        sparse_scores = self.bm25.get_scores(query_tokens)
        sparse_ranked_indices = np.argsort(sparse_scores)[::-1][:top_k_bm25]

        # 2. Dense Search (FAISS)
        self._init_encoder()
        query_vector = self.encoder.encode([query], normalize_embeddings=True)
        query_vector = np.array(query_vector, dtype=np.float32)
        dense_distances, dense_indices = self.faiss_index.search(query_vector, top_k_dense)
        dense_ranked_indices = dense_indices[0]
        dense_ranked_scores = dense_distances[0]

        # 3. Reciprocal Rank Fusion (RRF)
        # RRF Score = 1 / (k + rank_dense) + 1 / (k + rank_sparse)
        rrf_scores: Dict[int, float] = {}
        dense_ranks_map: Dict[int, int] = {}
        sparse_ranks_map: Dict[int, int] = {}
        dense_score_map: Dict[int, float] = {}
        sparse_score_map: Dict[int, float] = {}

        for rank, idx in enumerate(dense_ranked_indices):
            if idx == -1:
                continue
            idx = int(idx)
            dense_ranks_map[idx] = rank + 1
            dense_score_map[idx] = float(dense_ranked_scores[rank])
            rrf_scores[idx] = rrf_scores.get(idx, 0.0) + (1.0 / (self.rrf_k + rank + 1))

        for rank, idx in enumerate(sparse_ranked_indices):
            idx = int(idx)
            sparse_ranks_map[idx] = rank + 1
            sparse_score_map[idx] = float(sparse_scores[idx])
            rrf_scores[idx] = rrf_scores.get(idx, 0.0) + (1.0 / (self.rrf_k + rank + 1))

        # Sort candidate indices by combined RRF score
        sorted_candidates = sorted(rrf_scores.items(), key=lambda x: x[1], reverse=True)[:top_k_hybrid]

        results: List[SearchResult] = []
        for idx, fused_score in sorted_candidates:
            chunk = self.chunks[idx]
            results.append(
                SearchResult(
                    chunk=chunk,
                    score=fused_score,
                    dense_rank=dense_ranks_map.get(idx, -1),
                    sparse_rank=sparse_ranks_map.get(idx, -1),
                    dense_score=dense_score_map.get(idx, 0.0),
                    sparse_score=sparse_score_map.get(idx, 0.0),
                )
            )

        return results
