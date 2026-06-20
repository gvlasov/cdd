#!/usr/bin/env bash
# Print the freshest installed CDD skill
set -euo pipefail

codex_skill="${HOME:-}/.codex/skills/concept_driven_design/SKILL.md"
claude_skill="${HOME:-}/.claude/skills/concept_driven_design/SKILL.md"

if [ ! -f "$codex_skill" ] && [ ! -f "$claude_skill" ]; then
  printf 'cdd skill:print: no installed skill found in %s or %s\n' "$codex_skill" "$claude_skill" >&2
  exit 1
fi

if [ -f "$codex_skill" ] && { [ ! -f "$claude_skill" ] || [ "$codex_skill" -nt "$claude_skill" ]; }; then
  cat "$codex_skill"
else
  cat "$claude_skill"
fi
