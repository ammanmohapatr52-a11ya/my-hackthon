import io
import re
from dataclasses import dataclass, field
from typing import List, Dict, Optional, Any

try:
    import fitz  # PyMuPDF
except ImportError:
    fitz = None


@dataclass
class PageData:
    page_number: int  # 1-indexed
    text: str
    char_count: int
    word_count: int
    detected_headings: List[str] = field(default_factory=list)


@dataclass
class ChapterMetadata:
    chapter_id: str
    title: str
    start_page: int
    end_page: int
    page_count: int


@dataclass
class ParsedDocument:
    filename: str
    total_pages: int
    total_words: int
    pages: List[PageData]
    chapters: List[ChapterMetadata]
    metadata: Dict[str, Any] = field(default_factory=dict)

    def get_chapter_for_page(self, page_no: int) -> str:
        for ch in self.chapters:
            if ch.start_page <= page_no <= ch.end_page:
                return ch.title
        return "General"


class PDFParser:
    """Production PDF Parser with chapter & lecture boundary extraction via PyMuPDF."""

    # Heading patterns commonly found in academic textbooks & lecture notes
    HEADING_PATTERNS = [
        re.compile(r"^(?:LEC(?:TURE)?|SESSION|MODULE|UNIT)\s*[-:#]?\s*(\d+[A-Za-z]?)(?:\s*[-:–]\s*(.+))?", re.IGNORECASE),
        re.compile(r"^(?:CHAPTER|CHAP\.)\s*([0-9IVXLCDM]+|[A-Za-z0-9]+)(?:\s*[-:–]\s*(.+))?", re.IGNORECASE),
        re.compile(r"^(?:SECTION|PART)\s*([0-9IVXLCDM]+|\d+(?:\.\d+)*)(?:\s*[-:–]\s*(.+))?", re.IGNORECASE),
    ]

    def __init__(self):
        if fitz is None:
            raise ImportError(
                "PyMuPDF is not installed. Please install it using `pip install pymupdf`."
            )

    def parse(self, pdf_stream: bytes, filename: str = "document.pdf") -> ParsedDocument:
        doc = fitz.open(stream=pdf_stream, filetype="pdf")
        total_pages = len(doc)
        pages_data: List[PageData] = []
        raw_headings: List[Dict[str, Any]] = []

        total_words = 0

        # Step 1: Extract text and check TOC
        toc = doc.get_toc()  # [[lvl, title, page], ...]
        if toc:
            for item in toc:
                lvl, title, pno = item[0], item[1].strip(), item[2]
                if lvl <= 2 and pno > 0:
                    raw_headings.append({
                        "title": title,
                        "page": pno,
                        "source": "toc"
                    })

        # Step 2: Page by page extraction and regex heading scanning
        for i, page in enumerate(doc):
            pno = i + 1
            text = page.get_text("text") or ""
            # Clean common artifacts
            cleaned_text = re.sub(r"\r\n|\r", "\n", text)
            words = cleaned_text.split()
            word_count = len(words)
            total_words += word_count

            detected_on_page = []
            lines = [line.strip() for line in cleaned_text.split("\n") if line.strip()]

            # Inspect first 10 lines of each page for lecture or chapter headers
            for line in lines[:10]:
                for pat in self.HEADING_PATTERNS:
                    m = pat.match(line)
                    if m:
                        matched_title = line[:100]
                        detected_on_page.append(matched_title)
                        # Add to raw headings if not already present near this page
                        if not any(h["page"] == pno and h["title"] == matched_title for h in raw_headings):
                            raw_headings.append({
                                "title": matched_title,
                                "page": pno,
                                "source": "regex"
                            })
                        break

            pages_data.append(
                PageData(
                    page_number=pno,
                    text=cleaned_text,
                    char_count=len(cleaned_text),
                    word_count=word_count,
                    detected_headings=detected_on_page,
                )
            )

        # Step 3: Structure and calculate chapter ranges
        chapters = self._build_chapters(raw_headings, total_pages)

        # Extract document metadata
        doc_metadata = doc.metadata or {}

        return ParsedDocument(
            filename=filename,
            total_pages=total_pages,
            total_words=total_words,
            pages=pages_data,
            chapters=chapters,
            metadata=doc_metadata,
        )

    def _build_chapters(self, raw_headings: List[Dict[str, Any]], total_pages: int) -> List[ChapterMetadata]:
        if not raw_headings:
            # Fallback: Create unified chapter or logical 15-page partitions if book is large
            if total_pages <= 20:
                return [
                    ChapterMetadata(
                        chapter_id="CH-1",
                        title="Full Document",
                        start_page=1,
                        end_page=total_pages,
                        page_count=total_pages,
                    )
                ]
            else:
                chapters = []
                step = 15
                ch_idx = 1
                for start in range(1, total_pages + 1, step):
                    end = min(start + step - 1, total_pages)
                    chapters.append(
                        ChapterMetadata(
                            chapter_id=f"PART-{ch_idx}",
                            title=f"Part {ch_idx} (Pages {start}–{end})",
                            start_page=start,
                            end_page=end,
                            page_count=end - start + 1,
                        )
                    )
                    ch_idx += 1
                return chapters

        # Sort headings by start page
        sorted_headings = sorted(raw_headings, key=lambda x: x["page"])

        # Deduplicate headings pointing to the same page
        unique_headings: List[Dict[str, Any]] = []
        seen_pages = set()
        for h in sorted_headings:
            p = h["page"]
            if p not in seen_pages and p <= total_pages:
                seen_pages.add(p)
                unique_headings.append(h)

        if not unique_headings:
            return [
                ChapterMetadata(
                    chapter_id="CH-1",
                    title="Full Document",
                    start_page=1,
                    end_page=total_pages,
                    page_count=total_pages,
                )
            ]

        # Ensure first heading covers from page 1 if needed
        if unique_headings[0]["page"] > 1:
            unique_headings.insert(0, {
                "title": "Front Matter / Introduction",
                "page": 1,
                "source": "inferred"
            })

        chapters: List[ChapterMetadata] = []
        for idx, h in enumerate(unique_headings):
            start_p = h["page"]
            if idx + 1 < len(unique_headings):
                end_p = unique_headings[idx + 1]["page"] - 1
            else:
                end_p = total_pages
            
            end_p = max(start_p, end_p)
            title = h["title"]
            # Clean title
            title = re.sub(r"\s+", " ", title).strip()
            
            chapters.append(
                ChapterMetadata(
                    chapter_id=f"SEC-{idx+1}",
                    title=title,
                    start_page=start_p,
                    end_page=end_p,
                    page_count=(end_p - start_p + 1),
                )
            )

        return chapters
