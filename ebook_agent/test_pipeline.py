import pytest
from ebook_agent.config import config
from ebook_agent.pdf_parser import PDFParser, PageData, ParsedDocument
from ebook_agent.hybrid_indexer import TextChunker, DocumentChunk
from ebook_agent.llm_generator import GeminiLLMGenerator

def test_chapter_detection_fallback():
    parser = PDFParser.__new__(PDFParser)
    # Test chapter mapping with detected lecture tags
    headings = [
        {"title": "LEC-1: Introduction to Algorithms", "page": 1, "source": "regex"},
        {"title": "LEC-2: Asymptotic Analysis", "page": 12, "source": "regex"},
        {"title": "LEC-3: Divide and Conquer", "page": 25, "source": "regex"},
    ]
    chapters = parser._build_chapters(headings, total_pages=35)
    assert len(chapters) == 3
    assert chapters[0].chapter_id == "SEC-1"
    assert chapters[0].start_page == 1
    assert chapters[0].end_page == 11
    assert chapters[1].start_page == 12
    assert chapters[1].end_page == 24
    assert chapters[2].start_page == 25
    assert chapters[2].end_page == 35

def test_text_chunking():
    chunker = TextChunker(chunk_size=50, overlap=10)
    fake_pages = [
        PageData(page_number=1, text="This is word " * 80, char_count=800, word_count=80),
        PageData(page_number=2, text="Second page text " * 30, char_count=450, word_count=60),
    ]
    parsed_doc = ParsedDocument(
        filename="test.pdf",
        total_pages=2,
        total_words=140,
        pages=fake_pages,
        chapters=[],
    )
    chunks = chunker.chunk_document(parsed_doc)
    assert len(chunks) >= 2
    assert chunks[0].page == 1
    assert "chk_p1" in chunks[0].chunk_id

def test_gemini_generator_config():
    gen = GeminiLLMGenerator(api_key="test-key", model_name="gemini-1.5-flash")
    assert gen.api_key == "test-key"
    assert gen.model_name == "gemini-1.5-flash"
