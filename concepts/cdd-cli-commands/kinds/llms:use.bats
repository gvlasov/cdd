#!/usr/bin/env bats

load ../../../platform/tests/bats/test_helper

setup() {
  project="$BATS_TEST_TMPDIR/project"
  config="$project/platform/tmuxinator/local/terminal-tmuxinator-claude.yml"
  mkdir -p "$project/commands" "$(dirname "$config")"
  cat > "$config" <<'YAML'
name: project-llm
root: '/project'
windows:
  - llm:
      panes:
        - claude --resume
        #- codex --approve-for-me resume
YAML
  cd "$project"
}

@test "llms:use selects codex" {
  run "$CDD" llms:use codex

  assert_success
  grep -Eq '^[[:space:]]*- codex --approve-for-me resume$' "$config"
  grep -Eq '^[[:space:]]*#- claude --resume$' "$config"
}

@test "llms:use selects claude" {
  sed -Ei \
    -e '/^[[:space:]]*-[[:space:]]+claude/ s/^([[:space:]]*)/\1#/' \
    -e '/^[[:space:]]*#-[[:space:]]+codex/ s/^([[:space:]]*)#/\1/' \
    "$config"

  run "$CDD" llms:use claude

  assert_success
  grep -Eq '^[[:space:]]*- claude --resume$' "$config"
  grep -Eq '^[[:space:]]*#- codex --approve-for-me resume$' "$config"
}

@test "llms:use rejects unsupported LLMs without changing the config" {
  before="$(cat "$config")"

  run "$CDD" llms:use gemini

  [ "$status" -eq 2 ]
  assert_output_contains 'expected codex or claude'
  [ "$(cat "$config")" = "$before" ]
}
