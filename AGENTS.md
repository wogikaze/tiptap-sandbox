# Repository Guidelines

This repository is a lightweight sandbox intended for quick iteration. If you add tooling (e.g., Node, Python), keep setup minimal and documented here.

## Project Structure & Module Organization
- `src/`: Application source (components, extensions, utils). Example: `src/editor/`, `src/styles/`.
- `public/` or `assets/`: Static files served directly.
- `tests/`: Automated tests mirroring `src/` structure.
- `scripts/`: Local dev/CI helper scripts.
- `docs/`: Notes, examples, or design docs.
Create missing folders as needed; keep module paths flat and descriptive.

## Build, Test, and Development Commands
Use the package manager defined by the repo (e.g., npm/pnpm/yarn). Common patterns:
- `npm install`: Install dependencies.
- `npm run dev`: Start local dev server (hot reload if configured).
- `npm run build`: Produce a production bundle.
- `npm test`: Run unit tests in `tests/`.
If not a Node project, provide equivalent commands in `scripts/` and document them.

## Coding Style & Naming Conventions
- Indentation: 2 spaces for JS/TS/JSON; 2 or 4 for other languages consistently.
- Filenames: kebab-case for files (`rich-text-plugin.ts`), PascalCase for components (`EditorPanel.tsx`).
- Identifiers: camelCase for variables/functions; PascalCase for classes/types.
- Formatting/Linting: Prefer Prettier + ESLint (or language equivalents). Add a format script: `npm run format`.

## Testing Guidelines
- Location: `tests/` mirrors `src/` and uses `*.test.*` naming.
- Scope: Unit tests for utilities and core modules; smoke tests for UI or integration.
- Coverage: Target meaningful assertions; add coverage config when framework is introduced.
- Run: `npm test` (or framework CLI) locally and in CI.

## Commit & Pull Request Guidelines
- Commits: Use Conventional Commits (e.g., `feat:`, `fix:`, `docs:`). Keep messages imperative and concise.
- PRs: Provide a clear summary, screenshots or GIFs for UI changes, reproduction steps for bug fixes, and link related issues. Keep PRs focused and small.

## Security & Configuration Tips
- Do not commit secrets. Use `.env` and `.env.example` for safe defaults.
- Pin dependencies where possible and run audits (`npm audit` or tool-specific).

## Getting Unblocked
If a command or tool is missing, add a minimal setup (package.json or script) and update this document so others can reproduce your workflow.

## Roadmap Alignment
- Source: See `tiptapアウトライナ→共同編集ノートアプリロードマップ.md` for phased goals (P0–P12).
- Stack: React + tiptap v3, Vite, Zustand, Vitest, Playwright, ESLint/Prettier.
- Phase focus: Prioritize current phase (label PRs `phase:Pn`). Early targets (P1–P3): MVP outline editor, keyboard nav, undo/redo; perf goal ~60fps with ~1k lines.
- Editor commands: Implement split/join, indent/outdent, moveUp/moveDown, toggleCollapse. Add unit tests for commands and E2E for shortcuts (Enter, Backspace, Tab, Alt/Option arrows, Ctrl/Cmd+Enter).
- Persistence (P5): Debounced local persistence via `localStorage`/IndexedDB (e.g., Dexie). Provide JSON import/export helpers.
- Collaboration (P9+): Y.js with Hocuspocus or y-websocket; include awareness (cursors, selection). Maintain offline-first via IndexedDB + CRDT merges.
- Structure (optional mono‑repo): `/packages/editor` (tiptap UI), `/apps/web` (SPA), `/apps/server` (collab API/WebSocket).
- PR checklist: phase label, Conventional Commit, tests added/updated, performance note (data size, FPS), screenshots or GIFs for UI, brief doc update if behavior changes.
 - Current Phase: P1 — Outline MVP and core keyboard/undo.
