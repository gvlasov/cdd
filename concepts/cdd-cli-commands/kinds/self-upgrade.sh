#!/usr/bin/env bash
# Self-upgrade CDD support from the configured CDD source repository
set -euo pipefail

skip_tests="${CDD_SELF_UPGRADE_SKIP_TESTS:-0}"

while [ "$#" -gt 0 ]; do
  case "$1" in
    -S|--skip-tests)
      skip_tests=1
      ;;
    --)
      shift
      break
      ;;
    -*)
      printf 'usage: cdd self-upgrade [-S|--skip-tests]\n' >&2
      exit 2
      ;;
    *)
      break
      ;;
  esac
  shift
done

if [ "$#" -ne 0 ]; then
  printf 'usage: cdd self-upgrade [-S|--skip-tests]\n' >&2
  exit 2
fi

cdd_source_path="${CDD_SOURCE_PATH:-$HOME/Projects/personal/cdd}"
if ! cdd_home="$(cd "$cdd_source_path" >/dev/null 2>&1 && pwd)"; then
  printf 'cdd self-upgrade: CDD source path does not exist: %s\n' "$cdd_source_path" >&2
  printf 'Set CDD_SOURCE_PATH to the CDD source repository path.\n' >&2
  exit 1
fi

if [ "$skip_tests" != "1" ]; then
  printf 'Running CDD tests...\n'
  "$cdd_home/platform/cdd/cdd" tests
  printf '\033[32m✓\033[0m All tests pass fine\n'
fi

"$cdd_home/commands/install"

printf 'Upgraded CDD support from %s\n' "$cdd_home"
