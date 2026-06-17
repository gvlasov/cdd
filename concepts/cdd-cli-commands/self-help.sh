#!/usr/bin/env bash
# Print cdd command subcommands.
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
grey='\033[37m'
reset='\033[0m'

print_command() {
    local name="$1"
    local desc="${2:-}"

    if [ -n "$desc" ]; then
        desc="$(echo "$desc" | sed 's/./\L&/')"
        echo -e "$name ${grey}- $desc${reset}"
    else
        echo "$name"
    fi
}

for filepath in "$concept_dir"/*; do
    [ -f "$filepath" ] || continue
    [ -x "$filepath" ] || continue
    case "$(basename "$filepath")" in
        *.sh) continue ;;
    esac
    name="cdd $(basename "$filepath")"
    desc=$(tail -n +2 "$filepath" | awk 'NF && /^#/ { print; exit }' | sed 's/^#[[:space:]]*//')
    print_command "$name" "$desc"
done
