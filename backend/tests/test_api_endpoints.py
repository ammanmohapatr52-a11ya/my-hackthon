from starlette.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_health_endpoint():
    resp = client.get("/api/v1/health")
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] == "healthy"
    assert "prompt_version" in data

def test_ai_status_endpoint():
    resp = client.get("/api/v1/ai/status")
    assert resp.status_code == 200
    data = resp.json()
    assert "openrouter_configured" in data
    assert "ollama_reachable" in data
    assert data["rag_facts_count"] >= 10

def test_facts_endpoint():
    resp = client.get("/api/v1/facts")
    assert resp.status_code == 200
    data = resp.json()
    assert data["count"] >= 10
    assert len(data["facts"]) >= 10

def test_ask_endpoint_fake():
    resp = client.post(
        "/api/v1/ask",
        json={"question": "What is the capital of Australia?", "provider": "fake"}
    )
    assert resp.status_code == 200
    data = resp.json()
    assert data["route"] == "gk"
    assert "Canberra" in data["explanation"]["answer"]

def test_ask_math_routing_endpoint():
    resp = client.post(
        "/api/v1/ask",
        json={"question": "Solve 2x + 6 = 14", "provider": "fake"}
    )
    assert resp.status_code == 200
    data = resp.json()
    assert data["route"] == "math_engine"
    assert data["math_redirect"] is True
