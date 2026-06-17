#!/usr/bin/env bash
# Compatibility wrapper for cdd init.
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

concept_dir="$(cd -P "$(dirname "$source_path")/../cdd-cli-commands" >/dev/null 2>&1 && pwd)"
exec "$concept_dir/init" "$@"
