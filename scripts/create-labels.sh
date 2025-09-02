#!/usr/bin/env bash
set -euo pipefail

# Requires GitHub CLI (gh) authenticated and repo set (current dir or --repo).
REPO=${1:-}

new_label() {
  local name="$1"; local color="$2"; local desc="$3"
  if [[ -n "$REPO" ]]; then
    gh label create "$name" --color "$color" --description "$desc" --repo "$REPO" >/dev/null 2>&1 || true
  else
    gh label create "$name" --color "$color" --description "$desc" >/dev/null 2>&1 || true
  fi
}

# Types
new_label "type:feature"  "1f883d" "Feature request"
new_label "type:bug"      "d73a4a" "Bug report"
new_label "type:chore"    "fbca04" "Chore / task"
new_label "type:docs"     "0e8a16" "Documentation"
new_label "type:perf"     "c2e0c6" "Performance"
new_label "type:refactor" "a2eeef" "Refactoring"

# Phases P0–P12
for p in {0..12}; do new_label "phase:P${p}" "ededed" "Roadmap phase P${p}"; done

# Status
new_label "status:ready"       "0e8a16" "Ready to pick up"
new_label "status:in-progress" "0366d6" "Work in progress"
new_label "status:blocked"     "b60205" "Blocked / waiting"
new_label "status:done"        "5319e7" "Completed"

# Priority
new_label "prio:high"   "b60205" "High priority"
new_label "prio:medium" "d4c5f9" "Medium priority"
new_label "prio:low"    "cfd3d7" "Low priority"

echo "Labels ensured. Assign phase labels (e.g., phase:P1) per issue/PR."

