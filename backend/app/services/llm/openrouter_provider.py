import json
from typing import AsyncGenerator, Dict, List, Optional
import httpx
from backend.app.core.config import settings
from backend.app.services.llm.base import LLMProvider

class OpenRouterProvider(LLMProvider):
    def __init__(self, api_key: Optional[str] = None, default_model: Optional[str] = None):
        self.api_key = api_key or settings.OPENROUTER_API_KEY
        self.default_model = default_model or settings.OPENROUTER_MODEL
        self.base_url = settings.OPENROUTER_BASE_URL

    def _get_headers(self) -> Dict[str, str]:
        return {
            "Authorization": f"Bearer {self.api_key}",
            "HTTP-Referer": "http://localhost:5173",
            "X-Title": "Neurobridge Accessible Academic Problem Solver",
            "Content-Type": "application/json"
        }

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
            "temperature": temperature,
        }
        if json_format:
            payload["response_format"] = {"type": "json_object"}

        async with httpx.AsyncClient(timeout=settings.REQUEST_TIMEOUT_SECONDS) as client:
            resp = await client.post(
                f"{self.base_url}/chat/completions",
                headers=self._get_headers(),
                json=payload
            )
            resp.raise_for_status()
            data = resp.json()
            choices = data.get("choices", [])
            if not choices:
                raise ValueError("No response choices returned by OpenRouter")
            return choices[0].get("message", {}).get("content", "")

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
            "temperature": temperature,
            "stream": True
        }

        async with httpx.AsyncClient(timeout=settings.REQUEST_TIMEOUT_SECONDS) as client:
            async with client.stream(
                "POST",
                f"{self.base_url}/chat/completions",
                headers=self._get_headers(),
                json=payload
            ) as response:
                response.raise_for_status()
                async for line in response.aiter_lines():
                    if not line:
                        continue
                    if line.startswith("data: "):
                        raw_data = line[6:].strip()
                        if raw_data == "[DONE]":
                            break
                        try:
                            parsed = json.loads(raw_data)
                            delta = parsed.get("choices", [{}])[0].get("delta", {}).get("content", "")
                            if delta:
                                yield delta
                        except Exception:
                            continue

    async def check_health(self) -> Dict[str, any]:
        try:
            async with httpx.AsyncClient(timeout=5.0) as client:
                resp = await client.get(
                    f"{self.base_url}/auth/key",
                    headers=self._get_headers()
                )
                if resp.status_code == 200:
                    key_info = resp.json().get("data", {})
                    return {
                        "reachable": True,
                        "provider": "openrouter",
                        "label": key_info.get("label", "neurobridge-key"),
                        "limit": key_info.get("limit"),
                        "usage": key_info.get("usage"),
                        "models": [self.default_model, "openrouter/auto", "google/gemma-2-9b-it:free"]
                    }
        except Exception as e:
            return {
                "reachable": False,
                "provider": "openrouter",
                "error": str(e),
                "models": []
            }
        return {"reachable": False, "provider": "openrouter", "models": []}
