#!/usr/bin/env bash
set -euo pipefail

cd "$(git rev-parse --show-toplevel)"

git ls-files \
  --cached \
  --others \
  --exclude-standard \
  -z \
  -- \
  '*.md' \
  ':!*.prompt.md' \
  ':(exclude,glob)**/ontology-editor/**' \
  | sort -z \
  | while IFS= read -r -d '' path; do
      echo "# ${path%.*}"
      cat "$path"
      echo
      echo
    done

echo "# concepts/agent-skills/AgentSkill.prompt.md"
cat concepts/agent-skills/AgentSkill.prompt.md
echo
echo
