#!/usr/bin/env bash
# Prints the whole text of the Obsidian vault,
# with filenames preceding each file content,
# suitable for ingestion by LLM
cd "$(git rev-parse --show-toplevel)"
find . \
  -type f \
  -name "*.md" \
  ! -path "*.prompt.md" \
  -exec sh -c 'path="$1"; path="${path#./}"; echo "# ${path%.*}"; cat "$1"; echo; echo ' _ {} \;