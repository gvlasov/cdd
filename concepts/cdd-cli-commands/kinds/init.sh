#!/usr/bin/env bash
# Initialize a CDD directory structure and Git repository
set -euo pipefail

is_github_remote() {
  case "$1" in
    git@github.com:*.git|git@github.com:*|https://github.com/*|ssh://git@github.com/*)
      return 0
      ;;
  esac

  return 1
}

target="."
remote=""

case "$#" in
  0)
    ;;
  1)
    if is_github_remote "$1"; then
      remote="$1"
    else
      target="$1"
    fi
    ;;
  2)
    target="$1"
    remote="$2"
    ;;
  *)
    printf 'usage: cdd init [TARGET|GITHUB_REPO] [GITHUB_REPO]\n' >&2
    exit 2
    ;;
esac

cdd_home="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." >/dev/null 2>&1 && pwd)"
directories_file="$cdd_home/concepts/project-directories/directories-list.json"

if [ ! -f "$directories_file" ]; then
  printf 'cdd init: missing project directories list: %s\n' "$directories_file" >&2
  exit 1
fi

while IFS= read -r directory; do
  [ -n "$directory" ] || continue
  mkdir -p "$target/$directory"
done < <(sed -n 's/^[[:space:]]*"\([^"]\+\)".*$/\1/p' "$directories_file")

git -C "$target" init >/dev/null 2>&1
if [ -n "$remote" ]; then
  git -C "$target" remote add origin "$remote" >/dev/null 2>&1
fi

printf 'Initialized CDD directory structure in %s\n' "$target"
