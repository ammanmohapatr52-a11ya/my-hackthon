import json
from typing import AsyncGenerator, Dict, List, Optional
import httpx
from backend.app.core.config import settings
from backend.app.services.llm.base import LLMProvider

class OllamaProvider(LLMProvider):
    def __init__(self, base_url: Optional[str] = None, default_model: Optional[str] = None):
        self.base_url = (base_url or settings.OLLAMA_BASE_URL).rstrip("/")
        self.default_model = default_model or settings.OLLAMA_MODEL

    async def generate(
        self,
        messages: List[Dict[str, str]],
        model: Optional[str] = None,
        temperature: float = 0.2,
        json_format: bool = True
    ) -> str:
        chosen_model = model or self.default_model
        payload = {
            "model": chosen_model,
            "messages": messages,
            "stream": False,
            "options": {
                "temperature": temperature,
                "top_p": 0.9,
                "num_ctx": 4096
            }
        }
        if json_format:
            payload["format"] = "json"

        async with httpx.AsyncClient(timeout=settings.REQUEST_TIMEOUT_SECONDS) as client:
            resp = await client.post(
                f"{self.base_url}/api/chat",
                json=payload
            )
            resp.raise_for_status()
            data = resp.json()
            return data.get("message", {}).get("content", "")

    async def stream(
        self,
        messages: List[Dict[str, str]],
        model: Optional[str] = None,
        temperature: float = 0.2
    ) -> AsyncGenerator[str, None]:
        chosen_model = model or self.default_model
        payload = {
            "model": chosen_model,
            "messages": messages,
            "stream": True,
            "options": {
                "temperature": temperature,
                "top_p": 0.9,
                "num_ctx": 4096
            }
        }

        async with httpx.AsyncClient(timeout=settings.REQUEST_TIMEOUT_SECONDS) as client:
            async with client.stream(
                "POST",
                f"{self.base_url}/api/chat",
                json=payload
            ) as response:
                response.raise_for_status()
                async for line in response.aiter_lines():
                    if not line:
                        continue
                    try:
                        parsed = json.loads(line)
                        content = parsed.get("message", {}).get("content", "")
                        if content:
                            yield content
                    except Exception:
                        continue

    async def check_health(self) -> Dict[str, any]:
        try:
            async with httpx.AsyncClient(timeout=3.0) as client:
                resp = await client.get(f"{self.base_url}/api/tags")
                if resp.status_code == 200:
                    models = [m.get("name") for m in resp.json().get("models", [])]
                    return {
                        "reachable": True,
                        "provider": "ollama",
                        "models": models
                    }
        except Exception as e:
            return {
                "reachable": False,
                "provider": "ollama",
                "error": str(e),
                "hint": "Ensure Ollama is running locally with 'ollama serve'",
                "models": []
            }
        return {"reachable": False, "provider": "ollama", "models": []}
