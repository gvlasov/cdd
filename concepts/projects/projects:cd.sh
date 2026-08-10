#!/usr/bin/env bash
# Resolve the absolute path of a project directory from CDD_PROJECTS_DIRECTORY
set -euo pipefail

usage() {
  printf 'usage: cdd projects:cd <project>\n' >&2
  exit 2
}

[ "$#" -eq 1 ] || usage

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
exec "$source_dir/projects.sh" pwd "$1"
