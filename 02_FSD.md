# FSD — Functional Specification Document

> Accessible Academic Problem Solver · Team Neurobridge · **v0.2** · 2026-10-11
> Defines **what the system does**, feature by feature, as shown in the frontend prototype. Priorities: **P0** demo-critical · **P1** if time · **P2** later · **Deferred** excluded for now.
> **Scope change in v0.2:** blind / low-vision / deafblind support is deferred (see `01_PRD.md §3.2`).

## 0. Conventions

- Requirement IDs: `FR-<code><number>`. Codes: **HOME**, **MATH**, **ASK**, **VOICE**, **CAP**, **FLASH**, **HIST**, **SET**, **GS** (Graph and Sound), **LVL**, **PRIV**, **DEF** (deferred).
- Mind-map modules A–H are mapped in the PRD scope table.
- No accounts in v1: all data lives on the learner's device (see `03_SAD.md`).
- Statements marked *(prototype)* are visible in the screenshot; others are proposed.

## 1. App shell *(prototype)*

| ID | Requirement | Pri |
|---|---|---|
| FR-SHELL1 | Header: app title, **language selector**, privacy badge ("Runs on this device · nothing is uploaded"), **Voice command** button. | P0 |
| FR-SHELL2 | Left navigation: Home · Solve a Mathematics Problem · Ask a Question · Graph and Sound · Flashcards · Voice Learning · My Learning History · Accessibility Settings. Current page marked with `aria-current="page"`. | P0 |
| FR-SHELL3 | **Braille Tools** nav item is **hidden** (or shown disabled as "Coming later") — it must not open a half-working page. | P0 |
| FR-SHELL4 | Skip link to main content; one `<h1>` per page; landmarks (`header`, `nav`, `main`). | P0 |
| FR-SHELL5 | The privacy badge wording must be accurate (see PRD R7 about browser speech recognition). | P0 |

## 2. Home *(prototype)*

| ID | Requirement | Pri |
|---|---|---|
| FR-HOME1 | **Welcome banner** with a "Solve a problem" button. Before the first solved problem, text invites the learner to start a streak. | P0 |
| FR-HOME2 | **"How do you learn best?"** profile picker. v1 active profiles: **Deaf / hard of hearing**, **Standard**. | P0 |
| FR-HOME3 | **Blind / low vision** and **Deafblind** cards are hidden or disabled with "Coming later". They must never be selectable in v1. | P0 |
| FR-HOME4 | Selecting a profile applies preset modes (§9) and can be changed any time in Settings. Standard = defaults. Deaf / HoH = Captions + visual alerts on, auto-speech off. | P0 |
| FR-HOME5 | **Stats row**: day streak, problems solved, flashcards due, flashcards saved (live from local data). | P0 |
| FR-HOME6 | **Quick-action cards** (title + short description) linking to Solve Math, Ask a Question, Graph and Sound, Flashcards, Voice Learning. | P0 |
| FR-HOME7 | **"This week"** strip (M–S) marks days with at least one solved problem. | P1 |
| FR-HOME8 | **Privacy note**: everything on this page runs in the browser; saving history is optional and can be turned off in Settings. | P0 |
| FR-HOME9 | Footer note about image/PDF input: reword to *"Image and PDF input need a local OCR or vision model and are planned for a later desktop version."* Do **not** mention "Describe what I can't see". | P0 |

## 3. Solve a Mathematics Problem — "Exact, checked, spoken steps" (module A)

| ID | Requirement | Pri |
|---|---|---|
| FR-MATH1 | Accept a problem typed as text/expression, or dictated (Voice command / mic). Show recognised text for confirmation before solving. | P0 |
| FR-MATH2 | **Exact:** results come from the on-device math engine, never from the LLM. Exact forms (fractions, radicals) are kept where applicable, with a decimal approximation if useful. | P0 |
| FR-MATH3 | **Step-by-step solution:** each step has a title, the math (rendered), and a plain-language sentence. | P0 |
| FR-MATH4 | **Checked:** after solving, the engine verifies the answer (e.g. substitute back into the equation / re-evaluate) and shows a clear "Checked ✔" or "Could not verify" status that is not conveyed by colour alone. | P0 |
| FR-MATH5 | **Spoken steps:** each step has a speakable version (math converted to words, e.g. `x^2 + 3x` → "x squared plus 3 x"); a play control reads steps aloud (see Voice Learning). | P0 |
| FR-MATH6 | **Captions/transcript** for spoken steps (§6). | P0 |
| FR-MATH7 | Supported problem types are listed on the page; an unsupported or unparseable input returns a clear message ("This type isn't supported yet") and optionally offers **Ask a Question** — it never guesses. | P0 |
| FR-MATH8 | Explanation level (1/2/3) changes the wording of step explanations, **not** the computed result. | P1 |
| FR-MATH9 | Actions on a solution: **Save as flashcard**, **Ask about this step**, **Listen**, **Copy**. | P0 / P1 |
| FR-MATH10 | A completed solve increments *problems solved* and today's activity (if history/progress saving is on). | P0 |

**Initial supported types (proposal — align with the prototype's engine):** arithmetic and expression evaluation, simplification, linear equations, quadratic equations, systems of two linear equations, basic derivatives. Everything else = FR-MATH7 behaviour.

**Acceptance**
- *Given* `2x + 6 = 14`, *then* steps lead to `x = 4`, status "Checked", and the spoken form reads without symbols spoken wrongly.
- *Given* an unsupported expression, *then* no answer is invented.

## 4. Ask a Question — "Uses your local Ollama" (modules A, F, G)

| ID | Requirement | Pri |
|---|---|---|
| FR-ASK1 | Free-text question (≤ 2,000 chars) or dictated. | P0 |
| FR-ASK2 | **Ollama status panel:** shows *connected / not found / blocked*, selected model, and the address (default `http://localhost:11434`, configurable in Settings). | P0 |
| FR-ASK3 | If Ollama is not reachable, show plain setup help: install Ollama, start it, pull a model, and (if the app is not on localhost) allow the app's origin. No error codes shown alone. | P0 |
| FR-ASK4 | **Model chooser** listing locally installed models; remembers the choice. | P0 |
| FR-ASK5 | **Streaming** answer; announce progress politely (per paragraph/sentence, not per token). | P0 |
| FR-ASK6 | Answer uses the chosen **level** (§7). If the question is incomplete, ask at most 2 clarifying questions or state assumptions. | P0 |
| FR-ASK7 | Every answer shows an **AI-limits note** and a **"Flag as incorrect"** action (stored locally). | P0 |
| FR-ASK8 | After an answer, offer **2–3 check questions** and **Save as flashcard**. | P1 |
| FR-ASK9 | **Ask about this:** select an answer paragraph or math step and ask a follow-up anchored to it. | P1 |
| FR-ASK10 | Conversation context is kept for follow-ups within the session; saved to history only if history is on. | P0 |
| FR-ASK11 | Cancel button stops generation. | P0 |

## 5. Voice Learning — "Listen with word highlighting" (modules D, E)

| ID | Requirement | Pri |
|---|---|---|
| FR-VOICE1 | **Text-to-speech** reads: a solved problem's steps, an answer, a flashcard, or pasted/typed text. | P0 |
| FR-VOICE2 | **Word highlighting:** the word currently being spoken is highlighted; if the voice does not report word boundaries, fall back to **sentence** highlighting. | P0 |
| FR-VOICE3 | Controls: play / pause / stop, previous / next sentence, **speed (0.75×–2×)**, voice choice. Fully keyboard operable. | P0 |
| FR-VOICE4 | Highlight must not rely on colour only (use underline/outline + sufficient contrast), and respects reduced motion. | P0 |
| FR-VOICE5 | Click/Enter on a sentence starts reading from there (**sentence replay**). | P1 |
| FR-VOICE6 | Feature-detect speech synthesis; if unavailable, show a message and keep text readable. | P0 |
| FR-VOICE7 | In **Deaf / HoH** profile, auto-speech is off by default; captions are always on. | P0 |

### Voice command *(header button, prototype)*

| ID | Requirement | Pri |
|---|---|---|
| FR-VOICE8 | Mic button toggles listening, with a **visible and text** listening state (not sound-only). | P1 |
| FR-VOICE9 | Commands: "solve …", "ask …", "go to home / flashcards / history / settings", "read this", "stop", "next step", "previous step", "repeat". | P1 |
| FR-VOICE10 | Recognised text is shown; the user can cancel before an action runs. Unknown commands show a helpful message. | P1 |
| FR-VOICE11 | Recognition language follows the language selector (default English; default locale `en-IN` where available). | P1 |
| FR-VOICE12 | If speech recognition is unavailable, hide or disable with an explanation. | P1 |

## 6. Captions and transcript (module D)

| ID | Requirement | Pri |
|---|---|---|
| FR-CAP1 | Any spoken output shows **captions** in sync (sentence level; word level where available). | P0 |
| FR-CAP2 | A **transcript panel** contains the full text of the spoken content. | P0 |
| FR-CAP3 | **Visual notifications** replace sound cues (banner + icon for "Answer ready", "Checked", "Card due"). | P0 |
| FR-CAP4 | Transcript is **searchable**, with matches highlighted and jump-to-match. | P1 |
| FR-CAP5 | Transcript is **editable** (corrections saved with the history item). | P1 |
| FR-CAP6 | Important-section highlighting (definitions, formulas, final answer). | P1 |
| FR-CAP7 | Captions for uploaded audio/video files. | Deferred (needs speech-to-text model) |

## 7. Adaptive explanation levels (module G)

| Level | Audience | Style |
|---|---|---|
| **1 — Very simple** | Foundation | Plain language, short sentences, everyday analogies, key-term glossary |
| **2 — Student** | Standard academic / engineering | Textbook-level, correct terminology, worked steps |
| **3 — Advanced** | Advanced learners | Technical, in-depth, edge cases |

| ID | Requirement | Pri |
|---|---|---|
| FR-LVL1 | Level selector on Solve Math and Ask a Question; default from settings. | P0 |
| FR-LVL2 | Changing level re-explains the **same** problem/question; results cached locally per level. | P1 |
| FR-LVL3 | One-click "Explain simpler" / "Go deeper". | P1 |
| FR-LVL4 | *Simplified learning* mode sets Level 1 and shows one step at a time. | P0 |

## 8. Flashcards — "Spaced repetition" *(prototype)*

| ID | Requirement | Pri |
|---|---|---|
| FR-FLASH1 | Create a card from a solved step / final answer / AI answer ("Save as flashcard"), or manually (front, back). Cards are editable and deletable. | P0 |
| FR-FLASH2 | **Due queue:** cards with `due_at ≤ now`; the Home stat *flashcards due* equals this count. | P0 |
| FR-FLASH3 | Review flow: show front → reveal back → rate **Again / Hard / Good / Easy** (buttons and keys 1–4). | P0 |
| FR-FLASH4 | Scheduling uses a simple SM-2-style algorithm (see below); it runs on-device. | P0 |
| FR-FLASH5 | Cards can be read aloud (Voice Learning) and have captions. | P1 |
| FR-FLASH6 | Math on cards is rendered and has a spoken form. | P1 |
| FR-FLASH7 | Empty states explain how to save the first card. | P0 |

**Scheduling (proposal, tune later):** each card stores `ease` (start 2.5, min 1.3), `interval_days`, `reps`, `due_at`.
- *Again:* `reps=0`, `interval=1`, `ease −0.2`
- *Hard:* `interval = max(1, interval × 1.2)`, `ease −0.15`
- *Good:* first review 1 day, second 3 days, then `interval × ease`
- *Easy:* `interval × ease × 1.3`, `ease +0.15`

## 9. Accessibility Settings and modes (module H)

Combinable modes — no separate websites.

| Mode | Concrete effect | v1 |
|---|---|---|
| Captions | Caption bar + transcript on for all spoken output | ✔ |
| Visual alerts | Banner/icon notifications instead of sound-only cues | ✔ |
| Voice | Auto-read answers; mic prominent | ✔ |
| Keyboard navigation | Visible focus, shortcuts, roving focus across steps | ✔ |
| Large text | 125% / 150% / 200% scale (rem-based), no horizontal scroll at 200% | ✔ |
| High contrast | Dedicated tokens (text ≥ 7:1 target) | ✔ |
| Simplified learning | Level 1, reduced UI, one step at a time | ✔ |
| Visual mode | Step cards, icons, graph summaries (never colour-only) | P1 |
| Screen-reader-optimised mode | — | **Deferred** |
| Braille output | — | **Deferred** |

| ID | Requirement | Pri |
|---|---|---|
| FR-SET1 | Modes toggle independently and combine; changes apply immediately. | P0 |
| FR-SET2 | Settings persist on the device (browser storage wrapped in try/catch with safe defaults). | P0 |
| FR-SET3 | Also in Settings: **default level**, **Ollama address and model**, **speech voice and speed**, **language**, **Save history on/off**, **Export my data**, **Delete all my data**. | P0 |
| FR-SET4 | Respect `prefers-reduced-motion`, `prefers-contrast`, `prefers-color-scheme` as defaults (dark theme is the default look). | P1 |
| FR-SET5 | Settings page is fully keyboard operable and reachable from every page. | P0 |

## 10. My Learning History and privacy (modules new / PRIV)

| ID | Requirement | Pri |
|---|---|---|
| FR-HIST1 | List past solved problems and answered questions (date, type, title), newest first; open one to review steps/answer. | P0 |
| FR-HIST2 | History is saved **only if "Save history" is on**; turning it off stops saving. Existing items remain until deleted (ask before keeping/deleting). | P0 |
| FR-HIST3 | Delete one item, or **delete all local data** (with confirmation). | P0 |
| FR-HIST4 | Export / import data as a JSON file. | P1 |
| FR-PRIV1 | **No network requests** to external hosts during normal use, except the configured local Ollama address (and browser speech services — see PRD R7). No analytics, no third-party fonts or scripts. | P0 |
| FR-PRIV2 | Privacy wording in the UI must match actual behaviour. | P0 |

## 11. Graph and Sound *(prototype nav item — "See it, hear it")* (P1)

| ID | Requirement | Pri |
|---|---|---|
| FR-GS1 | Enter a function `y = f(x)` (reuse the math parser); plot it with labelled axes, a text summary (intercepts, increasing/decreasing, extrema where the engine can compute them) and a data table alternative. | P1 |
| FR-GS2 | **Sound:** play the graph as a pitch that follows y-values using the Web Audio API; play/stop and speed controls; a visual playhead mirrors the sound. | P1 |
| FR-GS3 | Sound is never the only way to get the information (summary + table always available). | P1 |
| FR-GS4 | Haptic ("feel it") and Braille output: **Deferred**. | Deferred |

## 12. Deferred features (do not build in v1)

| Feature | Reason | Revisit when |
|---|---|---|
| Blind / low-vision and Deafblind profiles | Cannot support currently | After a vision model + testing with these learners |
| Braille Tools | Needs Braille engine and hardware testing | Phase 3 |
| Describe What I Can't See (module B) | Needs vision model | Desktop version |
| Image / PDF input, accessible PDF reader (module C) | Needs local OCR / vision model | Desktop version |
| Screen-reader-optimised mode | Needs dedicated design and testing | Phase 3 |
| Accounts, teacher features | Needs backend | Phase 2 |
| Captions for uploaded audio/video | Needs speech-to-text model | Phase 2 |

## 13. Cross-cutting requirements

### Accessibility of our own UI (all screens)
- Target **WCAG 2.2 AA**. Everything operable by keyboard; no focus traps; visible focus indicator.
- Every control has an accessible name; colour is never the only carrier of meaning; touch targets ≥ 24×24 CSS px.
- Streaming text and status changes are announced politely, in chunks, never token by token.
- No auto-playing audio unless Voice mode is on; respect reduced motion.
- Dark theme with sufficient contrast is the default; high-contrast mode available.

### Non-functional
| Area | Requirement |
|---|---|
| Privacy | Data stays on the device; history optional; one-click delete |
| Performance | UI interactions ≤ 200 ms; math results ≤ 1 s for supported types; first AI token depends on model/hardware (target ≤ 5 s on the demo laptop) |
| Reliability | Every failure has a plain-language message and a next step |
| Browsers | Latest Chrome, Edge, Firefox; Safari best-effort; speech features feature-detected |
| Offline | Core features work with no internet once the app is loaded and Ollama has a model |

## 14. Error handling

| Situation | Behaviour |
|---|---|
| Ollama not running / unreachable / blocked | Status panel + setup steps; keep the user's question; offer Retry |
| No model installed | Explain how to pull one; link to Settings |
| Model too slow / times out | Show progress; offer Cancel and "use smaller model" hint |
| Math input can't be parsed | Show what was understood; ask the user to rephrase; offer Ask a Question |
| Math cannot be verified | Show "Could not verify" prominently; never show as "Checked" |
| Speech API unavailable | Message + fall back to on-screen text |
| Storage unavailable / full | Warn that history won't be saved; continue working |
