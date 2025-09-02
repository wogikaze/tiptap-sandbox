# tiptap-sandbox

Quick notes for local workflow. See AGENTS.md and docs/ for deeper context.

## Project Setup

This is a React + Tiptap v3 outliner application.

### Tech Stack
- **Frontend**: React 18 + TypeScript
- **Editor**: Tiptap v3 (ProseMirror-based)
- **Build Tool**: Vite
- **Testing**: Vitest (unit), Playwright (E2E)
- **Code Quality**: ESLint + Prettier
- **State Management**: Zustand (minimal)

### Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start development server:

   ```bash
   npm run dev
   ```

3. Run tests:

   ```bash
   npm run test          # Unit tests
   npm run test:e2e      # E2E tests
   ```

4. Build for production:

   ```bash
   npm run build
   ```

### Data Model

- **Doc**: Root document containing outline items
- **OutlineItem**: Hierarchical items with attributes (id, collapsed, type, level, checked)

### Shortcuts

- Enter: Split item
- Backspace: Merge items
- Tab/Shift+Tab: Indent/Outdent
- Ctrl+↑/↓: Move within level
- Ctrl+Enter: Toggle collapse
- Alt+↑/↓: Move subtree
- Ctrl+Z/Y: Undo/Redo
- Ctrl+F: Search/Replace

## create-labels (GitHub labels setup)

This repo includes scripts to bootstrap consistent GitHub labels.

- Requirements: GitHub CLI (`gh`) installed and authenticated (`gh auth login`).
- Repo context: Run in the repo directory or pass `--repo owner/name`.

### PowerShell (Windows)

```powershell
scripts/create-labels.ps1               # uses current repo
scripts/create-labels.ps1 -Repo owner/name
```

### Bash (macOS/Linux)

```bash
bash scripts/create-labels.sh           # uses current repo
bash scripts/create-labels.sh owner/name
```

### What it creates

- Types: `type:feature`, `type:bug`, `type:chore`, `type:docs`, `type:perf`, `type:refactor`
- Phases: `phase:P0` … `phase:P12`
- Status: `status:ready`, `status:in-progress`, `status:blocked`, `status:done`
- Priority: `prio:high`, `prio:medium`, `prio:low`

Re-running is safe; existing labels are skipped by `gh label create`.

### Troubleshooting

- Ensure `gh` has repo access: `gh repo view` should succeed.
- For forks, use `--repo upstream-owner/repo` to write to upstream.
- If your shell blocks execution on Windows, allow running local scripts:
  `Set-ExecutionPolicy -Scope Process RemoteSigned`

## Roadmap Issues

- Use `scripts/new-issues.ps1` to create GitHub Issues per phase.
- Requires GitHub CLI `gh` and an authenticated repo with Issues enabled.

Examples:

- Create current phase (default P1):

  ```powershell
  pwsh ./scripts/new-issues.ps1
  ```

- Create a specific phase:

  ```powershell
  pwsh ./scripts/new-issues.ps1 -Phase P3
  ```

- Create all phases P0–P12:

  ```powershell
  pwsh ./scripts/new-issues.ps1 -All
  ```

Labels: script ensures `phase:Pn` labels exist via `scripts/create-labels.ps1`.
