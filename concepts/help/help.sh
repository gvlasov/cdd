#!/usr/bin/env bash
# Print commands and their descriptions from project command directories, or help for one command
set -euo pipefail

dirs=(./commands ./concepts/plans ./concepts/projects ./concepts/ides)
grey='\033[37m'
reset='\033[0m'
seen=' cdd '

print_command() {
    local name="$1"
    local desc="${2:-}"

    if [ -n "$desc" ]; then
        desc="${desc,,}"
        echo -e "$name ${grey}- $desc${reset}"
    else
        echo "$name"
    fi
}

command_description() {
    local filepath="$1"
    tail -n +2 "$filepath" | awk 'NF && /^#/ { print; exit }' | sed 's/^#[[:space:]]*//'
}

if [ "$#" -eq 1 ]; then
    command_name="$1"

    for dir in "${dirs[@]}"; do
        [ -d "$dir" ] || continue

        filepath="$dir/$command_name"
        [ -f "$filepath" ] && [ -x "$filepath" ] || continue

        print_command "$command_name" "$(command_description "$filepath")"
        exit 0
    done

    printf 'cdd help: unknown command: %s\n' "$command_name" >&2
    exit 1
fi

for dir in "${dirs[@]}"; do
    [ -d "$dir" ] || continue

    for filepath in "$dir"/*; do
        [ -f "$filepath" ] || continue
        [ -x "$filepath" ] || continue
        case "$(basename "$filepath")" in
            *.sh) continue ;;
        esac
        name=$(basename "$filepath")
        case "$seen" in
            *" $name "*) continue ;;
        esac
        seen="$seen$name "

        print_command "$name" "$(command_description "$filepath")"
    done
done
