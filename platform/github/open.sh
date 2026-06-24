#!/usr/bin/env bash
# Open this project's GitHub repository in browser
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

project_root="$(cd -P "$(dirname "$source_path")/../.." && pwd)"
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
