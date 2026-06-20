#!/usr/bin/env bash
# Print the IDE command CDD will use
set -euo pipefail

if [ "$#" -ne 0 ]; then
  printf 'usage: cdd ide:which\n' >&2
  exit 2
fi

if [ -n "${CDD_IDE_CMD:-}" ]; then
  printf '%s\n' "$CDD_IDE_CMD"
  exit 0
fi

if [ -n "${EDITOR:-}" ]; then
  printf '%s\n' "$EDITOR"
  exit 0
fi

if command -v vim >/dev/null 2>&1; then
  printf '%s\n' vim
  exit 0
fi

if command -v vi >/dev/null 2>&1; then
  printf '%s\n' vi
  exit 0
fi

printf 'cdd ide: editor is not set up.\n' >&2
printf 'Set EDITOR or install vim/vi, then run: %s\n' "${EDITOR:-\$EDITOR}" >&2
exit 1
