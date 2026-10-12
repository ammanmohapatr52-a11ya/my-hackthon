import re
import io
from typing import List, Dict, Any, Optional

try:
    import pymupdf as fitz
except ImportError:
    try:
        import fitz
    except ImportError:
        fitz = None

try:
    import pypdf
except ImportError:
    pypdf = None


class PDFScannerService:
    """Production PDF Scanner & Structure Extractor."""

    HEADING_PATTERNS = [
        re.compile(r"^(?:LEC(?:TURE)?|SESSION|MODULE|UNIT)\s*[-:#]?\s*(\d+[A-Za-z]?)(?:\s*[-:–]\s*(.+))?", re.IGNORECASE),
        re.compile(r"^(?:CHAPTER|CHAP\.)\s*([0-9IVXLCDM]+|\d+)(?:\s*[-:–]\s*(.+))?", re.IGNORECASE),
        re.compile(r"^(?:SECTION|PART)\s*([0-9IVXLCDM]+|\d+(?:\.\d+)*)(?:\s*[-:–]\s*(.+))?", re.IGNORECASE),
    ]

    MATH_PATTERNS = [
        re.compile(r"\\(?:frac|sqrt|sum|int|lim|alpha|beta|theta|partial|pi|infty)", re.IGNORECASE),
        re.compile(r"[a-zA-Z]\s*=\s*[-+]?[0-9a-zA-Z\(\)\/\*\+\^]+"),
        re.compile(r"\b[fgh]\([a-z]\)\s*="),
        re.compile(r"[0-9]+[a-zA-Z]?\^\{?[0-9a-zA-Z]+\}?"),
    ]

    def scan_pdf_bytes(self, pdf_bytes: bytes, filename: str = "document.pdf") -> Dict[str, Any]:
        """Scans a PDF and returns page-by-page text, detected chapters, and metrics."""
        pages: List[Dict[str, Any]] = []
        raw_headings: List[Dict[str, Any]] = []
        total_words = 0

        if fitz is not None:
            doc = fitz.open(stream=pdf_bytes, filetype="pdf")
            total_pages = len(doc)

            # Check Table of Contents (TOC) bookmarks
            try:
                toc = doc.get_toc()
                for item in toc:
                    lvl, title, pno = item[0], item[1].strip(), item[2]
                    if lvl <= 2 and pno > 0:
                        raw_headings.append({
                            "title": title,
                            "page": pno,
                            "source": "toc"
                        })
            except Exception:
                pass

            for idx, page in enumerate(doc):
                pno = idx + 1
                text = page.get_text("text") or ""
                if not text.strip():
                    try:
                        blocks = page.get_text("blocks")
                        text = "\n".join(b[4] for b in blocks if len(b) > 4 and isinstance(b[4], str)).strip()
                    except Exception:
                        pass

                cleaned = re.sub(r"\r\n|\r", "\n", text).strip()
                if not cleaned:
                    try:
                        imgs = page.get_images()
                        if imgs:
                            cleaned = f"[Page {pno}: Scanned academic diagram/slide with {len(imgs)} visual figure(s).]"
                    except Exception:
                        pass

                words = cleaned.split()
                w_count = len(words)
                total_words += w_count

                # Detect headings
                page_headings = []
                lines = [line.strip() for line in cleaned.split("\n") if line.strip()]
                for line in lines[:10]:
                    for pat in self.HEADING_PATTERNS:
                        m = pat.match(line)
                        if m:
                            matched = line[:100]
                            page_headings.append(matched)
                            if not any(h["page"] == pno and h["title"] == matched for h in raw_headings):
                                raw_headings.append({
                                    "title": matched,
                                    "page": pno,
                                    "source": "regex"
                                })
                            break

                # Detect math formulas
                detected_math = []
                for line in lines:
                    for m_pat in self.MATH_PATTERNS:
                        if m_pat.search(line):
                            detected_math.append(line)
                            break
                    if len(detected_math) >= 5:
                        break

                pages.append({
                    "page_number": pno,
                    "text": cleaned,
                    "char_count": len(cleaned),
                    "word_count": w_count,
                    "headings": page_headings,
                    "math_formulas": detected_math,
                })

        elif pypdf is not None:
            reader = pypdf.PdfReader(io.BytesIO(pdf_bytes))
            total_pages = len(reader.pages)
            for idx, p in enumerate(reader.pages):
                pno = idx + 1
                text = p.extract_text() or ""
                cleaned = re.sub(r"\r\n|\r", "\n", text).strip()
                words = cleaned.split()
                w_count = len(words)
                total_words += w_count

                pages.append({
                    "page_number": pno,
                    "text": cleaned,
                    "char_count": len(cleaned),
                    "word_count": w_count,
                    "headings": [],
                    "math_formulas": [],
                })
        else:
            raise RuntimeError("No PDF processing library available (PyMuPDF or pypdf).")

        chapters = self._build_chapters(raw_headings, total_pages)

        # Attribute chapters to each page
        for p in pages:
            p["chapter"] = self._get_chapter_title(p["page_number"], chapters)

        return {
            "filename": filename,
            "total_pages": total_pages,
            "total_words": total_words,
            "chapters": chapters,
            "pages": pages,
        }

    def _get_chapter_title(self, pno: int, chapters: List[Dict[str, Any]]) -> str:
        for ch in chapters:
            if ch["start_page"] <= pno <= ch["end_page"]:
                return ch["title"]
        return "General"

    def _build_chapters(self, raw_headings: List[Dict[str, Any]], total_pages: int) -> List[Dict[str, Any]]:
        if not raw_headings:
            if total_pages <= 20:
                return [{
                    "chapter_id": "CH-1",
                    "title": "Full Document",
                    "start_page": 1,
                    "end_page": total_pages,
                    "page_count": total_pages
                }]
            else:
                chapters = []
                step = 15
                ch_idx = 1
                for start in range(1, total_pages + 1, step):
                    end = min(start + step - 1, total_pages)
                    chapters.append({
                        "chapter_id": f"PART-{ch_idx}",
                        "title": f"Part {ch_idx} (Pages {start}–{end})",
                        "start_page": start,
                        "end_page": end,
                        "page_count": end - start + 1
                    })
                    ch_idx += 1
                return chapters

        sorted_headings = sorted(raw_headings, key=lambda x: x["page"])
        unique: List[Dict[str, Any]] = []
        seen = set()
        for h in sorted_headings:
            p = h["page"]
            if p not in seen and p <= total_pages:
                seen.add(p)
                unique.append(h)

        if not unique:
            return [{
                "chapter_id": "CH-1",
                "title": "Full Document",
                "start_page": 1,
                "end_page": total_pages,
                "page_count": total_pages
            }]

        if unique[0]["page"] > 1:
            unique.insert(0, {
                "title": "Introduction / Front Matter",
                "page": 1,
                "source": "inferred"
            })

        chapters = []
        for idx, h in enumerate(unique):
            start_p = h["page"]
            if idx + 1 < len(unique):
                end_p = unique[idx + 1]["page"] - 1
            else:
                end_p = total_pages
            end_p = max(start_p, end_p)

            raw_title = h["title"].strip()
            clean_t = re.sub(r"\s+", " ", raw_title)
            if len(clean_t) > 48:
                clean_t = clean_t[:45].rstrip() + "..."
            if clean_t.isupper() and len(clean_t) > 6:
                clean_t = clean_t.title()

            chapters.append({
                "chapter_id": f"SEC-{idx+1}",
                "title": clean_t,
                "full_title": raw_title,
                "start_page": start_p,
                "end_page": end_p,
                "page_count": end_p - start_p + 1
            })

        return chapters


pdf_scanner_service = PDFScannerService()
