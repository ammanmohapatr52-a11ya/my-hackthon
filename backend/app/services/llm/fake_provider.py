import json
from typing import AsyncGenerator, Dict, List, Optional
from backend.app.services.llm.base import LLMProvider

class FakeProvider(LLMProvider):
    def __init__(self, responses: Optional[Dict[str, str]] = None):
        self.responses = responses or {}

    async def generate(
        self,
        messages: List[Dict[str, str]],
        model: Optional[str] = None,
        temperature: float = 0.2,
        json_format: bool = True
    ) -> str:
        prompt_content = messages[-1].get("content", "")
        
        # Check custom mappings
        for key, resp in self.responses.items():
            if key.lower() in prompt_content.lower():
                return resp

        # Default fallback responses for router & gk
        if "Classify the learner's message" in messages[0].get("content", ""):
            if any(term in prompt_content for term in ["2x + 6 = 14", "solve", "equation", "derivative"]):
                return json.dumps({
                    "intent": "math_computation",
                    "domain": "science",
                    "time_sensitive": False,
                    "false_premise_suspected": False,
                    "needs_clarification": False,
                    "clarifying_question": "",
                    "route": "math_engine"
                })
            elif "who is the president" in prompt_content.lower():
                return json.dumps({
                    "intent": "unclear",
                    "domain": "polity_civics",
                    "time_sensitive": True,
                    "false_premise_suspected": False,
                    "needs_clarification": True,
                    "clarifying_question": "Which country or organization's president are you asking about?",
                    "route": "clarify"
                })
            elif "sydney the capital" in prompt_content.lower():
                return json.dumps({
                    "intent": "gk",
                    "domain": "geography",
                    "time_sensitive": False,
                    "false_premise_suspected": True,
                    "needs_clarification": False,
                    "clarifying_question": "",
                    "route": "gk"
                })
            else:
                return json.dumps({
                    "intent": "gk",
                    "domain": "geography",
                    "time_sensitive": "population" in prompt_content.lower(),
                    "false_premise_suspected": False,
                    "needs_clarification": False,
                    "clarifying_question": "",
                    "route": "gk"
                })

        # Answer generation fallback
        if "sydney" in prompt_content.lower() and "capital" in prompt_content.lower():
            return json.dumps({
                "kind": "gk",
                "answer": "Sydney is not the capital of Australia; Canberra is the capital city.",
                "key_facts": [
                    "Canberra was selected as a purpose-built capital in 1908.",
                    "It sits between Sydney and Melbourne in the Australian Capital Territory."
                ],
                "dont_confuse_with": "Sydney is Australia's largest city, but not its capital.",
                "confidence": "high",
                "time_sensitive": False,
                "as_of": "",
                "caveat": "",
                "memory_hook": "Canberra was planned as the compromise capital between Sydney and Melbourne.",
                "follow_up": "Would you like to know how Canberra was chosen?",
                "spoken": "Sydney is not the capital of Australia. Canberra is the capital city. Sydney is the largest city, but not the capital."
            })
        elif "australia" in prompt_content.lower():
            return json.dumps({
                "kind": "gk",
                "answer": "The capital of Australia is Canberra.",
                "key_facts": [
                    "Canberra is located in the Australian Capital Territory.",
                    "It was chosen as the capital in 1908 as a compromise between Sydney and Melbourne."
                ],
                "dont_confuse_with": "Sydney is the largest city, but not the capital.",
                "confidence": "high",
                "time_sensitive": False,
                "as_of": "",
                "caveat": "",
                "memory_hook": "Canberra sits right between Sydney and Melbourne.",
                "follow_up": "Would you like to know more about Australian geography?",
                "spoken": "The capital of Australia is Canberra. Sydney is the biggest city, but Canberra is the capital."
            })
        elif "population" in prompt_content.lower() and "india" in prompt_content.lower():
            return json.dumps({
                "kind": "gk",
                "answer": "India has approximately 1.4 billion people and is the most populous country in the world.",
                "key_facts": [
                    "UN estimates indicate India surpassed China around 2023.",
                    "India's last complete official census was conducted in 2011."
                ],
                "dont_confuse_with": "",
                "confidence": "medium",
                "time_sensitive": True,
                "as_of": "UN estimates from around 2023 to 2024",
                "caveat": "Population figures change every year and vary by source, so check official census data.",
                "memory_hook": "",
                "follow_up": "Would you like to compare India's population with other nations?",
                "spoken": "India has about 1.4 billion people and is the most populous country in the world according to UN estimates."
            })
        elif "constitution" in prompt_content.lower():
            return json.dumps({
                "kind": "gk",
                "answer": "The Constitution of India came into force on January 26, 1950, which is celebrated as Republic Day.",
                "detailed_explanation": "January 26 was chosen to honor the 1930 Purna Swaraj declaration of Indian Independence.",
                "key_facts": [
                    "Adopted by the Constituent Assembly on November 26, 1949.",
                    "Came into effect on January 26, 1950.",
                    "Dr. B. R. Ambedkar served as the Drafting Committee Chairman."
                ],
                "dont_confuse_with": "November 26, 1949 was the adoption date; January 26, 1950 was the enforcement date.",
                "confidence": "high",
                "time_sensitive": False,
                "as_of": "",
                "caveat": "",
                "memory_hook": "Adopted in November 1949, Enforced in January 1950.",
                "follow_up": "Would you like to know more about the Drafting Committee?",
                "spoken": "The Constitution of India came into force on January 26, 1950."
            })

        return json.dumps({
            "kind": "gk",
            "answer": "This is a verified academic explanation.",
            "key_facts": ["Fact 1", "Fact 2"],
            "dont_confuse_with": "",
            "confidence": "high",
            "time_sensitive": False,
            "as_of": "",
            "caveat": "",
            "memory_hook": "",
            "follow_up": "Would you like to learn more?",
            "spoken": "This is a verified academic explanation."
        })

    async def stream(
        self,
        messages: List[Dict[str, str]],
        model: Optional[str] = None,
        temperature: float = 0.2
    ) -> AsyncGenerator[str, None]:
        full_text = await self.generate(messages, model, temperature, json_format=True)
        # Yield in chunks
        chunk_size = 30
        for i in range(0, len(full_text), chunk_size):
            yield full_text[i:i+chunk_size]

    async def check_health(self) -> Dict[str, any]:
        return {
            "reachable": True,
            "provider": "fake",
            "models": ["fake-model-1", "fake-model-2"]
        }
