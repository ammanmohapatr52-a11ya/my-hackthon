import pytest
from starlette.testclient import TestClient
from backend.app.main import app
import pymupdf as fitz

client = TestClient(app)

def test_pdf_scanner_endpoint():
    # Create an in-memory sample academic lecture PDF
    doc = fitz.open()
    p1 = doc.new_page()
    p1.insert_text((50, 72), "LEC-1: Introduction to Mechanics\nWelcome to lecture one.\nVelocity is defined as dx/dt.\nEquation: v = d/t")
    
    p2 = doc.new_page()
    p2.insert_text((50, 72), "LEC-2: Newton's Laws of Motion\nFirst law: Inertia.\nSecond law: F = m*a.\nThird law: Action and reaction.")

    pdf_bytes = doc.tobytes()
    doc.close()

    response = client.post(
        "/api/v1/pdf/scan",
        files={"file": ("physics_lecture.pdf", pdf_bytes, "application/pdf")}
    )

    assert response.status_code == 200
    data = response.json()
    assert data["filename"] == "physics_lecture.pdf"
    assert data["total_pages"] == 2
    assert len(data["pages"]) == 2
    assert len(data["chapters"]) >= 1
    assert "LEC-1" in data["pages"][0]["text"]
    assert "LEC-2" in data["pages"][1]["text"]
