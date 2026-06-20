#!/usr/bin/env bash
# List, resolve, or print projects from CDD_PROJECTS_DIRECTORY
set -euo pipefail

usage() {
  printf 'usage: cdd projects <ls|cd|pwd> [project]\n' >&2
  exit 2
}

projects_root_input="${CDD_PROJECTS_DIRECTORY:-$HOME/Projects}"
if ! projects_root="$(cd "$projects_root_input" >/dev/null 2>&1 && pwd -P)"; then
  printf 'cdd projects: projects directory not found: %s\n' "$projects_root_input" >&2
  exit 1
fi

list_projects() {
  local project_path

  shopt -s nullglob
  for project_path in "$projects_root"/*; do
    [ -d "$project_path" ] || continue
    basename "$project_path"
  done
}

resolve_project() {
  local project_name="$1"
  local project_path="$projects_root/$project_name"

  if [ ! -d "$project_path" ]; then
    printf 'cdd projects: project not found: %s\n' "$project_name" >&2
    exit 1
  fi

  cd "$project_path" >/dev/null 2>&1 && pwd -P
}

case "${1:-ls}" in
  ls)
    if [ "$#" -eq 0 ]; then
      set -- ls
    fi
    [ "$#" -eq 1 ] || usage
    list_projects
    ;;
  cd|pwd)
    [ "$#" -eq 2 ] || usage
    resolve_project "$2"
    ;;
  *)
    usage
    ;;
esac
