# Requires: GitHub CLI (`gh`) and repo with Issues enabled.
# Creates issues for phases P0–P12 based on the roadmap, with labels.
param(
  [string]$Phase = "P1",
  [switch]$All
)

# Basic guards
if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
  Write-Error "GitHub CLI 'gh' is required. Install from https://cli.github.com/"; exit 1
}

# Ensure labels exist (reuses our scripts if present)
$labelsPs1 = Join-Path $PSScriptRoot 'create-labels.ps1'
if (Test-Path $labelsPs1) {
  & $labelsPs1
}

# Roadmap path (resolve literal name containing non-ASCII safely)
$repoRoot = Resolve-Path (Join-Path $PSScriptRoot '..')
$roadmapFile = Get-ChildItem -LiteralPath $repoRoot -Filter '*ロードマップ.md' | Select-Object -First 1
if (-not $roadmapFile) { Write-Error 'Roadmap file not found (pattern *ロードマップ.md)'; exit 1 }
$roadmapPath = $roadmapFile.FullName
$raw = Get-Content -Raw -LiteralPath $roadmapPath

# Helper: build issue for one phase
function New-PhaseIssue {
  param(
    [Parameter(Mandatory)] [string]$Phase
  )

  $title = "${Phase}: ロードマップ実行タスク"

  # Grab section by phase header markers like "**P1: ...**" until next "**P"
  $pattern = "\*\*${Phase}:([\s\S]*?)(?=\*\*P[0-9]{1,2}:|\Z)"
  $m = [regex]::Match($raw, $pattern)
  if (-not $m.Success) {
    Write-Warning "Phase section not found for $Phase. Skipping."
    return
  }

  $section = $m.Groups[1].Value.Trim()

  # Build body with checklists from bullets
  $lines = $section -split "`n" | Where-Object { $_.Trim() -ne '' }
  $checklist = @()
  foreach ($line in $lines) {
    $t = ($line -replace '^\s*-\s*', '').Trim()
    if ($t -ne '') { $checklist += "- [ ] $t" }
  }

  $body = @()
  $body += "フェーズ: ${Phase}"
  $body += "\n概要: ロードマップに基づく実装タスクのトラッキング。"
  $body += "\n受け入れ基準や補足はロードマップ記載を参照。"
  if ($checklist.Count -gt 0) {
    $body += "\nタスク:"
    $body += ($checklist -join "`n")
  }
  $bodyText = $body -join "`n`n"

  $labels = @("phase:${Phase}", "type:task")

  # Create or ensure issue doesn't duplicate by title
  $existing = gh issue list --search "in:title $title" --json number,title | ConvertFrom-Json
  if ($existing -and $existing.title -contains $title) {
    Write-Host ("Issue already exists for {0}: {1}" -f $Phase,$title); return
  }

  gh issue create --title $title --body $bodyText --label ($labels -join ',') | Out-Host
}

if ($All) {
  0..12 | ForEach-Object { New-PhaseIssue -Phase ("P{0}" -f $_) }
} else {
  New-PhaseIssue -Phase $Phase
}
