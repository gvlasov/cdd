#!/usr/bin/env bash
# Print commands and their descriptions from project command directories

dirs=("$@")
if [ "${#dirs[@]}" -eq 0 ]; then
    dirs=(./commands ./concepts/plans ./concepts/projects ./concepts/ides)
fi
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

for dir in "${dirs[@]}"; do
    [ -d "$dir" ] || continue

    for filepath in "$dir"/*; do
        [ -f "$filepath" ] || continue
        case "$(basename "$filepath")" in
            *.sh) continue ;;
        esac
        name=$(basename "$filepath")
        case "$seen" in
            *" $name "*) continue ;;
        esac
        seen="$seen$name "

        desc=$(tail -n +2 "$filepath" | awk 'NF && /^#/ { print; exit }' | sed 's/^#[[:space:]]*//')

        print_command "$name" "$desc"
    done
done
