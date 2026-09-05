#!/usr/bin/env bash
# Print the current project's slug, derived from its display name
set -euo pipefail

source_path="${BASH_SOURCE[0]}"
while [ -L "$source_path" ]; do
  source_dir="$(cd -P "$(dirname "$source_path")" >/dev/null 2>&1 && pwd)"
  source_path="$(readlink "$source_path")"
  case "$source_path" in
    /*) ;;
    *) source_path="$source_dir/$source_path" ;;
  esac
done
source_dir="$(cd -P "$(dirname "$source_path")" >/dev/null 2>&1 && pwd)"

display_name="$("$source_dir/project:displayName.sh")"

printf '%s\n' "$display_name" \
  | tr '[:upper:]' '[:lower:]' \
  | sed -E 's/[^a-z]+/-/g; s/^-+//; s/-+$//'
