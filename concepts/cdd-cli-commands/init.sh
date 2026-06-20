#!/usr/bin/env bash
# Initialize a CDD directory structure and Git repository
set -euo pipefail

target="${1:-.}"
cdd_home="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." >/dev/null 2>&1 && pwd)"
directories_file="$cdd_home/concepts/project-directories/directories-list.json"

if [ ! -f "$directories_file" ]; then
  printf 'cdd init: missing project directories list: %s\n' "$directories_file" >&2
  exit 1
fi

while IFS= read -r directory; do
  [ -n "$directory" ] || continue
  mkdir -p "$target/$directory"
done < <(sed -n 's/^[[:space:]]*"\([^"]\+\)".*$/\1/p' "$directories_file")

git -C "$target" init >/dev/null 2>&1

printf 'Initialized CDD directory structure in %s\n' "$target"
