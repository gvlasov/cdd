#!/usr/bin/env bash

PROJECT_ROOT="${PROJECT_ROOT:-/workspace}"
CDD="$PROJECT_ROOT/platform/cdd/cdd"

setup_test_home() {
  export HOME="$BATS_TEST_TMPDIR/home"
  mkdir -p "$HOME"
  git config --global --add safe.directory "$PROJECT_ROOT"
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
