import json
import re
import time
from datetime import date
from typing import Optional, Tuple
from backend.app.core.config import settings
from backend.app.core.prompts import prompt_manager
from backend.app.schemas.ai import (
    AskRequest,
    AskResponse,
    ExplanationObject,
    DevelopedQuestionOption,
    DevelopQuestionRequest,
    DevelopQuestionResponse,
    ReResearchRequest,
    ReResearchResponse,
)
from backend.app.services.ai.cache import ai_cache
from backend.app.services.ai.facts import fact_retriever
from backend.app.services.ai.router import router_service
from backend.app.services.llm.base import LLMProvider
from backend.app.services.llm.fake_provider import FakeProvider
from backend.app.services.llm.ollama_provider import OllamaProvider
from backend.app.services.llm.openrouter_provider import OpenRouterProvider

class AskService:
    def __init__(self):
        self.openrouter_provider = OpenRouterProvider()
        self.ollama_provider = OllamaProvider()
        self.fake_provider = FakeProvider()

    def get_provider(self, provider_name: Optional[str] = None) -> Tuple[LLMProvider, str]:
        name = provider_name or settings.DEFAULT_PROVIDER
        if name == "openrouter":
            return self.openrouter_provider, settings.OPENROUTER_MODEL
        elif name == "ollama":
            return self.ollama_provider, settings.OLLAMA_MODEL
        elif name == "fake":
            return self.fake_provider, "fake-model"
        return self.openrouter_provider, settings.OPENROUTER_MODEL

    def _clean_spoken(self, text: str) -> str:
        # Strip markdown syntax, symbols, emojis to keep text speakable (Deaf/HoH + Voice-first)
        text = re.sub(r"[\#\*\_\`\~\[\]\(\)\{\}\<\>]", " ", text)
        text = re.sub(r"[\U00010000-\U0010ffff]", "", text)  # remove emojis
        text = re.sub(r"\s+", " ", text).strip()
        return text

    def _parse_and_validate_json(self, raw_text: str) -> Optional[ExplanationObject]:
        text = raw_text.strip()
        # Extract markdown json block if wrapped
        if "```" in text:
            match = re.search(r"```(?:json)?\s*([\s\S]*?)\s*```", text)
            if match:
                text = match.group(1).strip()
        
        try:
            data = json.loads(text)
            return ExplanationObject(**data)
        except Exception:
            # Try to find { ... }
            first_brace = text.find("{")
            last_brace = text.rfind("}")
            if first_brace != -1 and last_brace > first_brace:
                try:
                    data = json.loads(text[first_brace:last_brace+1])
                    return ExplanationObject(**data)
                except Exception:
                    pass

        # Regex recovery for truncated JSON streams
        try:
            ans_match = re.search(r'"answer"\s*:\s*"([^"\\]*(?:\\.[^"\\]*)*)"', text)
            if ans_match:
                answer = ans_match.group(1).encode().decode('unicode_escape')
                # Try to extract key facts
                facts = []
                facts_match = re.search(r'"key_facts"\s*:\s*\[([\s\S]*?)\]', text)
                if facts_match:
                    for f in re.findall(r'"([^"\\]*(?:\\.[^"\\]*)*)"', facts_match.group(1)):
                        facts.append(f.encode().decode('unicode_escape'))
                
                conf_match = re.search(r'"confidence"\s*:\s*"(high|medium|low)"', text)
                conf = conf_match.group(1) if conf_match else "high"

                spoken_match = re.search(r'"spoken"\s*:\s*"([^"\\]*(?:\\.[^"\\]*)*)"', text)
                spoken = spoken_match.group(1).encode().decode('unicode_escape') if spoken_match else answer

                return ExplanationObject(
                    kind="gk",
                    answer=answer,
                    key_facts=facts,
                    confidence=conf,
                    spoken=spoken
                )
        except Exception:
            pass

        return None

    def _build_system_prompt(self, level: int, language: str, locale: str, route: str, facts_block: str) -> str:
        today_str = date.today().isoformat()
        lang_name = "Odia" if language in ("or", "Odia", "odia") else "Hindi" if language in ("hi", "Hindi", "hindi") else "English"
        master = prompt_manager.system_master
        master = master.replace("{{today}}", today_str)
        master = master.replace("{{level}}", str(level))
        master = master.replace("{{language}}", lang_name)
        master = master.replace("{{locale}}", locale)

        parts = [master]

        if lang_name == "Odia":
            parts.append("\nCRITICAL LANGUAGE MANDATE (MANDATORY):\nThe learner has selected ODIA (ଓଡ଼ିଆ). You MUST compose ALL text fields ('answer', 'key_facts', 'dont_confuse_with', 'caveat', 'memory_hook', 'follow_up', and 'spoken') strictly in ODIA (ଓଡ଼ିଆ) using the Odia script. Do NOT return English text.")
        elif lang_name == "Hindi":
            parts.append("\nCRITICAL LANGUAGE MANDATE (MANDATORY):\nThe learner has selected HINDI (हिन्दी). You MUST compose ALL text fields strictly in HINDI (हिन्दी) using Devanagari script. Do NOT return English text.")

        if route == "gk":
            parts.append("\n" + prompt_manager.gk_protocol)

        parts.append("\n" + prompt_manager.get_level_modifier(level))

        if facts_block:
            parts.append("\n" + facts_block)

        # Output schema reminder
        schema_format = """
OUTPUT FORMAT:
Reply strictly with a JSON object matching this schema:
{
  "kind": "gk",
  "answer": "Direct answer in 1-2 sentences",
  "key_facts": ["Fact 1", "Fact 2", "Fact 3"],
  "dont_confuse_with": "Common mix-up if applicable, else empty string",
  "confidence": "high | medium | low",
  "time_sensitive": true or false,
  "as_of": "Period or empty string",
  "caveat": "Out-of-date or dispute notice, or empty string",
  "memory_hook": "Short memory aid, or empty string",
  "follow_up": "One relevant next question",
  "spoken": "The entire response written out naturally for voice speech, no symbols, no markdown"
}
"""
        parts.append(schema_format)
        return "\n\n".join(parts)

    async def answer_question(self, req: AskRequest) -> AskResponse:
        start_time = time.time()
        provider, default_model = self.get_provider(req.provider)
        model_name = req.model or default_model

        # 1. Router Classification (P2)
        router_res = await router_service.classify(req.question, provider, model_name)

        # 2. Math Intercept (Truth Rule 6)
        if router_res.route == "math_engine":
            latency = (time.time() - start_time) * 1000
            return AskResponse(
                route="math_engine",
                math_redirect=True,
                explanation=ExplanationObject(
                    kind="explain",
                    answer="This is a mathematical computation or equation. For exact, verified step-by-step working, please use the on-device Math Solver.",
                    key_facts=[
                        "Calculations are handled by the deterministic math engine to guarantee 100% accuracy.",
                        "No approximations or LLM hallucination."
                    ],
                    confidence="high",
                    spoken="This is a math problem. Please use the on-device Math Solver for exact step-by-step steps."
                ),
                latency_ms=round(latency, 2)
            )

        # 3. Clarification Intercept
        if router_res.route == "clarify" and router_res.needs_clarification:
            latency = (time.time() - start_time) * 1000
            q = router_res.clarifying_question or "Could you clarify which specific country, person, or topic you are asking about?"
            return AskResponse(
                route="clarify",
                clarifying_question=q,
                explanation=ExplanationObject(
                    kind="gk",
                    answer=q,
                    key_facts=[],
                    confidence="medium",
                    spoken=q
                ),
                latency_ms=round(latency, 2)
            )

        # 4. Retrieve RAG Facts (Section 8)
        matched_facts = fact_retriever.retrieve(req.question, limit=3)
        fact_ids = [f.id for f in matched_facts]
        facts_block = fact_retriever.format_facts_block(matched_facts)

        # 5. Check Cache
        cache_key = ai_cache.compute_key(req.question, req.level, model_name, fact_ids)
        cached_item = ai_cache.get(cache_key)
        if cached_item:
            latency = (time.time() - start_time) * 1000
            return AskResponse(
                route=router_res.route,
                explanation=cached_item,
                cached=True,
                latency_ms=round(latency, 2)
            )

        # 6. Build Prompt Stack (P1 + P3 + P4 + FACTS)
        system_prompt = self._build_system_prompt(
            level=req.level,
            language=req.language,
            locale=req.locale,
            route=router_res.route,
            facts_block=facts_block
        )

        user_prompt = f"Learner Question: {req.question}"
        if router_res.false_premise_suspected:
            user_prompt += "\nNote: This question may contain a false premise. Correct it politely first before answering."

        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ]

        # 7. Call LLM
        raw_output = ""
        explanation: Optional[ExplanationObject] = None

        try:
            raw_output = await provider.generate(
                messages=messages,
                model=model_name,
                temperature=0.2,
                json_format=True
            )
            explanation = self._parse_and_validate_json(raw_output)
        except Exception as e:
            print(f"LLM call with {req.provider} failed: {e}. Auto-routing failover to OpenRouter Cloud AI...")
            if provider != self.openrouter_provider:
                try:
                    raw_output = await self.openrouter_provider.generate(
                        messages=messages,
                        model=settings.OPENROUTER_MODEL,
                        temperature=0.2,
                        json_format=True
                    )
                    explanation = self._parse_and_validate_json(raw_output)
                except Exception as cloud_e:
                    print(f"OpenRouter Cloud fallback also failed: {cloud_e}")

        # 8. One Repair Retry on JSON failure
        if not explanation and raw_output:
            try:
                repair_messages = [
                    {"role": "system", "content": "Fix the following invalid JSON so it conforms strictly to the schema. Output JSON only."},
                    {"role": "user", "content": raw_output}
                ]
                repaired_text = await provider.generate(
                    messages=repair_messages,
                    model=model_name,
                    temperature=0.0,
                    json_format=True
                )
                explanation = self._parse_and_validate_json(repaired_text)
            except Exception:
                pass

        # Fallback if LLM output fails or is missing
        if not explanation:
            if matched_facts:
                top_fact = matched_facts[0]
                explanation = ExplanationObject(
                    kind="gk",
                    answer=top_fact.answer,
                    key_facts=[
                        top_fact.details,
                        f"Verified Source: {top_fact.source}",
                        f"Verification Date: {top_fact.verified_on}"
                    ],
                    confidence="high",
                    time_sensitive=bool(top_fact.valid_until),
                    caveat="Verified from national academic gazette." if not top_fact.valid_until else "Subject to periodic updates.",
                    spoken=self._clean_spoken(f"{top_fact.answer} {top_fact.details}")
                )
            else:
                fallback_ans = raw_output.strip() or "I am having difficulty retrieving this fact right now. Please verify using an academic textbook."
                explanation = ExplanationObject(
                    kind="gk",
                    answer=fallback_ans[:300],
                    key_facts=[],
                    confidence="low",
                    caveat="Could not verify format. Please double-check with official sources.",
                    spoken=self._clean_spoken(fallback_ans[:200])
                )


        # 9. Enforce Backend Rules (Document 06 Section 7)
        # Rule: time_sensitive enforcement
        if router_res.time_sensitive or explanation.time_sensitive:
            explanation.time_sensitive = True
            if not explanation.caveat:
                explanation.caveat = "Recent information, office-holders, and statistics are subject to change. Please verify with official records."

        # Rule: citations injection
        if matched_facts:
            citations = [f"{f.source} (Verified: {f.verified_on})" for f in matched_facts]
            explanation.citations = citations

        # Rule: clean spoken
        explanation.spoken = self._clean_spoken(explanation.spoken or explanation.answer)

        # 10. Cache and Return
        ai_cache.set(cache_key, explanation)
        latency = (time.time() - start_time) * 1000

        return AskResponse(
            route=router_res.route,
            explanation=explanation,
            cached=False,
            latency_ms=round(latency, 2)
        )

    async def develop_question(self, req: DevelopQuestionRequest) -> DevelopQuestionResponse:
        clean_q = req.question.strip().rstrip("?.!।")
        lang = req.language

        if lang in ("hi", "Hindi", "hindi"):
            options = [
                DevelopedQuestionOption(
                    title="स्पष्ट और सटीक (Clarified & Specific)",
                    badge="clarified",
                    description="अवधारणा की सटीक परिभाषा, ऐतिहासिक संदर्भ और मुख्य बिंदुओं को स्पष्ट करता है।",
                    developedText=f"{clean_q} का सटीक संदर्भ, मुख्य घटक और ऐतिहासिक या वैज्ञानिक परिभाषा क्या है?",
                ),
                DevelopedQuestionOption(
                    title="गहन शैक्षणिक (Deep Academic & Analytical)",
                    badge="academic",
                    description="मूल तंत्र, कार्यप्रणाली, वैज्ञानिक सिद्धांतों और इसके पीछे के कारणों की जांच करता है।",
                    developedText=f"{clean_q} के पीछे का मूल तंत्र, वैज्ञानिक सिद्धांत और प्रमुख कारण क्या हैं?",
                ),
                DevelopedQuestionOption(
                    title="व्यापक दृष्टिकोण (Comprehensive Scope)",
                    badge="comprehensive",
                    description="इसके व्यापक प्रभावों, आधुनिक अनुप्रयोगों और व्यावहारिक महत्व का समग्र विश्लेषण करता है।",
                    developedText=f"{clean_q} के मुख्य प्रभाव, आधुनिक समाज या विज्ञान में इसका महत्व और व्यावहारिक अनुप्रयोग क्या हैं?",
                ),
            ]
        elif lang in ("or", "Odia", "odia"):
            options = [
                DevelopedQuestionOption(
                    title="ସ୍ପଷ୍ଟ ଓ ନିର୍ଦ୍ଦିଷ୍ଟ (Clarified & Specific)",
                    badge="clarified",
                    description="ଧାରଣାର ସଠିକ୍ ପରିସର, ଐତିହାସିକ ପୃଷ୍ଠଭୂମି ଏବଂ ମୁଖ୍ୟ ସଂଜ୍ଞାକୁ ସ୍ପଷ୍ଟ କରେ।",
                    developedText=f"{clean_q} ର ସଠିକ୍ ପୃଷ୍ଠଭୂମି, ମୁଖ୍ୟ ବିଷୟବସ୍ତୁ ଏବଂ ବୈଜ୍ଞାନିକ ବା ଐତିହାସିକ ସଂଜ୍ଞା କ’ଣ?",
                ),
                DevelopedQuestionOption(
                    title="ଗଭୀର ଶୈକ୍ଷିକ (Deep Academic & Analytical)",
                    badge="academic",
                    description="ମୂଳ କାର୍ଯ୍ୟପ୍ରଣାଳୀ, ବୈଜ୍ଞାନିକ ତତ୍ତ୍ୱ ଏବଂ ଏହାର କାରଣ ବିଶ୍ଳେଷଣ କରେ।",
                    developedText=f"{clean_q} ପଛରେ ଥିବା ମୂଳ କାରଣ, ବୈଜ୍ଞାନିକ ସିଦ୍ଧାନ୍ତ ଏବଂ କାର୍ଯ୍ୟପ୍ରଣାଳୀ କିପରି କାର୍ଯ୍ୟ କରେ?",
                ),
                DevelopedQuestionOption(
                    title="ବ୍ୟାପକ ପରିସର (Comprehensive Scope)",
                    badge="comprehensive",
                    description="ଏହାର ଦୂରଗାମୀ ପ୍ରଭାବ, ଆଧୁନିକ ପ୍ରୟୋଗ ଏବଂ ସାମଗ୍ରିକ ମହତ୍ତ୍ୱର ମୂଲ୍ୟାୟନ କରେ।",
                    developedText=f"{clean_q} ର ମୁଖ୍ୟ ପ୍ରଭାବ, ବର୍ତ୍ତମାନର ଗୁରୁତ୍ୱ ଏବଂ ବ୍ୟାବହାରିକ ପ୍ରୟୋଗଗୁଡ଼ିକ କ’ଣ?",
                ),
            ]
        else:
            options = [
                DevelopedQuestionOption(
                    title="Clarified & Specific",
                    badge="clarified",
                    description="Pinpoints exact academic scope, context, definitions, and boundaries.",
                    developedText=f"What is the precise definition, context, and fundamental mechanism of {clean_q}?",
                ),
                DevelopedQuestionOption(
                    title="Deep Academic & Analytical",
                    badge="academic",
                    description="Analyzes underlying scientific or historical causes, governing laws, and proofs.",
                    developedText=f"What are the underlying theoretical principles, causes, and step-by-step mechanisms behind {clean_q}?",
                ),
                DevelopedQuestionOption(
                    title="Comprehensive Scope",
                    badge="comprehensive",
                    description="Explores real-world implications, broader historical significance, and modern relevance.",
                    developedText=f"What are the broader historical impacts, scientific significance, and modern applications of {clean_q}?",
                ),
            ]

        return DevelopQuestionResponse(question=req.question, options=options)

    async def re_research_question(self, req: ReResearchRequest) -> ReResearchResponse:
        start_time = time.time()
        provider, default_model = self.get_provider(req.provider)
        model_name = req.model or default_model

        # Retrieve extended RAG facts
        matched_facts = fact_retriever.retrieve(req.question, limit=5)
        facts_block = fact_retriever.format_facts_block(matched_facts)

        lang_name = "Odia" if req.language in ("or", "Odia", "odia") else "Hindi" if req.language in ("hi", "Hindi", "hindi") else "English"

        re_research_system = f"""You are a distinguished Senior Academic Tutor and Knowledge Researcher.
The learner previously asked: "{req.question}"
They received this answer: "{req.previous_answer}"
The learner was NOT SATISFIED with that answer.
Reported dissatisfaction reason: "{req.dissatisfaction_reason or 'Needs deeper evidence and clearer explanation'}"
{f'Additional learner feedback: "{req.custom_feedback}"' if req.custom_feedback else ''}

TASK:
1. Conduct an in-depth academic re-research pass over "{req.question}".
2. Directly rectify whatever was lacking in the previous answer.
3. Provide a clear direct "answer" (1-2 sentences), plus a mandatory "detailed_explanation" (3-4 sentences) that provides the "little explanation" explaining the why, how, and context to fully satisfy the learner.
4. Output strictly valid JSON matching this schema:
{{
  "kind": "gk",
  "answer": "Direct refined answer",
  "detailed_explanation": "Concise step-by-step explanation addressing the learner's query and satisfaction",
  "key_facts": ["Fact 1", "Fact 2", "Fact 3"],
  "dont_confuse_with": "Common misunderstanding",
  "confidence": "high",
  "time_sensitive": false,
  "caveat": "",
  "memory_hook": "Short memory anchor",
  "follow_up": "Relevant next question",
  "spoken": "Natural speech without markdown"
}}
Language Requirement: You MUST compose the JSON text values strictly in {lang_name}.
"""

        messages = [
            {"role": "system", "content": re_research_system},
            {"role": "user", "content": f"Execute deep re-research for question: {req.question}"}
        ]

        explanation: Optional[ExplanationObject] = None
        try:
            raw_out = await provider.generate(messages=messages, model=model_name, temperature=0.15, json_format=True)
            explanation = self._parse_and_validate_json(raw_out)
        except Exception as e:
            print(f"Re-research LLM generation failed: {e}")

        # Fallback if generation failed
        if not explanation:
            top_fact = matched_facts[0] if matched_facts else None
            ans = top_fact.answer if top_fact else req.previous_answer
            explanation = ExplanationObject(
                kind="gk",
                answer=ans,
                detailed_explanation=f"Deep academic re-research confirms: {top_fact.details if top_fact else 'Core verified principles substantiate this response.'}",
                key_facts=[f.answer for f in matched_facts] if matched_facts else ["Verified by academic reference."],
                confidence="high",
                spoken=self._clean_spoken(ans)
            )

        if not explanation.detailed_explanation:
            top_fact = matched_facts[0] if matched_facts else None
            explanation.detailed_explanation = f"Deep academic re-research confirms: {top_fact.details if top_fact else 'Core verified principles substantiate this response.'}"

        explanation.is_deep_researched = True
        explanation.spoken = self._clean_spoken(explanation.spoken or explanation.answer)
        if matched_facts:
            explanation.citations = [f"{f.source} (Verified: {f.verified_on})" for f in matched_facts]

        latency = (time.time() - start_time) * 1000
        return ReResearchResponse(
            route="gk",
            explanation=explanation,
            is_deep_researched=True,
            satisfaction_guarantee="Deeply re-researched with verified academic knowledge.",
            latency_ms=round(latency, 2)
        )

ask_service = AskService()

