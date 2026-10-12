import pytest
from datetime import date
from backend.app.schemas.ai import AskRequest
from backend.app.services.ai.ask_service import ask_service
from backend.app.services.ai.facts import fact_retriever
from backend.app.services.ai.cache import ai_cache
from backend.app.services.ai.router import router_service
from backend.app.services.llm.fake_provider import FakeProvider

@pytest.fixture
def fake_provider():
    return FakeProvider()

@pytest.mark.asyncio
async def test_math_routing_exact(fake_provider):
    # Rule 6: Math computation must route to math_engine and not call LLM for answer
    req = AskRequest(question="Solve 2x + 6 = 14", provider="fake")
    resp = await ask_service.answer_question(req)
    assert resp.route == "math_engine"
    assert resp.math_redirect is True
    assert "Math Solver" in resp.explanation.answer

@pytest.mark.asyncio
async def test_clarification_question(fake_provider):
    req = AskRequest(question="Who is the president?", provider="fake")
    resp = await ask_service.answer_question(req)
    assert resp.route == "clarify"
    assert resp.clarifying_question is not None
    assert len(resp.clarifying_question) > 0

@pytest.mark.asyncio
async def test_false_premise_correction(fake_provider):
    req = AskRequest(question="Why is Sydney the capital of Australia?", provider="fake")
    resp = await ask_service.answer_question(req)
    assert resp.route == "gk"
    assert "Canberra" in resp.explanation.answer

@pytest.mark.asyncio
async def test_time_sensitive_caveat_enforcement(fake_provider):
    req = AskRequest(question="What is the current population of India?", provider="fake")
    resp = await ask_service.answer_question(req)
    assert resp.explanation.time_sensitive is True
    assert resp.explanation.caveat != ""

def test_fact_retriever():
    results = fact_retriever.retrieve("What is the capital of Australia?")
    assert len(results) > 0
    assert any("Canberra" in f.answer for f in results)

    # Expiry check
    for fact in results:
        if fact.valid_until:
            assert fact.valid_until >= date.today().isoformat()

def test_cache_keys():
    k1 = ai_cache.compute_key("What is water?", 2, "model1", ["id1"])
    k2 = ai_cache.compute_key("what is water? ", 2, "model1", ["id1"])
    assert k1 == k2

@pytest.mark.asyncio
async def test_speakable_output_cleaning(fake_provider):
    req = AskRequest(question="What is the capital of Australia?", provider="fake")
    resp = await ask_service.answer_question(req)
    assert "#" not in resp.explanation.spoken
    assert "*" not in resp.explanation.spoken
    assert "`" not in resp.explanation.spoken
