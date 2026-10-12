import os
from dataclasses import dataclass
from typing import Dict

@dataclass
class AppConfig:
    # Embedding & Retrieval Models
    EMBEDDING_MODEL_NAME: str = "sentence-transformers/all-MiniLM-L6-v2"
    CROSS_ENCODER_MODEL_NAME: str = "cross-encoder/ms-marco-MiniLM-L-6-v2"
    
    OPENROUTER_API_KEY: str = os.getenv("OPENROUTER_API_KEY", "")
    
    # Google Gemini Models
    DEFAULT_GEMINI_MODEL: str = "gemini-1.5-flash"
    AVAILABLE_GEMINI_MODELS: tuple = (
        "gemini-1.5-flash",
        "gemini-1.5-pro",
        "gemini-2.0-flash",
    )
    
    # Text Chunking Settings
    CHUNK_SIZE_WORDS: int = 500
    CHUNK_OVERLAP_WORDS: int = 100
    
    # Hybrid Retrieval Parameters
    TOP_K_SPARSE_BM25: int = 15
    TOP_K_DENSE_FAISS: int = 15
    TOP_K_HYBRID_RRF: int = 20
    TOP_K_RERANKED: int = 5
    RRF_K: int = 60  # Reciprocal Rank Fusion constant
    
    # Multilingual Options
    SUPPORTED_LANGUAGES: Dict[str, str] = None

    def __post_init__(self):
        self.SUPPORTED_LANGUAGES = {
            "English": "en",
            "Hindi (हिन्दी)": "hi",
            "Bengali (বাংলা)": "bn",
            "Odia (ଓଡ଼ିଆ)": "or",
            "Marathi (मराठी)": "mr",
            "Telugu (తెలుగు)": "te",
            "Tamil (தமிழ்)": "ta",
            "Gujarati (ગુજરાતી)": "gu",
            "Kannada (ಕನ್ನಡ)": "kn",
            "Malayalam (മലയാളം)": "ml",
            "Punjabi (ਪੰਜਾਬੀ)": "pa",
            "Urdu (اردو)": "ur",
            "Spanish (Español)": "es",
            "French (Français)": "fr",
            "German (Deutsch)": "de",
        }

config = AppConfig()
