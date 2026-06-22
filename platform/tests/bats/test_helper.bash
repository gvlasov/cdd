#!/usr/bin/env bash

PROJECT_ROOT="${PROJECT_ROOT:-/workspace}"
CDD="$PROJECT_ROOT/platform/cdd/cdd"

setup_test_home() {
  export HOME="$BATS_TEST_TMPDIR/home"
  mkdir -p "$HOME"
  git config --global --add safe.directory "$PROJECT_ROOT"
}

setup_file() {
  export CDD_SKILL_INSTALL_CACHE_DIR="/tmp/cdd-skill-install-cache-${USER:-$(id -u)}"
  rm -rf "$CDD_SKILL_INSTALL_CACHE_DIR"
  mkdir -p "$CDD_SKILL_INSTALL_CACHE_DIR"
}

setup() {
  export CDD_TEST_STARTED_AT_MS="$(date +%s%3N 2>/dev/null || date +%s)"
}

teardown() {
  local ended_at_ms elapsed_ms escaped_started_at_ms
  escaped_started_at_ms="${CDD_TEST_STARTED_AT_MS:-}"
  [ -n "$escaped_started_at_ms" ] || return 0

  ended_at_ms="$(date +%s%3N 2>/dev/null || date +%s)"
  if [[ "$escaped_started_at_ms" =~ ^[0-9]+$ && "$ended_at_ms" =~ ^[0-9]+$ ]]; then
    elapsed_ms="$((ended_at_ms - escaped_started_at_ms))"
    printf '\033[37m[%s]\033[0m %s\n' "${elapsed_ms}ms" "${BATS_TEST_DESCRIPTION}" >&3
  fi
}

setup_fake_optional_tools() {
  fake_bin="$BATS_TEST_TMPDIR/bin"
  mkdir -p "$fake_bin"

  for tool in codex claude tmuxinator; do
    cat > "$fake_bin/$tool" <<EOF
#!/usr/bin/env bash
exit 0
EOF
    chmod +x "$fake_bin/$tool"
  done

  export PATH="$fake_bin:$PATH"
}

assert_success() {
  if [ "$status" -ne 0 ]; then
    printf 'expected success, got status %s\n' "$status" >&2
    printf '%s\n' "$output" >&2
    return 1
  fi
}

assert_failure() {
  if [ "$status" -eq 0 ]; then
    printf 'expected failure, got success\n' >&2
    printf '%s\n' "$output" >&2
    return 1
  fi
}

assert_output_contains() {
  case "$output" in
    *"$1"*) ;;
    *)
      printf 'expected output to contain: %s\n' "$1" >&2
      printf '%s\n' "$output" >&2
      return 1
      ;;
  esac
}
