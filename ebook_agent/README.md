# E-Book Intelligence & Multilingual Briefing Agent 📖

A production-ready Python & Streamlit web application designed for academic e-books, lecture slides, and technical textbooks. It combines **PyMuPDF page-by-page parsing**, **automatic chapter/lecture detection** (e.g., `LEC-1`, `LEC-2`), **Hybrid Search (FAISS + BM25)**, **Cross-Encoder neural reranking**, and **Google Gemini** for grounded, multilingual briefing and Q&A.

---

## 🏗️ Architecture & Pipeline

```
┌─────────────────┐     PyMuPDF (fitz)     ┌──────────────────────────────────┐
│  Uploaded PDF   │ ─────────────────────► │  Page-by-page text & headings    │
└─────────────────┘                        │  Automatic Chapter Boundary Map  │
                                           └─────────────────┬────────────────┘
                                                             │
                                                             ▼
                                           ┌──────────────────────────────────┐
                                           │  Sliding Window Text Chunker     │
                                           │  [chunk_id, page, chapter, text] │
                                           └─────────────────┬────────────────┘
                                                             │
                     ┌───────────────────────────────────────┴───────────────────────────────────────┐
                     ▼                                                                               ▼
       ┌────────────────────────────┐                                                  ┌────────────────────────────┐
       │   Dense Vector Index       │                                                  │   Sparse Keyword Index     │
       │   FAISS (Cosine IP)        │                                                  │   BM25Okapi (rank_bm25)    │
       │   all-MiniLM-L6-v2         │                                                  └─────────────┬──────────────┘
       └─────────────┬──────────────┘                                                                │
                     │                                                                               │
                     └───────────────────────────────┬───────────────────────────────────────────────┘
                                                     ▼
                                       ┌────────────────────────────┐
                                       │ Reciprocal Rank Fusion RRF │
                                       └─────────────┬──────────────┘
                                                     ▼
                                       ┌────────────────────────────┐
                                       │ Cross-Encoder Reranking    │
                                       │ ms-marco-MiniLM-L-6-v2     │
                                       └─────────────┬──────────────┘
                                                     ▼
                                       ┌────────────────────────────┐
                                       │ Google Gemini API          │
                                       │ • Grounded Q&A + Citations │
                                       │ • Chapter Briefings        │
                                       │ • Multilingual (15+ Langs) │
                                       └────────────────────────────┘
```

---

## ⚡ Core Features

1. **Intelligent PDF Ingestion & Lecture Mapping**:
   - Uses PyMuPDF (`fitz`) to parse high-fidelity text page by page.
   - Detects embedded Table of Contents (TOC) bookmarks and scans regex patterns for lecture formats (e.g. `LEC-1: Intro`, `LEC-2: Arrays`, `Chapter 3`, `Module 4`).
   - Automatically maps exact start-to-end page ranges for every detected lecture/chapter.

2. **Hybrid Search Indexing**:
   - Chunks text while preserving sentence boundaries and metadata (`page`, `chapter`, `chunk_id`).
   - **Dense Search**: Generates 384-dimensional normalized embeddings with `sentence-transformers/all-MiniLM-L6-v2` and indexes in `faiss.IndexFlatIP`.
   - **Sparse Search**: Tokenizes words and indexes with `rank-bm25` (BM25Okapi).
   - Combines candidates using **Reciprocal Rank Fusion (RRF)**:
     $$RRF(d) = \sum_{m \in \{dense, sparse\}} \frac{1}{60 + \text{rank}_m(d)}$$

3. **Neural Cross-Encoder Reranking**:
   - Reranks top hybrid candidates using `cross-encoder/ms-marco-MiniLM-L-6-v2`.
   - Performs joint cross-attention between user query and candidate passages to prioritize exact conceptual relevance over simple lexical overlap.

4. **Grounded Gemini LLM Synthesis & Multilingual Briefings**:
   - Strict anti-hallucination prompt enforces answers strictly derived from retrieved text.
   - Every claim is cited with source tags: `[Page X, Chapter Y]`.
   - Generates executive chapter briefings (Summary, Core Theorems, Deep Breakdown, Exam Review Points).
   - Fully multilingual support across English, Hindi (हिन्दी), Bengali (বাংলা), Odia (ଓଡ଼ିଆ), Marathi (मराठी), Telugu (తెలుగు), Tamil (தமிழ்), Gujarati, Kannada, Malayalam, Punjabi, Urdu, Spanish, French, German.

5. **Streamlit Interactive UI**:
   - **Book Blueprint & Chapters**: Document metrics, chapter mapping table, and interactive page text inspector.
   - **Chapter Intelligence Briefings**: 1-click synthesis with download button for markdown briefings.
   - **Ask the Book (Q&A)**: Interactive chat with expandable source citation cards displaying page numbers, chapters, and cross-encoder relevance scores.
   - **Hybrid Search Inspector**: Side-by-side diagnostic table showing BM25, FAISS Cosine, RRF, and Cross-Encoder scores for any query.

---

## 🚀 Quickstart & Installation

### 1. Prerequisites
- Python 3.10+ (Python 3.11, 3.12, 3.13 supported)
- Google Gemini API Key ([Get an API Key here](https://aistudio.google.com/))

### 2. Create Virtual Environment
```bash
cd ebook_agent
python -m venv venv

# Windows
venv\Scripts\activate

# Linux / macOS
source venv/bin/activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Configure Environment Variables (Optional)
You can set your Gemini API key in an `.env` file or export it:
```bash
# Windows PowerShell
$env:GEMINI_API_KEY="your-gemini-api-key"

# Windows CMD
set GEMINI_API_KEY=your-gemini-api-key

# Linux / macOS
export GEMINI_API_KEY="your-gemini-api-key"
```
*(You can also simply paste your API key directly into the Streamlit sidebar password field!)*

### 5. Launch the Streamlit Web Application
```bash
streamlit run app.py
```
Open your browser at `http://localhost:8501`.

---

## 📁 File Structure

```
ebook_agent/
├── app.py               # Complete Streamlit Web Application Dashboard
├── config.py            # Retrieval hyperparameters, model names & language maps
├── pdf_parser.py        # PyMuPDF parser, regex lecture/chapter boundary mapper
├── hybrid_indexer.py    # Text chunker, FAISS dense index, BM25 sparse index & RRF
├── reranker.py          # CrossEncoder ms-marco-MiniLM-L-6-v2 neural reranker
├── llm_generator.py     # Google Gemini API grounding, citations & multilingual generator
├── requirements.txt     # Production dependencies
└── README.md            # Setup and architecture documentation
```
