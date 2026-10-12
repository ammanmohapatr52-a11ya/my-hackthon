from starlette.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_develop_question_english():
    resp = client.post(
        "/api/v1/develop-question",
        json={"question": "photosynthesis formula", "language": "en", "level": 2}
    )
    assert resp.status_code == 200
    data = resp.json()
    assert len(data["options"]) == 3
    badges = [opt["badge"] for opt in data["options"]]
    assert "clarified" in badges
    assert "academic" in badges
    assert "comprehensive" in badges

def test_develop_question_hindi():
    resp = client.post(
        "/api/v1/develop-question",
        json={"question": "प्रकाश संश्लेषण", "language": "hi", "level": 2}
    )
    assert resp.status_code == 200
    data = resp.json()
    assert len(data["options"]) == 3
    assert "सटीक" in data["options"][0]["title"]

def test_develop_question_odia():
    resp = client.post(
        "/api/v1/develop-question",
        json={"question": "ଆଲୋକ ଶ୍ଳେଷଣ", "language": "or", "level": 2}
    )
    assert resp.status_code == 200
    data = resp.json()
    assert len(data["options"]) == 3
    assert "ସ୍ପଷ୍ଟ" in data["options"][0]["title"]

def test_re_research_endpoint():
    resp = client.post(
        "/api/v1/re-research",
        json={
            "question": "When did the Indian Constitution come into force?",
            "previous_answer": "January 26, 1950.",
            "dissatisfaction_reason": "Need deeper evidence & facts",
            "custom_feedback": "Please explain why January 26 was chosen and give concise explanation",
            "provider": "fake",
            "language": "en"
        }
    )
    assert resp.status_code == 200
    data = resp.json()
    assert data["is_deep_researched"] is True
    exp = data["explanation"]
    assert exp["detailed_explanation"] is not None
    assert len(exp["detailed_explanation"]) > 0
    assert "1950" in exp["answer"] or "Constitution" in exp["answer"]
    assert len(data["satisfaction_guarantee"]) > 0
