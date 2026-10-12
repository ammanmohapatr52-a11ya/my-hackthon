from pathlib import Path
from pydantic import BaseModel, Field
from typing import List
import os
from dotenv import load_dotenv

# Load .env if present
load_dotenv()

class Settings(BaseModel):
    PROJECT_NAME: str = "Neurobridge Academic Problem Solver AI Backend"
    API_V1_STR: str = "/api/v1"
    PROMPT_VERSION: str = "0.1"
    
    # Provider Settings
    DEFAULT_PROVIDER: str = os.getenv("DEFAULT_PROVIDER", "openrouter")  # "openrouter" | "ollama" | "fake"
    
    # OpenRouter Config
    OPENROUTER_API_KEY: str = os.getenv("OPENROUTER_API_KEY", "")
    OPENROUTER_BASE_URL: str = os.getenv("OPENROUTER_BASE_URL", "https://openrouter.ai/api/v1")
    OPENROUTER_MODEL: str = os.getenv("OPENROUTER_MODEL", "liquid/lfm-2.5-2.6b:free")
    
    # Local Ollama Config
    OLLAMA_BASE_URL: str = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
    OLLAMA_MODEL: str = os.getenv("OLLAMA_MODEL", "mistral")
    
    # Verification & Pipeline
    VERIFIER_ENABLED: bool = os.getenv("VERIFIER_ENABLED", "false").lower() == "true"
    REQUEST_TIMEOUT_SECONDS: float = float(os.getenv("REQUEST_TIMEOUT_SECONDS", "30.0"))
    
    # Paths
    BASE_DIR: Path = Path(__file__).resolve().parent.parent.parent
    PROMPTS_DIR: Path = BASE_DIR / "app" / "prompts"
    FACTS_DIR: Path = BASE_DIR / "data" / "facts"
    
    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "*"
    ]

settings = Settings()
