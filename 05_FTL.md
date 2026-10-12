# FTL — File / Folder Tree Layout

> Accessible Academic Problem Solver · Team Neurobridge · **v0.2** · 2026-10-11
> **Assumption:** *FTL* = "File Tree Layout" (exact project folder and file structure). If your source defines FTL differently, tell me and I'll rewrite this file.
> This is the **target** layout for the local-first app. **If your existing prototype already has a different structure, keep its working files and map them here** (or send me the file list and I'll align this document to it).
> Rule: if a file isn't listed here, add it here in the same commit.

## 1. Repository layout (Phase 1)

```
neurobridge-accessible-solver/
├── README.md                       # what it is, setup (Ollama + app), demo steps, scope note
├── .gitignore
├── .github/workflows/ci.yml        # lint + typecheck + unit tests + a11y smoke
├── docs/
│   ├── 01_PRD.md
│   ├── 02_FSD.md
│   ├── 03_SAD.md
│   ├── 04_TAD.md
│   └── 05_FTL.md
├── frontend/                       # the React + Vite frontend app (see §2)
├── backend/                        # Python FastAPI AI service & API (see §2.1)
└── e2e/                            # Playwright tests (see §3)
```

## 2.1 Backend (Python FastAPI)

```
backend/
├── requirements.txt
├── .env.example
├── app/
│   ├── main.py                     # FastAPI entrypoint + CORS + API routes
│   ├── core/
│   │   ├── config.py               # Pydantic settings, model defaults, API keys
│   │   └── prompts.py              # Loads system prompts from app/prompts at startup
│   ├── prompts/
│   │   ├── system_master.md        # P1 Master system prompt
│   │   ├── router.md               # P2 Router / classifier
│   │   ├── gk_protocol.md          # P3 GK answering protocol
│   │   ├── level1.md               # P4 Level 1 modifier
│   │   ├── level2.md               # P4 Level 2 modifier
│   │   ├── level3.md               # P4 Level 3 modifier
│   │   └── verifier.md             # P5 Verifier prompt
│   ├── schemas/
│   │   └── ai.py                   # Pydantic v2 schemas for Ask, Status, Facts, Router
│   ├── services/
│   │   ├── llm/
│   │   │   ├── base.py             # LLMProvider abstract interface
│   │   │   ├── openrouter_provider.py # OpenRouter Cloud provider (httpx)
│   │   │   ├── ollama_provider.py  # Local Ollama provider (httpx)
│   │   │   └── fake_provider.py    # Deterministic test provider
│   │   └── ai/
│   │       ├── router.py           # Router classifier service with fast heuristic checks
│   │       ├── facts.py            # RAG FactRetriever over data/facts/*.json
│   │       ├── cache.py            # Hash-based local response cache
│   │       └── ask_service.py      # Complete Document 06 AI pipeline & Truth rules
│   └── api/
│       └── v1/
│           └── endpoints.py        # /health, /ai/status, /facts, /ask, /ask/stream
├── data/
│   └── facts/
│       └── academic_facts.json     # Verified academic facts dataset (RAG)
├── eval/
│   ├── gk_questions.jsonl          # Benchmark test questions
│   └── results/                    # Benchmark result logs
├── scripts/
│   └── eval_gk.py                  # Evaluation scoring script (metrics §10)
└── tests/
    ├── test_ai_backend.py          # Pytest suite for pipeline & truth rules
    └── test_api_endpoints.py       # FastAPI TestClient API tests
```

## 2. Frontend

```
frontend/
├── package.json
├── tsconfig.json                   # "strict": true
├── vite.config.ts
├── tailwind.config.ts
├── postcss.config.js
├── eslint.config.js                # includes jsx-a11y
├── index.html                      # lang attribute, CSP meta/header notes
├── .env.example
├── public/
│   └── fonts/                      # self-hosted fonts (no CDN)
└── src/
    ├── main.tsx
    ├── App.tsx                     # providers + router
    ├── routes.tsx
    ├── styles/
    │   ├── index.css               # Tailwind layers
    │   └── tokens.css              # CSS variables; data-contrast / data-text-scale overrides; dark default
    │
    ├── app/                        # application shell
    │   ├── AppShell.tsx            # header + side nav + <main>
    │   ├── Header.tsx              # title, LanguageSelect, PrivacyBadge, VoiceCommandButton
    │   ├── SideNav.tsx             # nav items (no Braille / blind-specific items in v1)
    │   ├── PrivacyBadge.tsx        # "Runs on this device · nothing is uploaded" (wording per PRD R7)
    │   └── LanguageSelect.tsx
    │
    ├── accessibility/              # shared accessibility layer
    │   ├── AccessibilityContext.tsx
    │   ├── modes.ts                # mode definitions + defaults (no screen-reader / braille modes)
    │   ├── Announcer.tsx           # aria-live regions
    │   ├── useAnnounce.ts
    │   ├── VisualAlert.tsx         # banner/icon notifications (Deaf / HoH)
    │   ├── SkipLinks.tsx
    │   ├── useFocusOnMount.ts
    │   └── useKeyboardShortcuts.ts
    │
    ├── profiles/
    │   ├── learnerProfiles.ts      # active: deaf-hoh, standard  (deferred profiles NOT registered)
    │   └── ProfilePicker.tsx       # "How do you learn best?"
    │
    ├── math/                       # Module A — exact math (pure TS, no React)
    │   ├── parse.ts                # tokenizer/validator (never eval)
    │   ├── classify.ts             # supported problem types
    │   ├── solve.ts
    │   ├── steps/                  # one step generator per problem type
    │   │   ├── linear.ts
    │   │   ├── quadratic.ts
    │   │   ├── system2x2.ts
    │   │   ├── simplify.ts
    │   │   ├── derivative.ts
    │   │   └── expression.ts
    │   ├── verify.ts               # substitute back / numeric check
    │   ├── speak.ts                # math → spoken text
    │   ├── latex.ts
    │   └── __golden__/problems.json   # ≥ 50 cases used by tests
    │
    ├── ollama/                     # local LLM access (only place that talks to Ollama)
    │   ├── client.ts               # base URL, fetch helpers
    │   ├── status.ts               # connected | no-model | unreachable | blocked
    │   ├── models.ts               # /api/tags
    │   ├── stream.ts               # NDJSON chat stream + abort
    │   ├── schemas.ts              # Zod: Explanation object
    │   ├── cache.ts                # hash(question+level+model+prompt_version)
    │   ├── useOllamaStatus.ts
    │   ├── useAsk.ts
    │   └── prompts/
    │       ├── system.ts
    │       ├── level1.ts
    │       ├── level2.ts
    │       ├── level3.ts
    │       ├── clarify.ts
    │       ├── askAboutThis.ts
    │       └── checkQuestions.ts
    │
    ├── speech/                     # Modules D & E
    │   ├── useSpeechOutput.ts      # TTS, sentence/word boundary state
    │   ├── useSpeechInput.ts       # STT, feature-detected
    │   ├── voiceCommands.ts        # intent parser: solve / ask / go to / read / stop / next / previous
    │   ├── textUnits.ts            # split text into sentences/words with indices
    │   └── captionSync.ts
    │
    ├── srs/                        # Flashcards scheduling (pure TS)
    │   ├── scheduler.ts            # SM-2-style ratings → next due_at
    │   └── dueQueue.ts
    │
    ├── progress/
    │   ├── streak.ts               # streak from activity_days
    │   └── weekStrip.ts
    │
    ├── storage/                    # only place that reads/writes persistent data
    │   ├── db.ts                   # Dexie schema + versions
    │   ├── settingsStore.ts
    │   ├── historyStore.ts         # honours save_history flag at the single write point
    │   ├── flashcardStore.ts
    │   ├── activityStore.ts
    │   └── exportImport.ts         # JSON export / import / delete-all
    │
    ├── features/
    │   ├── home/
    │   │   ├── WelcomeBanner.tsx
    │   │   ├── StatsRow.tsx        # streak · problems solved · flashcards due · flashcards saved
    │   │   ├── QuickActions.tsx
    │   │   ├── WeekStrip.tsx
    │   │   └── PrivacyNote.tsx
    │   ├── solve-math/
    │   │   ├── ProblemInput.tsx
    │   │   ├── StepList.tsx        # focusable, navigable steps
    │   │   ├── CheckedStatus.tsx   # "Checked ✔ / Could not verify" (not colour-only)
    │   │   └── SolutionActions.tsx # Listen · Save as flashcard · Ask about this · Copy
    │   ├── ask/
    │   │   ├── QuestionInput.tsx
    │   │   ├── OllamaStatusPanel.tsx
    │   │   ├── ModelPicker.tsx
    │   │   ├── AnswerView.tsx      # streamed answer + limits note + flag action
    │   │   └── AskAboutThis.tsx
    │   ├── voice-learning/
    │   │   ├── ReaderView.tsx      # text with word/sentence highlighting
    │   │   └── PlaybackControls.tsx
    │   ├── captions/
    │   │   ├── CaptionBar.tsx
    │   │   ├── TranscriptPanel.tsx
    │   │   └── TranscriptSearch.tsx   # P1
    │   ├── flashcards/
    │   │   ├── DeckOverview.tsx
    │   │   ├── ReviewCard.tsx      # reveal + rate Again/Hard/Good/Easy (keys 1–4)
    │   │   └── CardEditor.tsx
    │   ├── graph-sound/            # P1
    │   │   ├── FunctionInput.tsx
    │   │   ├── GraphView.tsx       # SVG + text summary + data table
    │   │   └── useGraphSound.ts    # Web Audio
    │   ├── history/
    │   │   └── HistoryList.tsx
    │   ├── settings/
    │   │   ├── ModePanel.tsx
    │   │   ├── OllamaSettings.tsx
    │   │   ├── SpeechSettings.tsx
    │   │   └── DataControls.tsx    # Save history on/off · Export · Delete all
    │   └── voice-command/          # P1
    │       └── VoiceCommandButton.tsx
    │
    ├── pages/
    │   ├── HomePage.tsx
    │   ├── SolveMathPage.tsx
    │   ├── AskPage.tsx
    │   ├── GraphSoundPage.tsx
    │   ├── FlashcardsPage.tsx
    │   ├── VoiceLearningPage.tsx
    │   ├── HistoryPage.tsx
    │   ├── SettingsPage.tsx
    │   └── NotFoundPage.tsx
    │
    ├── components/ui/              # Button, IconButton, Dialog, Tabs, Toggle, Select, VisuallyHidden, LoadingStatus, ErrorMessage…
    ├── lib/
    │   ├── katex.tsx               # math rendering wrapper
    │   ├── sanitize.ts             # sanitise AI/Markdown output
    │   └── format.ts
    └── test/
        ├── setup.ts
        └── mocks/                  # speechSynthesis, SpeechRecognition, Ollama (MSW)
```

## 3. End-to-end tests

```
e2e/
├── playwright.config.ts
└── tests/
    ├── core-flow.spec.ts           # home → profile → solve → listen + captions → flashcard → review
    ├── a11y-pages.spec.ts          # axe on every page × (default, high contrast, 200% text)
    ├── keyboard-only.spec.ts
    ├── privacy.spec.ts             # no external network requests; history-off writes nothing; delete-all clears
    └── ollama-states.spec.ts       # connected / no model / unreachable messages
```

## 4. Deferred — intentionally NOT in the tree

These have no folders, routes, nav items or settings in v1. Create them only when the feature is actually built.

| Feature | Future location |
|---|---|
| Braille tools | `src/features/braille/` |
| Blind / low-vision & Deafblind profiles | add to `src/profiles/learnerProfiles.ts` |
| Describe What I Can't See | `src/features/describe/` (needs vision model) |
| Image / PDF input, accessible PDF reader | `src/features/documents/` (desktop / Phase 2) |
| Backend (accounts, sync, teachers) | `backend/` |
| Teacher dashboard | `src/features/teacher/` |

## 5. Naming and placement rules

| Rule | Detail |
|---|---|
| Components | `PascalCase.tsx`, one exported component per file, typed props |
| Hooks | `useThing.ts(x)`, always start with `use` |
| Pure logic | `math/`, `srs/`, `progress/` and `speech/textUnits.ts` contain **no React** — easy to unit test |
| Model access | Only through `src/ollama/` |
| Persistence | Only through `src/storage/` |
| Math results | Only from `src/math/` — never from the LLM |
| Accessibility helpers | Shared in `src/accessibility/`; don't duplicate in features |
| Network | No `fetch` outside `src/ollama/` (and none to external hosts) |
| Tests | Unit tests beside the file (`x.test.ts`); E2E in `e2e/tests/` |
| Prompts | Never inline in components; files in `src/ollama/prompts/` |

## 5. Suggested build order (vertical slices)

1. **Scaffold** — Vite + React + TS strict + Tailwind, lint with jsx-a11y, CI skeleton, tokens, self-hosted fonts.
2. **Shell + accessibility layer** — `AppShell`, `SideNav`, skip link, `AccessibilityContext`, `Announcer`, `VisualAlert`, Settings → `ModePanel` (modes working end-to-end first).
3. **Storage** — Dexie schema, settings store, history toggle, delete-all/export.
4. **Home** — profile picker (Deaf/HoH + Standard only), stats row (wired to storage), quick actions, privacy note.
5. **Solve Math** — parse → solve → steps → verify → render + spoken text; golden tests; then Save-as-flashcard hook.
6. **Voice Learning + captions** — `useSpeechOutput`, `ReaderView`, `CaptionBar`, `TranscriptPanel`, sentence fallback.
7. **Flashcards** — scheduler, due queue, review UI, Home counters.
8. **Ask a Question** — status panel, model picker, stream, levels, limits note, flag action.
9. **Progress** — streak, week strip.
10. **P1 extras** — Voice command, Graph and Sound, transcript search/edit, Ask About This, language selector.
11. **Demo hardening** — e2e + axe + keyboard run, network-tab check (no external calls), model pulled and tested on the demo laptop, README demo steps.

Each slice is done only when it meets the definition of done in `04_TAD.md §8`.
