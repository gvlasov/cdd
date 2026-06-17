#!/usr/bin/env bash
# Open a file in the user's editor.
set -euo pipefail

if [ "$#" -ne 1 ]; then
  printf 'usage: cdd ide <file>\n' >&2
  exit 2
fi

file="$1"
if command -v realpath >/dev/null 2>&1; then
  file="$(realpath "$file")"
elif command -v readlink >/dev/null 2>&1; then
  file="$(readlink -f "$file")"
fi

concept_dir="$(cd -P "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"
editor_command="$("$concept_dir/../cdd-cli-commands/ide:which")"
exec "$editor_command" "$file"
