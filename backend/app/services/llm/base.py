from abc import ABC, abstractmethod
from typing import AsyncGenerator, Dict, List, Optional

class LLMProvider(ABC):
    @abstractmethod
    async def generate(
        self,
        messages: List[Dict[str, str]],
        model: Optional[str] = None,
        temperature: float = 0.2,
        json_format: bool = True
    ) -> str:
        """Generate a complete text response."""
        pass

    @abstractmethod
    async def stream(
        self,
        messages: List[Dict[str, str]],
        model: Optional[str] = None,
        temperature: float = 0.2
    ) -> AsyncGenerator[str, None]:
        """Stream chunks of response."""
        pass

    @abstractmethod
    async def check_health(self) -> Dict[str, any]:
        """Check availability and return available models."""
        pass
