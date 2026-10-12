from pydantic import BaseModel, Field
from typing import List, Optional, Literal

class ExplanationObject(BaseModel):
    kind: Literal["gk", "explain"] = "gk"
    answer: str = Field(description="Direct answer in 1-2 sentences")
    key_facts: List[str] = Field(default_factory=list, description="2 to 5 short facts")
    dont_confuse_with: Optional[str] = Field(default="", description="Common mix-up or distinction")
    confidence: Literal["high", "medium", "low"] = "high"
    time_sensitive: bool = False
    as_of: Optional[str] = Field(default="", description="Period of the information if applicable")
    caveat: Optional[str] = Field(default="", description="When it may be out of date or disputed")
    memory_hook: Optional[str] = Field(default="", description="Simple memory hook for learners")
    follow_up: Optional[str] = Field(default="", description="One suggested next question")
    spoken: str = Field(description="Natural speech without markdown, symbols or emoji")
    citations: Optional[List[str]] = Field(default_factory=list, description="Verified fact references")
    detailed_explanation: Optional[str] = Field(default="", description="In-depth step-by-step conceptual explanation and proof")
    is_deep_researched: Optional[bool] = Field(default=False, description="Flag indicating deep re-research pass")
    satisfaction_guarantee: Optional[str] = Field(default="", description="Summary note ensuring complete learner satisfaction")

class RouterResult(BaseModel):
    intent: Literal[
        "gk", 
        "academic_concept", 
        "math_computation", 
        "how_to", 
        "opinion_sensitive", 
        "chit_chat", 
        "unclear"
    ] = "gk"
    domain: Literal[
        "history", 
        "geography", 
        "polity_civics", 
        "economy", 
        "science", 
        "technology", 
        "sports", 
        "arts_culture", 
        "current_affairs", 
        "environment", 
        "health", 
        "language", 
        "other"
    ] = "other"
    time_sensitive: bool = False
    false_premise_suspected: bool = False
    needs_clarification: bool = False
    clarifying_question: Optional[str] = ""
    route: Literal["gk", "explain", "math_engine", "refuse", "clarify"] = "gk"

class AskRequest(BaseModel):
    question: str
    level: Literal[1, 2, 3] = 2
    language: str = "en"
    locale: str = "IN"
    provider: Optional[Literal["openrouter", "ollama", "fake"]] = None
    model: Optional[str] = None
    stream: bool = False
    deep_research: bool = False
    dissatisfaction_reason: Optional[str] = None
    previous_answer: Optional[str] = None

class AskResponse(BaseModel):
    route: str
    explanation: Optional[ExplanationObject] = None
    clarifying_question: Optional[str] = None
    math_redirect: bool = False
    refusal_reason: Optional[str] = None
    cached: bool = False
    latency_ms: float = 0.0

class FactItem(BaseModel):
    id: str
    category: str
    question_variants: List[str]
    answer: str
    details: str
    source: str
    verified_on: str
    valid_until: Optional[str] = None
    image: Optional[str] = None

class StatusResponse(BaseModel):
    status: str
    default_provider: str
    openrouter_configured: bool
    ollama_reachable: bool
    installed_models: List[str]
    rag_facts_count: int
    prompt_version: str

class DevelopedQuestionOption(BaseModel):
    title: str
    badge: Literal["clarified", "academic", "comprehensive"]
    description: str
    developedText: str

class DevelopQuestionRequest(BaseModel):
    question: str
    language: str = "en"
    level: Literal[1, 2, 3] = 2

class DevelopQuestionResponse(BaseModel):
    question: str
    options: List[DevelopedQuestionOption]

class ReResearchRequest(BaseModel):
    question: str
    previous_answer: str
    dissatisfaction_reason: Optional[str] = None
    custom_feedback: Optional[str] = None
    level: Literal[1, 2, 3] = 2
    language: str = "en"
    provider: Optional[Literal["openrouter", "ollama", "fake"]] = None
    model: Optional[str] = None

class ReResearchResponse(BaseModel):
    route: str = "gk"
    explanation: ExplanationObject
    is_deep_researched: bool = True
    satisfaction_guarantee: str = ""
    latency_ms: float = 0.0

