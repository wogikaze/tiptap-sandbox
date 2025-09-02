param(
  [string]$Repo = ""
)

# Requires GitHub CLI (gh) authenticated and repo set (current dir or --repo).
function New-Label {
  param([string]$Name, [string]$Color, [string]$Description)
  $args = @("label", "create", $Name, "--color", $Color, "--description", $Description)
  if ($Repo) { $args += @("--repo", $Repo) }
  gh @args 2>$null | Out-Null
}

# Types
New-Label "type:feature" "1f883d" "Feature request"
New-Label "type:bug"     "d73a4a" "Bug report"
New-Label "type:chore"   "fbca04" "Chore / task"
New-Label "type:docs"    "0e8a16" "Documentation"
New-Label "type:perf"    "c2e0c6" "Performance"
New-Label "type:refactor" "a2eeef" "Refactoring"

# Phases P0–P12
"P0", "P1", "P2", "P3", "P4", "P5", "P6", "P7", "P8", "P9", "P10", "P11", "P12" |
ForEach-Object { New-Label "phase:$_" "ededed" "Roadmap phase $_" }

# Status
New-Label "status:ready"       "0e8a16" "Ready to pick up"
New-Label "status:in-progress" "0366d6" "Work in progress"
New-Label "status:blocked"     "b60205" "Blocked / waiting"
New-Label "status:done"        "5319e7" "Completed"

# Priority
New-Label "prio:high"   "b60205" "High priority"
New-Label "prio:medium" "d4c5f9" "Medium priority"
New-Label "prio:low"    "cfd3d7" "Low priority"

Write-Host "Labels ensured. Assign phase labels (e.g., phase:P1) per issue/PR."

