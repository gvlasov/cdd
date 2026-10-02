#!/usr/bin/env bash
# Register `cdd ide:open:url` as the system handler of jetbrains:// links
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
applications_dir="${XDG_DATA_HOME:-$HOME/.local/share}/applications"
desktop_name="cdd-ide-url-handler.desktop"

# Desktop launches don't see the shell's $EDITOR; pin the editor chosen now.
editor_env=""
ide="${CDD_IDE_CMD:-${EDITOR:-}}"
if [ -n "$ide" ] && [[ "$ide" != *[[:space:]]* ]]; then
  editor_env="env CDD_IDE_CMD=$ide "
fi

mkdir -p "$applications_dir"
sed -e "s|@ENV@|$editor_env|" -e "s|@CDD@|$HOME/.local/bin/cdd|" \
  "$source_dir/ide-url-handler.desktop" > "$applications_dir/$desktop_name"

update-desktop-database "$applications_dir" 2>/dev/null || true
xdg-mime default "$desktop_name" x-scheme-handler/jetbrains

printf 'Registered %s as the jetbrains:// link handler\n' "$applications_dir/$desktop_name"
