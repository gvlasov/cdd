#!/usr/bin/env bash
# Print the current project's display name from /project/name
set -euo pipefail

repo_root="$(git rev-parse --show-toplevel 2>/dev/null)" || repo_root="$(pwd)"
name_file="$repo_root/project/name"

if [ ! -f "$name_file" ]; then
  printf 'cdd project:displayName: no such file: %s\n' "$name_file" >&2
  exit 1
fi

head -n 1 "$name_file"
