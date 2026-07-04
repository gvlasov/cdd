#!/usr/bin/env bash
# Installs CDD methodology as Claude Code skill in ~/.claude/skills
set -e

source_path="${BASH_SOURCE[0]}"
while [ -L "$source_path" ]; do
  source_dir="$(cd -P "$(dirname "$source_path")" >/dev/null 2>&1 && pwd)"
  source_path="$(readlink "$source_path")"
  case "$source_path" in
    /*) ;;
    *) source_path="$source_dir/$source_path" ;;
  esac
done
concept_dir="$(cd -P "$(dirname "$source_path")" >/dev/null 2>&1 && pwd)"

skill_dir="$HOME/.claude/skills/cdd"
reference_dir="$skill_dir/references"

"$concept_dir/install-generated.sh" "$skill_dir" "$reference_dir"

echo "Installed cdd skill to ~/.claude/skills/cdd/SKILL.md"
