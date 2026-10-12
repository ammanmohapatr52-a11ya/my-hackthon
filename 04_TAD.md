# TAD — Technical Architecture Document

> Accessible Academic Problem Solver · Team Neurobridge · **v0.2** · 2026-10-11
> Concrete **technology choices, standards, configuration and tooling** for the local-first app. Structure and flows are in `03_SAD.md`.
> Versions: use the latest stable at project start and **pin them in the lockfile** (`package-lock.json`).
> Items marked **(confirm)** depend on what the existing prototype already uses — keep the prototype's choice if it differs.

## 1. Technology stack (Phase 1)

| Concern | Choice |
|---|---|
| Framework | React + **TypeScript (strict)**, built with Vite |
| Styling | Tailwind CSS + CSS-variable design tokens (dark theme default; high-contrast and large-text overrides) |
| Routing | React Router |
| Forms / validation | React Hook Form + Zod |
| Local database | IndexedDB through **Dexie** (confirm) |
| Settings / simple flags | Same IndexedDB `settings` store (browser `localStorage` only as a guarded fallback) |
| Math engine | **Client-side CAS/parser library — to be chosen (confirm):** candidates are math.js (parse/evaluate/simplify), Nerdamer, Algebrite; step traces written by our own `steps.ts` for each supported problem type |
| Math rendering | KaTeX (with MathML/`aria-label` fallback and our own spoken text) |
| LLM | **Ollama REST API** from the browser (no SDK required) |
| Speech | Web Speech API: `speechSynthesis` (TTS, boundary events) and `SpeechRecognition` (STT), wrapped in hooks |
| Graph & sound | SVG/canvas plotting (own small plotter or a light library) + **Web Audio API** for tones |
| Spaced repetition | Own `scheduler.ts` (SM-2-style) |
| Lint / format | ESLint + `eslint-plugin-jsx-a11y`, Prettier |
| Unit tests | Vitest + Testing Library (+ MSW to mock Ollama) |
| E2E / a11y | Playwright + `@axe-core/playwright` |
| Hosting | Local build for the demo; optional static host (Vercel) |

**No backend in Phase 1.** The Phase 2 backend (FastAPI + SQLAlchemy + PostgreSQL + S3, as in the pitch deck) is described in §11.

## 2. Configuration

Build-time defaults (`frontend/.env.example`):
```
VITE_OLLAMA_BASE_URL=http://localhost:11434
VITE_DEFAULT_MODEL=            # set after testing models on the demo laptop
VITE_PROMPT_VERSION=v1
VITE_DEFAULT_LANGUAGE=en
VITE_SPEECH_LOCALE=en-IN
```
Runtime settings (user-editable, stored in IndexedDB): Ollama URL, selected model, level, voice, speed, language, modes, `save_history`.

## 3. Setup (target workflow)

```bash
# 1) AI runtime (once, with internet)
#    Install Ollama from ollama.com, then pull a model:
ollama pull <model-name>
ollama list                     # confirm the model is installed

# 2) App
cd frontend
npm install
cp .env.example .env
npm run dev                     # http://localhost:5173
```

If the app is served from an origin other than localhost, start Ollama with that origin allowed, for example:
```bash
# macOS / Linux
OLLAMA_ORIGINS="https://your-app-origin" ollama serve
# Windows (PowerShell), set the variable, then restart Ollama
$env:OLLAMA_ORIGINS="https://your-app-origin"
```
**Demo checklist:** model pulled in advance · Ollama running before opening the app · browser tested · app run locally (safest) · no internet assumed.

## 4. Ollama integration

| Need | Call |
|---|---|
| Is Ollama running? List installed models | `GET {base}/api/tags` |
| Chat / answer (streaming) | `POST {base}/api/chat` with `{ model, messages, stream: true, options }` — response is newline-delimited JSON chunks |
| Structured output | `format` field (`"json"` or a JSON schema) where the model/Ollama version supports it |
| Cancel | Abort the `fetch` with `AbortController` |

Rules:
1. All access lives in `src/ollama/` (`client.ts`, `status.ts`, `stream.ts`). Components use hooks (`useOllamaStatus`, `useAsk`).
2. Status states: `checking | connected | no-model | unreachable | blocked`. Distinguish "blocked" (CORS / mixed content / permission) from "unreachable" when the browser exposes enough information; otherwise show combined guidance.
3. Timeouts and retries: connect check ≤ 3 s; stream stall timeout with a visible "still working / cancel".
4. Never send data anywhere except the configured base URL.
5. Local models vary in quality: validate structured output with Zod and allow **one** repair retry; otherwise fall back to showing the plain text answer.

## 5. Math engine standards

Pipeline: `parse → classify → solve → steps → verify → render + speak`.

| Stage | Rule |
|---|---|
| Parse | Own tokenizer/validator in front of the library; **never `eval`**; reject unsupported syntax with a helpful message |
| Classify | Map to a supported type: expression, simplification, linear equation, quadratic equation, 2×2 linear system, basic derivative *(proposal — match the prototype)* |
| Solve | Library or own algorithm; exact forms preserved (fractions/radicals); decimals as a secondary view |
| Steps | Each type has a dedicated step generator returning `{ title, math (LaTeX), text, spoken }` |
| Verify | Substitute solutions back, or compare numeric evaluation at test points; result `checked: true/false` |
| Speak | `speech_text.ts` converts LaTeX/ASCII math to words (e.g. `x^2` → "x squared", `\frac{a}{b}` → "a over b") |
| Tests | Golden test file of ≥ 50 problems (inputs, expected answers, expected spoken text) run in CI |

LLM may **explain** (rephrase step text per level) but must never change the computed answer; if used, the engine's answer is passed in as fixed data and the output is checked to contain it.

## 6. LLM output contracts

### Explanation object (Ask a Question — structured mode)
```json
{
  "is_complete": true,
  "clarifying_questions": ["string"],
  "assumptions": ["string"],
  "level": 1,
  "summary": "string",
  "steps": [{ "n": 1, "title": "string", "body": "markdown", "spoken": "string" }],
  "answer": "string",
  "key_terms": [{ "term": "string", "meaning": "string" }],
  "check_questions": [{ "question": "string", "answer_key": "string" }],
  "limits_note": "string"
}
```
If the local model cannot produce valid JSON reliably, use **plain streamed text** with simple paragraph structure and generate captions/spoken text from the sentences on the client.

### Prompt rules
- Prompts live as versioned files/modules in `src/ollama/prompts/`; `VITE_PROMPT_VERSION` is part of the cache key.
- Level prompts: **L1** plain language + analogies + glossary · **L2** standard academic · **L3** technical, in-depth.
- Forbid: invented facts, "as you can see", and references to visuals the model cannot see.
- User/pasted text is delimited as **data**; instructions inside it are ignored.
- Always include the limits note; keep answers short enough to speak.

## 7. Frontend technical standards

1. **Accessibility is a build gate:** `jsx-a11y` errors fail lint; axe runs on every main page in default, high-contrast and large-text states.
2. **Semantic HTML first**; ARIA only where native elements can't do the job; one `<h1>` per page.
3. **Announcer:** one `<Announcer />` (polite + assertive regions) with `useAnnounce()`; announce per step / paragraph, never per token.
4. **Visual alerts:** every sound cue or status change also has a visible, text-labelled banner/icon (Deaf / HoH support).
5. **Focus management:** after route change focus the page `<h1>`; after solving, focus the result heading; dialogs return focus to their trigger.
6. **Modes:** `AccessibilityContext` sets `data-*` attributes on `<html>` (e.g. `data-contrast="high"`, `data-text-scale="150"`); CSS variables react — no per-component mode styling.
7. **Word highlighting:** `useSpeechOutput` exposes `{ currentSentence, currentWord }`; if `boundary` events don't fire for the chosen voice, switch to sentence-level and say so in the UI.
8. **Speech recognition:** feature-detect; show listening state visibly (text + icon); display the recognised text before acting.
9. **No external network:** self-host fonts; no CDN scripts; add a Content-Security-Policy with `connect-src 'self'` plus the Ollama address.
10. **Storage:** every storage operation in try/catch with a safe default; honour the `save_history` flag at the single write point.
11. **Deferred features:** no routes, nav items, or settings for Braille, blind-specific profiles or image/PDF input exist in the codebase until they are built (or they render a clear "Coming later" state).
12. **State:** server-less app — UI state via context, persisted state via Dexie live queries/hooks.

## 8. Testing strategy

| Layer | Tool | What |
|---|---|---|
| Math | Vitest | Golden problem set; verify step; spoken-text conversion |
| SRS | Vitest | Scheduler tables for all four ratings; due queue; streak calculation across midnight/timezone |
| Ollama client | Vitest + MSW | Connected / no model / unreachable; stream parsing; cancel; invalid JSON repair |
| Components | Testing Library | Profile picker (deferred profiles not selectable), stats, flashcard review keys |
| Speech | Mocked `speechSynthesis` / `SpeechRecognition` | Highlight fallback, unavailable-API states |
| Automated a11y | Playwright + axe | Each page × (default, high contrast, 200% text) |
| E2E | Playwright | Home → profile → solve → listen with captions → save flashcard → review → history off |
| Manual | Keyboard-only run; deaf / hard-of-hearing user feedback; basic screen-reader smoke test to catch markup bugs (not a support claim) | Before the demo |

**Definition of done:** keyboard operable · visible focus · captions/visual alerts present · axe clean · tests added · no external requests (checked in the browser network tab) · no console errors.

## 9. Performance and resource notes
- Local models consume memory/CPU: default to a smaller model for the demo; allow switching in Settings.
- Debounce nothing that affects accessibility feedback; stream results early.
- Keep the bundle lean (lazy-load Graph & Sound and KaTeX fonts only when needed).
- Cache AI answers locally by `hash(question + level + model + prompt_version)`.

## 10. Security and privacy checklist
- [ ] No analytics, trackers, external fonts, CDN scripts
- [ ] CSP in place (`connect-src` limited)
- [ ] Math input never `eval`-ed; AI/Markdown output sanitised
- [ ] Privacy badge text matches real behaviour (speech caveat decided)
- [ ] "Save history" off truly stops writes; "Delete all data" clears every store
- [ ] `npm audit` run before the demo

## 11. Phase 2 (deferred): backend and desktop

Kept for alignment with the pitch deck; **not part of the v1 build**.

| Area | Plan |
|---|---|
| Backend | Python 3.11+ · FastAPI · SQLAlchemy 2.x + Alembic · PostgreSQL · JWT auth |
| Storage | S3 or compatible bucket for uploaded materials |
| Processing | Local/desktop OCR or vision model for image and PDF input; PDF text extraction |
| Features | Accounts, sync of history/flashcards, teacher material upload and learning history, accessible PDF reader |
| Hosting | Render (backend + managed Postgres), Vercel (frontend) |
| Migration path | Phase 1 `storage/` and `ollama/` modules sit behind interfaces; add a sync adapter instead of rewriting the UI |

## 12. Deployment (Phase 1)
- Demo: run the app locally with Ollama on the same machine.
- Optional: build static files (`npm run build`) and host on a static host. If hosted over HTTPS, test calling a local Ollama from that page in the demo browser **before** relying on it.
