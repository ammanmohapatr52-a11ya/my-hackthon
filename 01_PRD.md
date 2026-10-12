# PRD — Accessible Academic Problem Solver

> **Team Neurobridge** · NEXTECH 2.0 (NMIET | NIRMIT 2026) · Tagline: *"Make It Accessible."*

| Field | Value |
|---|---|
| Version | **0.2** (aligned to the frontend prototype) |
| Date | 2026-10-11 |
| Owner | Team Neurobridge |
| Related docs | `02_FSD.md`, `03_SAD.md`, `04_TAD.md`, `05_FTL.md` |
| Sources | Pitch deck (10 slides), team mind-map (modules A–H), **frontend prototype screenshot (home screen)** |

### Change log
| Version | Change |
|---|---|
| 0.1 | First draft from pitch deck + mind-map |
| **0.2** | **Blind / low-vision (and deafblind) learners moved to "deferred".** Product re-scoped to match the prototype: browser-first, local-first, local Ollama for AI, exact math solver, flashcards, voice learning, progress dashboard. Image / PDF / "describe" features moved to a later desktop version. |

---

## 1. Vision

Education should not only deliver content. It should make every academic problem **accessible, understandable, solvable and verifiable** for every learner.

**One-sentence solution:** A private, on-device learning platform that lets students solve problems and ask questions in the way that works for them — text, voice with word highlighting, captions — with exact, checked math steps and spaced-repetition practice.

## 2. Problem statement

Students face barriers when *accessing, understanding and solving* academic problems. Most platforms deliver content, not problem-solving, and explanations are often audio-only, dense, or in language the learner struggles with.

> **Version-1 focus:** deaf / hard-of-hearing learners, and learners who need clearer, simpler or voice-based explanations. Support for blind and low-vision learners is **deferred** (see §3.2).

- **Why it matters:** lost learning time, reduced independence, unequal participation.
- **Key insight:** the barrier is at the moment of *accessing and understanding* a problem, not a lack of course content.

## 3. Target users

### 3.1 Version 1 (in scope)

Primary: school students (13–18) and college students (18–25).

| User group | Main problem | What v1 provides |
|---|---|---|
| Deaf / hard-of-hearing students | Cannot rely on audio explanations | Captions and transcripts for all spoken output, visual notifications, text-first interaction |
| General students | Need clear, efficient problem-solving help | Exact math solver with step-by-step explanation, Ask a Question, flashcards, progress tracking |
| Students with reading / comprehension difficulty | Struggle with dense text | Simplified explanation levels, one-step-at-a-time view, voice with word highlighting |
| Students preferring voice | Prefer speaking/listening to typing/reading | Voice command, spoken steps, Voice Learning |
| Students with limited English proficiency | Struggle with English-only material | Level 1 plain-language explanations; language selector (English first, more later) |

**Learner profile selector** on Home ("How do you learn best?"): **Deaf / hard of hearing** and **Standard** are active in v1. Other needs are reached through Accessibility Settings (Large text, High contrast, Simplified learning, Voice, etc.).

### 3.2 Deferred users (not in v1)

| Group | Why deferred | What it would need later |
|---|---|---|
| Blind / low-vision learners | We cannot currently deliver a screen-reader-grade experience, reliable diagram/image description, or Braille output | Vision model for descriptions, tested screen-reader experience, Braille tools, testing with blind users |
| Deafblind learners | Depends on non-visual output (Braille / tactile) | Same as above, plus refreshable-Braille support |
| Teachers / educators | Needs accounts and a backend | Phase 2 (material upload, learning-history visibility, dashboard) |

**Product rules for deferred groups**
1. **Do not claim support** for them in the demo, README or pitch.
2. **Do not ship half-working controls** — profile cards and menu items for deferred features are hidden, or shown as disabled with a "Coming later" label.
3. Basic semantic HTML and keyboard operation are still required (good engineering, and needed by deaf and other users) — but a screen-reader-optimised experience is not a v1 deliverable.

### 3.3 Illustrative personas (for design discussion only — not research)
1. **Rohan, B.Tech 2nd year, deaf** — cannot use audio-only explanations. Needs captions, a transcript, visual alerts and text-first interaction.
2. **Meera, Class 9, limited English** — needs Level 1 plain-language explanations and a glossary.
3. **Kabir, Class 10, reads slowly** — prefers listening with the words highlighted, one step at a time.

## 4. Goals and non-goals

### Goals
1. **Solve** mathematics problems with **exact, checked, spoken steps**.
2. **Ask** academic questions answered by a **local AI model (Ollama)**.
3. Deliver every result through multiple modes: text, voice with word highlighting, captions/transcript.
4. Help students **retain** what they learn: flashcards with spaced repetition, streak and progress.
5. **Private by default:** runs on the device; history is optional and can be turned off.
6. Adapt explanations to the learner (3 levels) and verify understanding.
7. Keep our own UI keyboard-operable, high-contrast-capable and resizable (WCAG 2.2 AA target).

### Non-goals (v1)
- Blind / low-vision / deafblind support, Braille Tools, "Describe what I can't see".
- Image and PDF input, OCR, vision models (later desktop version).
- Accounts, cloud sync, teacher/admin dashboards (Phase 2).
- Full LMS features; live lecture captioning; native mobile apps.
- Claims of measured impact. Targets below are targets, not results.

## 5. Differentiators

| # | Differentiator | v1 status |
|---|---|---|
| 1 | Transforms inaccessible content (diagrams, PDFs, charts) into accessible formats | **Deferred** (needs OCR/vision; later desktop version) |
| 2 | One problem, many modes — text, voice, captions, visual | **Active** |
| 3 | AI understands incomplete questions and adapts the explanation | **Active** (via local Ollama + levels) |
| 4 | Interactive academic tools, not just a chatbot (math solver, flashcards, graph & sound, voice learning) | **Active** |
| 5 | *(new)* Private, on-device: nothing uploaded | **Active** |

**Conceptual comparison (no claims about specific competitors):** Traditional LMS = content-focused · video platforms = accessibility varies · generic AI chatbots = not built around accessibility or exact problem-solving · accessibility tools = don't understand academic problems. **Our approach: accessibility-first, problem-solving focused, private, education-specific.**

## 6. Scope — features (as in the prototype home screen)

Priority: **P0** demo-critical · **P1** if time · **P2** later · **Deferred** = excluded for now.

| Feature (nav item) | Description (from prototype) | Priority | Mind-map module |
|---|---|---|---|
| Home | Welcome, learner profile picker, stats (day streak, problems solved, flashcards due, flashcards saved), quick actions, weekly strip, privacy note | P0 | — |
| Solve a Mathematics Problem | "Exact, checked, spoken steps" | P0 | A |
| Ask a Question | "Uses your local Ollama" | P0 | A, G |
| Voice Learning | "Listen with word highlighting" | P0 | D, E |
| Flashcards | "Spaced repetition"; saved from solved problems/answers | P0 | new |
| My Learning History | Local history; optional, can be switched off | P0 | new |
| Accessibility Settings | Modes, text size, contrast, privacy, data controls | P0 | H |
| Voice command (header button) | Control the app by voice | P1 | E |
| Language selector (header) | English first; more languages later | P1 | G |
| Graph and Sound | "See it, hear it" — plot a function and hear it as tones | P1 | new |
| Ask About This | Follow-up anchored to a step or answer | P1 | F |
| Captions / transcript (editable, searchable) | For all spoken output | P0 basic / P1 advanced | D |
| Braille Tools | Read and write maths in Braille | **Deferred** | — |
| Describe What I Can't See | Visual → structured description | **Deferred** | B |
| Image / PDF input, accessible PDFs | Needs local OCR or vision model | **Deferred** (desktop/Phase 2) | C |
| Accounts, teacher features | Backend | **P2 / Phase 2** | — |

## 7. Key user stories

| ID | As a… | I want… | So that… |
|---|---|---|---|
| US-01 | student | to type or speak a math problem and get exact, checked steps | I can trust and follow the solution |
| US-02 | deaf student | captions and a transcript for every spoken step, plus visual alerts | I never depend on sound |
| US-03 | student | to ask a question and get an answer from a local model | my questions stay on my device |
| US-04 | student | to switch between Level 1, 2 and 3 | the explanation matches my knowledge |
| US-05 | student with reading difficulty | to listen to a solution with the current word highlighted | I can follow without struggling to read |
| US-06 | student | to save a step or answer as a flashcard and review it on schedule | I remember it |
| US-07 | student | to see my streak, problems solved and flashcards due | I stay motivated |
| US-08 | student | to turn history off and delete my data | I control my privacy |
| US-09 | student | to combine large text, high contrast and simplified learning | the UI fits me without a separate site |
| US-10 | student | to plot a function and hear it as tones | I understand its shape in two ways |

## 8. Success metrics (targets, not measured results)

| Metric | Target |
|---|---|
| Core flows operable by keyboard only | 100% |
| Automated a11y scan (axe-core) on main pages | 0 critical / serious violations |
| Math solver: correctness on the team test set (≥ 50 problems of supported types) | 100% of "checked" results are verified correct |
| First streamed token for Ask a Question on the demo laptop | ≤ 5 s (depends on model and hardware) |
| Every spoken output has captions | 100% |
| Network requests to external hosts during normal use | 0 (other than the local Ollama address) — see risk R7 for speech |

After a pilot: add real metrics (task completion, satisfaction from deaf and hard-of-hearing learners' testing).

## 9. Assumptions and constraints

- The app runs in a web browser; AI runs on the learner's own computer through **Ollama**; math is computed by an on-device engine.
- Ollama must be installed, running, and have at least one model pulled **before** the demo (the venue may have no internet).
- A student team with limited time: current status is *prototype of the home screen and navigation; features are being built* — do not present unbuilt features as finished.
- Speech APIs differ by browser; features are feature-detected with graceful fallback.

## 10. Risks and mitigations

| # | Risk | Mitigation |
|---|---|---|
| R1 | Incorrect AI answers (small local models) | Math is computed by the engine, not the LLM; AI-limits note; "Report / flag" action; teacher review in Phase 2 |
| R2 | Ollama not installed / not running / blocked by browser | Clear status indicator and setup help; configurable address; test on target browsers; run the app locally if hosted-page access is blocked |
| R3 | Slow responses on weak hardware | Streaming; smaller default model; show progress; cache repeated questions |
| R4 | Math engine can't solve a problem type | State supported types; fail clearly ("not supported yet") rather than guess |
| R5 | Accessibility errors in our own UI | Keyboard tests, axe, contrast checks; test with deaf / hard-of-hearing users |
| R6 | Word highlighting not supported by some voices | Fall back to sentence highlighting |
| R7 | **Privacy claim vs. browser speech recognition** — in some browsers speech-to-text sends audio to the browser vendor's service, which conflicts with "nothing is uploaded" | Either word the badge precisely ("nothing is uploaded to us; browser speech recognition may use your browser's service"), or use on-device recognition where available; decide before the demo |
| R8 | Over-reliance on AI | Explain, don't just answer; verification questions; flashcards |
| R9 | Pitch deck and product disagree (deck mentions blind learners and a FastAPI/PostgreSQL stack) | Update the deck to match this PRD before submission |

## 11. Delivery plan

| Phase | Content |
|---|---|
| **1 — Local-first MVP (hackathon)** | Home + profile picker, Solve Math, Ask a Question (Ollama), Voice Learning, Flashcards, History, Accessibility Settings, captions; then Voice command, Graph and Sound, language selector |
| 2 — Backend & desktop | FastAPI + PostgreSQL (accounts, sync, teacher materials), local OCR / vision for image and PDF input, accessible PDFs |
| 3 — Inclusion expansion | Blind / low-vision and deafblind support (descriptions, Braille, screen-reader-grade UX) after testing with those learners |

## 12. Hackathon demo script (≈ 3 min)

1. Home → choose **Deaf / hard of hearing** → captions and visual alerts switch on; point out "runs on this device".
2. **Solve a Mathematics Problem** → exact, checked steps → spoken with word highlighting + captions.
3. **Ask a Question** (local Ollama) → same question at Level 1 → Level 3.
4. **Save as flashcard** → open Flashcards → review a due card.
5. Back to Home → streak and counters updated; show **History off** switch in Settings.
6. *(If built)* **Graph and Sound** — plot and hear a function.

## 13. Open questions

- Which math problem types must the solver support in the demo? (confirm with the prototype)
- Which Ollama model is the default, and is the demo laptop strong enough?
- Is the app shown from a local build or a hosted page? (affects Ollama access)
- Voice command: browser speech recognition, or on-device only? (see R7)
- Should the "Blind / low vision" and "Deafblind" profile cards be **hidden** or shown as **"Coming later"**?
