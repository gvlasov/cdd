#!/usr/bin/env bash
# Open this project's GitHub repository in browser.
set -euo pipefail

project_root="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$project_root"

if [ -n "${GITHUB_URL:-}" ]; then
  github_url="$GITHUB_URL"
else
  remote_url="$(git remote get-url origin)"
  github_url="$remote_url"
fi

case "$github_url" in
  git@github.com:*)
    github_url="https://github.com/${github_url#git@github.com:}"
    github_url="${github_url%.git}"
    ;;
  https://github.com/*)
    github_url="${github_url%.git}"
    ;;
  http://github.com/*)
    github_url="${github_url%.git}"
    github_url="https://${github_url#http://}"
    ;;
  *)
    printf 'Unsupported GitHub remote: %s\n' "${remote_url:-$github_url}" >&2
    exit 1
    ;;
esac

branch="$(git branch --show-current)"
if [ -n "$branch" ]; then
  github_url="$github_url/tree/$branch"
fi

exec "$project_root/commands/open-in-browser" "$github_url"
