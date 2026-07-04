#!/usr/bin/env bash
# Install generated CDD skill outputs into a destination directory.
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

concept_dir="$(cd -P "$(dirname "$source_path")" >/dev/null 2>&1 && pwd)"
destination_skill_dir="${1:?destination skill directory required}"
destination_reference_dir="${2:?destination reference directory required}"

cache_dir="${CDD_SKILL_INSTALL_CACHE_DIR:-}"

install_from_cache() {
  local source_cache_dir="$1"

  mkdir -p "$destination_skill_dir" "$destination_reference_dir"
  command -p install -m 0644 "$source_cache_dir/SKILL.md" "$destination_skill_dir/SKILL.md"
  command -p install -m 0644 "$source_cache_dir/concepts.md" "$destination_reference_dir/concepts.md"
}

build_cache() {
  local target_cache_dir="$1"

  mkdir -p "$target_cache_dir"
  (
    cd "$concept_dir"
    ./build > "$target_cache_dir/SKILL.md"
    ./build-concepts-reference > "$target_cache_dir/concepts.md"
  )
}

if [ -n "$cache_dir" ]; then
  if [ ! -f "$cache_dir/SKILL.md" ] || [ ! -f "$cache_dir/concepts.md" ]; then
    build_cache "$cache_dir"
  fi
  install_from_cache "$cache_dir"
else
  temp_cache_dir="$(mktemp -d)"
  trap 'rm -rf "$temp_cache_dir"' EXIT
  build_cache "$temp_cache_dir"
  install_from_cache "$temp_cache_dir"
fi
