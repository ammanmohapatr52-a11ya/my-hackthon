import pytest
from backend.app.services.ai.facts import FactRetriever

def test_archive_gk_facts_loaded():
    retriever = FactRetriever()
    assert len(retriever.facts) >= 930, f"Expected at least 930 facts, got {len(retriever.facts)}"

def test_archive_gk_image_retrieval():
    retriever = FactRetriever()
    # Test query with associated image
    results = retriever.retrieve("Identify the Tree", limit=3)
    assert len(results) > 0
    tree_fact = next((f for f in results if "Tree" in f.answer or "Tree" in f.details), results[0])
    assert tree_fact.image == "/images/0.jpeg"
    assert "Coconut Tree" in tree_fact.answer

def test_archive_gk_text_query():
    retriever = FactRetriever()
    results = retriever.retrieve("How many days do we have in a week", limit=2)
    assert len(results) > 0
    assert "Seven" in results[0].answer
