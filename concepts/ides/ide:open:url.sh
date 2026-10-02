#!/usr/bin/env bash
# Open a jetbrains:// link (project=NAME&path=FILE:LINE:COL) in the user's IDE
set -euo pipefail

if [ "$#" -ne 1 ]; then
  printf 'usage: cdd ide:open:url <jetbrains://...>\n' >&2
  exit 2
fi

# Desktop launches (browser links) get a bare environment
export PATH="$HOME/.local/bin:$PATH"

concept_dir="$(cd -P "$(dirname "$(realpath "${BASH_SOURCE[0]}")")" >/dev/null 2>&1 && pwd)"

url="$1"
case "$url" in
  jetbrains://*\?*) ;;
  *)
    printf 'cdd ide:open:url: not a jetbrains:// link with a query: %s\n' "$url" >&2
    exit 2
    ;;
esac

decode() {
  printf '%b' "$(printf '%s' "$1" | sed 's/+/ /g; s/%\([0-9A-Fa-f][0-9A-Fa-f]\)/\\x\1/g')"
}

query_param() {
  local pair
  for pair in ${query//&/ }; do
    if [ "${pair%%=*}" = "$1" ]; then
      decode "${pair#*=}"
      return
    fi
  done
}

query="${url#*\?}"
project="$(query_param project)"
spec="$(query_param path)"

line=""
column=""
file="$spec"
if [[ "$spec" =~ ^(.*):([0-9]+):([0-9]+)$ ]]; then
  file="${BASH_REMATCH[1]}"; line="${BASH_REMATCH[2]}"; column="${BASH_REMATCH[3]}"
elif [[ "$spec" =~ ^(.*):([0-9]+)$ ]]; then
  file="${BASH_REMATCH[1]}"; line="${BASH_REMATCH[2]}"
fi

projects_root="${CDD_PROJECTS_DIRECTORY:-$HOME/Projects}"
root="$(find "$projects_root" -maxdepth 2 -type d -name "$project" -print -quit 2>/dev/null || true)"
if [ -z "$root" ]; then
  printf 'cdd ide:open:url: project not found under %s: %s\n' "$projects_root" "$project" >&2
  exit 1
fi

# The link may carry a path from another filesystem (e.g. a docker container's
# /var/www): drop leading components until the rest exists in the project.
if [[ "$file" == /* ]]; then
  suffix="${file#/}"
  while [ -n "$suffix" ] && [ ! -e "$root/$suffix" ]; do
    case "$suffix" in
      */*) suffix="${suffix#*/}" ;;
      *) suffix="" ;;
    esac
  done
  [ -e "$file" ] || file="$root/$suffix"
else
  file="$root/$file"
fi

args=(--project "$root")
[ -z "$line" ] || args+=(--line "$line")
[ -z "$column" ] || args+=(--column "$column")

"$concept_dir/../cdd-cli-commands/kinds/ide:open" "${args[@]}" "$file" &
opener=$!

# Raise the IDE window. CDD_IDE_FOCUS_CMD overrides; otherwise i3 if present.
if [ -n "${CDD_IDE_FOCUS_CMD:-}" ]; then
  "$CDD_IDE_FOCUS_CMD" "$project" || true
elif command -v i3-msg >/dev/null 2>&1; then
  i3-msg "[class=\"^jetbrains-\" title=\"$project\"] focus" 2>&1 | grep -q '"success":true' \
    || i3-msg '[class="^jetbrains-"] focus' >/dev/null 2>&1 || true
fi

wait "$opener"
