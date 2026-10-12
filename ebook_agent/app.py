import os
import time
import streamlit as st
from typing import List

from config import config
from pdf_parser import PDFParser, ParsedDocument
from hybrid_indexer import TextChunker, HybridSearchIndex, DocumentChunk
from reranker import ResultReranker
from llm_generator import GeminiLLMGenerator

# Set Streamlit Page Configuration
st.set_page_config(
    page_title="E-Book Intelligence & Multilingual Briefing Agent",
    page_icon="📖",
    layout="wide",
    initial_sidebar_state="expanded",
)

# Custom Styling for clean modern interface
st.markdown(
    """
    <style>
    .main-header {
        font-size: 2.1rem;
        font-weight: 700;
        background: linear-gradient(120deg, #2563eb, #38bdf8, #9333ea);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        margin-bottom: 0.2rem;
    }
    .sub-header {
        font-size: 1rem;
        color: #64748b;
        margin-bottom: 1.5rem;
    }
    .metric-card {
        padding: 1rem;
        border-radius: 8px;
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        text-align: center;
    }
    .source-box {
        background-color: #f1f5f9;
        border-left: 4px solid #3b82f6;
        padding: 0.75rem 1rem;
        margin: 0.5rem 0;
        border-radius: 4px;
        font-size: 0.9rem;
    }
    .badge {
        display: inline-block;
        padding: 0.2rem 0.5rem;
        border-radius: 9999px;
        font-size: 0.75rem;
        font-weight: 600;
    }
    .badge-primary { background: #dbeafe; color: #1e40af; }
    .badge-success { background: #dcfce7; color: #15803d; }
    </style>
    """,
    unsafe_allow_html=True,
)


def init_session_state():
    if "parsed_doc" not in st.session_state:
        st.session_state.parsed_doc = None
    if "chunks" not in st.session_state:
        st.session_state.chunks = []
    if "hybrid_index" not in st.session_state:
        st.session_state.hybrid_index = None
    if "reranker" not in st.session_state:
        st.session_state.reranker = None
    if "generator" not in st.session_state:
        st.session_state.generator = None
    if "chat_messages" not in st.session_state:
        st.session_state.chat_messages = []
    if "briefings" not in st.session_state:
        st.session_state.briefings = {}


init_session_state()

# ==========================================
# SIDEBAR CONTROLS
# ==========================================
with st.sidebar:
    st.image("https://img.icons8.com/fluency/96/reading.png", width=64)
    st.title("Settings & Ingestion")

    # 1. Gemini API Key Configuration
    gemini_key = st.text_input(
        "Google Gemini API Key",
        value=os.getenv("GEMINI_API_KEY", ""),
        type="password",
        help="Enter your Google Gemini API key to enable briefings and Q&A.",
    )

    selected_model = st.selectbox(
        "Gemini Model",
        options=config.AVAILABLE_GEMINI_MODELS,
        index=0,
    )

    # 2. Multilingual Target Language
    selected_language = st.selectbox(
        "Output Language",
        options=list(config.SUPPORTED_LANGUAGES.keys()),
        index=0,
    )

    st.divider()

    # 3. PDF File Uploader
    uploaded_file = st.file_uploader(
        "Upload E-Book / Lecture Notes (PDF)",
        type=["pdf"],
        help="Upload textbook, lecture slides (LEC-1, LEC-2), or course modules.",
    )

    # 4. Advanced Retrieval Parameters
    with st.expander("⚙️ Advanced Retrieval Parameters", expanded=False):
        top_k_bm25 = st.slider("BM25 Candidates", min_value=5, max_value=30, value=config.TOP_K_SPARSE_BM25)
        top_k_dense = st.slider("FAISS Candidates", min_value=5, max_value=30, value=config.TOP_K_DENSE_FAISS)
        top_k_rerank = st.slider("Cross-Encoder Top-K", min_value=1, max_value=10, value=config.TOP_K_RERANKED)

    # Ingestion Trigger
    if uploaded_file is not None:
        if st.button("🚀 Process & Index E-Book", type="primary", use_container_width=True):
            with st.spinner("Parsing PDF and detecting chapters with PyMuPDF..."):
                pdf_bytes = uploaded_file.read()
                parser = PDFParser()
                parsed_doc = parser.parse(pdf_bytes, filename=uploaded_file.name)
                st.session_state.parsed_doc = parsed_doc

            with st.spinner("Chunking text with metadata & building FAISS + BM25 hybrid index..."):
                chunker = TextChunker()
                chunks = chunker.chunk_document(parsed_doc)
                st.session_state.chunks = chunks

                hybrid_idx = HybridSearchIndex()
                hybrid_idx.build_index(chunks)
                st.session_state.hybrid_index = hybrid_idx

                reranker = ResultReranker()
                st.session_state.reranker = reranker

            st.success(f"Indexed {len(chunks)} chunks across {parsed_doc.total_pages} pages!")

    # Active Document Overview
    if st.session_state.parsed_doc:
        doc = st.session_state.parsed_doc
        st.divider()
        st.markdown(f"**Current Book:** `{doc.filename}`")
        st.caption(f"📄 {doc.total_pages} Pages | 📑 {len(doc.chapters)} Chapters | 📝 {doc.total_words:,} Words")

# Initialize Gemini Generator in session
if gemini_key:
    if st.session_state.generator is None or st.session_state.generator.api_key != gemini_key:
        st.session_state.generator = GeminiLLMGenerator(api_key=gemini_key, model_name=selected_model)
    else:
        st.session_state.generator.model_name = selected_model

# ==========================================
# MAIN INTERFACE
# ==========================================
st.markdown('<div class="main-header">E-Book Intelligence & Multilingual Briefing Agent</div>', unsafe_allow_html=True)
st.markdown(
    '<div class="sub-header">Deep PDF Parser • Hybrid FAISS + BM25 Search • Cross-Encoder Reranking • Grounded Multilingual Synthesis</div>',
    unsafe_allow_html=True,
)

if not st.session_state.parsed_doc:
    # Empty State Guide
    st.info("👋 Welcome! Please upload a PDF e-book or lecture notes in the left sidebar to begin.")
    
    col1, col2, col3 = st.columns(3)
    with col1:
        st.markdown("### 1. Structure Detection")
        st.markdown("Extracts text page-by-page and detects chapters, sections, and lecture tags (e.g. `LEC-1`, `LEC-2`) automatically.")
    with col2:
        st.markdown("### 2. Hybrid Retrieval & Reranking")
        st.markdown("Combines **FAISS** vector cosine similarity with **BM25** exact keyword matching, then refines with `ms-marco-MiniLM-L-6-v2`.")
    with col3:
        st.markdown("### 3. Multilingual Briefings")
        st.markdown("Generates grounded chapter briefings and Q&A in English, Hindi, Odia, Bengali, Marathi, and other regional languages.")
else:
    doc: ParsedDocument = st.session_state.parsed_doc
    chunks: List[DocumentChunk] = st.session_state.chunks
    hybrid_index: HybridSearchIndex = st.session_state.hybrid_index
    reranker: ResultReranker = st.session_state.reranker
    generator: GeminiLLMGenerator = st.session_state.generator

    tab_overview, tab_briefing, tab_qa, tab_inspector = st.tabs([
        "📚 Book Blueprint & Chapters",
        "📑 Chapter Intelligence Briefings",
        "💬 Ask the Book (Interactive Q&A)",
        "🔬 Hybrid Search Inspector",
    ])

    # ----------------------------------------------------
    # TAB 1: BOOK BLUEPRINT & CHAPTERS
    # ----------------------------------------------------
    with tab_overview:
        st.subheader("Document Overview & Hierarchy")
        
        m1, m2, m3, m4 = st.columns(4)
        with m1:
            st.metric("Total Pages", doc.total_pages)
        with m2:
            st.metric("Detected Chapters / Lectures", len(doc.chapters))
        with m3:
            st.metric("Total Words", f"{doc.total_words:,}")
        with m4:
            st.metric("Indexed Chunks", len(chunks))

        st.markdown("#### Detected Chapters & Section Mappings")
        
        chapter_rows = []
        for ch in doc.chapters:
            chapter_rows.append({
                "Section ID": ch.chapter_id,
                "Chapter / Lecture Title": ch.title,
                "Page Range": f"Pages {ch.start_page} – {ch.end_page}",
                "Page Count": ch.page_count,
            })
        st.dataframe(chapter_rows, use_container_width=True)

        st.divider()
        st.markdown("#### Page Reader & Raw Inspection")
        inspect_page = st.slider("Select Page to Preview", min_value=1, max_value=doc.total_pages, value=1)
        page_obj = doc.pages[inspect_page - 1]
        
        st.caption(f"**Chapter Attribution:** {doc.get_chapter_for_page(inspect_page)} | **Words:** {page_obj.word_count}")
        if page_obj.detected_headings:
            st.info(f"Detected Headers on Page: {', '.join(page_obj.detected_headings)}")
        st.text_area("Extracted Page Text", value=page_obj.text, height=250, disabled=True)

    # ----------------------------------------------------
    # TAB 2: BOOK BRIEFING (CHAPTER-WISE & WHOLE BOOK)
    # ----------------------------------------------------
    with tab_briefing:
        st.subheader("📖 Book Briefing Engine")
        st.markdown(
            "Generate grounded briefings featuring **Overview**, **Key Concepts**, **Important Points**, and **Key Takeaways** with zero hallucinations."
        )

        if not gemini_key:
            st.warning("⚠️ Please provide your Google Gemini API Key in the sidebar to generate briefings.")

        briefing_scope = st.radio(
            "Select Briefing Scope:",
            options=["Specific Chapter", "Whole Book (Paginated Batches)"],
            horizontal=True,
        )

        if briefing_scope == "Specific Chapter":
            chapter_titles = [f"{ch.chapter_id}: {ch.title} (pp. {ch.start_page}–{ch.end_page})" for ch in doc.chapters]
            selected_ch_str = st.selectbox("Choose Chapter / Lecture to Brief", options=chapter_titles)
            selected_idx = chapter_titles.index(selected_ch_str)
            target_ch = doc.chapters[selected_idx]

            # Filter chunks for this chapter
            chapter_chunks = [c for c in chunks if target_ch.start_page <= c.page <= target_ch.end_page]

            col_b1, col_b2 = st.columns([1, 4])
            with col_b1:
                generate_btn = st.button("⚡ Generate Chapter Briefing", type="primary", disabled=not bool(gemini_key))

            briefing_key = f"{target_ch.chapter_id}_{selected_language}"

            if generate_btn and generator:
                with st.spinner(f"Synthesizing {target_ch.title} into {selected_language}..."):
                    res = generator.generate_chapter_briefing(
                        chapter_title=target_ch.title,
                        start_page=target_ch.start_page,
                        end_page=target_ch.end_page,
                        chapter_chunks=chapter_chunks,
                        target_language=selected_language,
                    )
                    st.session_state.briefings[briefing_key] = res

            if briefing_key in st.session_state.briefings:
                res = st.session_state.briefings[briefing_key]
                st.success(f"Chapter Briefing Complete ({selected_language}) • Analyzed Pages {res['page_range']}")
                st.markdown(res["briefing"])
                
                st.download_button(
                    label="📥 Download Chapter Briefing (.md)",
                    data=res["briefing"],
                    file_name=f"briefing_{target_ch.chapter_id}_{selected_language}.md",
                    mime="text/markdown",
                )
        else:
            # Whole Book Mode (Paginated in batches of 5 chapters)
            total_chapters = len(doc.chapters)
            batch_size = 5
            total_batches = max(1, (total_chapters + batch_size - 1) // batch_size)

            batch_options = [
                f"Batch {i+1}: Chapters {i*batch_size + 1} to {min((i+1)*batch_size, total_chapters)}"
                for i in range(total_batches)
            ]

            selected_batch_str = st.selectbox("Select Paginated Batch (e.g. first 5 chapters, next 5):", options=batch_options)
            batch_idx = batch_options.index(selected_batch_str)
            
            start_ch_idx = batch_idx * batch_size
            end_ch_idx = min(start_ch_idx + batch_size, total_chapters)
            selected_chapters = doc.chapters[start_ch_idx:end_ch_idx]
            
            p_start = selected_chapters[0].start_page if selected_chapters else 1
            p_end = selected_chapters[-1].end_page if selected_chapters else doc.total_pages

            batch_chunks = [c for c in chunks if p_start <= c.page <= p_end]

            col_wb1, col_wb2 = st.columns([1, 4])
            with col_wb1:
                generate_wb_btn = st.button("⚡ Generate Whole Book Briefing", type="primary", disabled=not bool(gemini_key))

            wb_briefing_key = f"wb_batch_{batch_idx}_{selected_language}"

            if generate_wb_btn and generator:
                with st.spinner(f"Synthesizing {selected_batch_str} across Pages {p_start}–{p_end} into {selected_language}..."):
                    res = generator.generate_whole_book_briefing(
                        book_title=doc.filename,
                        total_pages=doc.total_pages,
                        chapters=selected_chapters,
                        all_chunks=batch_chunks,
                        target_language=selected_language,
                        batch_slice_title=selected_batch_str,
                    )
                    st.session_state.briefings[wb_briefing_key] = res

            if wb_briefing_key in st.session_state.briefings:
                res = st.session_state.briefings[wb_briefing_key]
                st.success(f"Whole Book Briefing Complete ({selected_language}) • {selected_batch_str}")
                st.markdown(res["briefing"])

                st.download_button(
                    label="📥 Download Whole Book Briefing (.md)",
                    data=res["briefing"],
                    file_name=f"briefing_whole_book_{batch_idx}_{selected_language}.md",
                    mime="text/markdown",
                )

    # ----------------------------------------------------
    # TAB 3: ASK THE BOOK (INTERACTIVE Q&A)
    # ----------------------------------------------------
    with tab_qa:
        st.subheader("Ask the Book: Grounded Q&A with Citations")
        st.markdown(
            "Answers are backed by **Hybrid Search (BM25 + FAISS)** and **Cross-Encoder Reranking**, with strict source page citations."
        )

        if not gemini_key:
            st.warning("⚠️ Please enter your Google Gemini API Key in the sidebar to enable chat.")

        # Display previous chat messages
        for msg in st.session_state.chat_messages:
            with st.chat_message(msg["role"]):
                st.markdown(msg["content"])
                if "citations" in msg and msg["citations"]:
                    with st.expander("🔍 View Retrieved & Reranked Sources"):
                        for c in msg["citations"]:
                            st.markdown(
                                f"""
                                <div class="source-box">
                                <strong>Source {c['source_index']}: Page {c['page']}</strong> (Chapter: {c['chapter']})<br>
                                <span class="badge badge-primary">Rerank Score: {c['rerank_score']}</span><br>
                                <em>"{c['text'][:400]}..."</em>
                                </div>
                                """,
                                unsafe_allow_html=True,
                            )

        # Chat Input
        user_query = st.chat_input("Ask any question from this e-book or lecture...")

        if user_query:
            # Display user message
            st.session_state.chat_messages.append({"role": "user", "content": user_query})
            with st.chat_message("user"):
                st.markdown(user_query)

            # Process Assistant Response
            if not generator or not generator.is_configured():
                with st.chat_message("assistant"):
                    st.error("Please provide a valid Gemini API Key in the sidebar to answer questions.")
            else:
                with st.chat_message("assistant"):
                    with st.spinner("Searching hybrid index & reranking top passages..."):
                        t0 = time.time()
                        
                        # 1. Hybrid Search (FAISS + BM25)
                        candidates = hybrid_index.search_hybrid(
                            query=user_query,
                            top_k_bm25=top_k_bm25,
                            top_k_dense=top_k_dense,
                            top_k_hybrid=config.TOP_K_HYBRID_RRF,
                        )

                        # 2. Cross-Encoder Reranking
                        reranked = reranker.rerank(
                            query=user_query,
                            candidates=candidates,
                            top_k=top_k_rerank,
                        )

                        # 3. Grounded Gemini Multilingual Generation
                        gen_result = generator.generate_grounded_answer(
                            query=user_query,
                            reranked_results=reranked,
                            target_language=selected_language,
                        )
                        latency = time.time() - t0

                        answer_text = gen_result["answer"]
                        citations = gen_result["citations"]

                        st.markdown(answer_text)
                        st.caption(f"⏱️ Retrieval & Generation time: {latency:.2f}s | Language: {selected_language}")

                        if citations:
                            with st.expander("🔍 View Retrieved & Reranked Sources"):
                                for c in citations:
                                    st.markdown(
                                        f"""
                                        <div class="source-box">
                                        <strong>Source {c['source_index']}: Page {c['page']}</strong> (Chapter: {c['chapter']})<br>
                                        <span class="badge badge-primary">CrossEncoder Score: {c['rerank_score']}</span><br>
                                        <em>"{c['text'][:400]}..."</em>
                                        </div>
                                        """,
                                        unsafe_allow_html=True,
                                    )

                        # Save to state
                        st.session_state.chat_messages.append({
                            "role": "assistant",
                            "content": answer_text,
                            "citations": citations,
                        })

    # ----------------------------------------------------
    # TAB 4: HYBRID SEARCH INSPECTOR
    # ----------------------------------------------------
    with tab_inspector:
        st.subheader("Hybrid Search & Reranking Diagnostic Inspector")
        st.markdown("Inspect how BM25, FAISS Vector Search, and the Cross-Encoder score candidate chunks.")

        test_query = st.text_input("Enter diagnostic query:", value="What is the main topic of lecture 1?")
        if st.button("Run Diagnostics"):
            if hybrid_index and reranker:
                with st.spinner("Running diagnostic evaluation..."):
                    raw_candidates = hybrid_index.search_hybrid(
                        query=test_query,
                        top_k_bm25=10,
                        top_k_dense=10,
                        top_k_hybrid=15,
                    )
                    reranked_diag = reranker.rerank(
                        query=test_query,
                        candidates=raw_candidates,
                        top_k=5,
                    )

                st.markdown("#### Top Reranked Candidates (Cross-Encoder vs. RRF vs. Dense vs. Sparse)")
                diag_rows = []
                for idx, r in enumerate(reranked_diag, 1):
                    diag_rows.append({
                        "Rank": idx,
                        "Page": r.chunk.page,
                        "Chapter": r.chunk.chapter,
                        "CrossEncoder Score": round(r.rerank_score, 4),
                        "RRF Score": round(r.original_rrf_score, 5),
                        "Dense Cosine": round(r.dense_score, 4),
                        "BM25 Score": round(r.sparse_score, 4),
                        "Excerpt Preview": r.chunk.text[:120] + "...",
                    })
                st.dataframe(diag_rows, use_container_width=True)
