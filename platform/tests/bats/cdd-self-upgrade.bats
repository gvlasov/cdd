#!/usr/bin/env bats

load test_helper

assert_installed_support() {
  [ -L "$HOME/.local/bin/cdd" ]
  [ "$(readlink "$HOME/.local/bin/cdd")" = "$PROJECT_ROOT/platform/cdd/cdd" ]
  [ -f "$HOME/.local/share/bash-completion/completions/cdd" ]
  [ -f "$HOME/.config/fish/conf.d/cdd.fish" ]
  [ -f "$HOME/.config/fish/completions/cdd.fish" ]
  [ -f "$HOME/.codex/skills/concept_driven_design/SKILL.md" ]
  [ -f "$HOME/.claude/skills/concept_driven_design/SKILL.md" ]
  [ -x "$HOME/.local/bin/terminal-tmuxinator-codex" ]

  grep -q 'name: concept_driven_design' "$HOME/.codex/skills/concept_driven_design/SKILL.md"
  grep -q 'name: concept_driven_design' "$HOME/.claude/skills/concept_driven_design/SKILL.md"
}

@test "cdd self-upgrade uses CDD_SOURCE_PATH and runs real installers in isolated HOME" {
  setup_test_home

  run env CDD_SOURCE_PATH="$PROJECT_ROOT" "$CDD" self-upgrade

  assert_success
  assert_output_contains "Installing Bash support..."
  assert_output_contains "Installing Fish support..."
  assert_output_contains "Installing Codex skill..."
  assert_output_contains "Installing Claude Code skill..."
  assert_output_contains "Installing Codex project terminal launcher..."
  assert_output_contains "Upgraded CDD support from $PROJECT_ROOT"
  assert_installed_support
}

@test "cdd self-upgrade defaults to HOME Projects personal cdd source path" {
  setup_test_home
  mkdir -p "$HOME/Projects/personal"
  ln -s "$PROJECT_ROOT" "$HOME/Projects/personal/cdd"

  run "$CDD" self-upgrade

  assert_success
  assert_installed_support
}

@test "cdd self-upgrade fails clearly when source path is missing" {
  setup_test_home
  missing="$BATS_TEST_TMPDIR/missing-cdd-source"

  run env CDD_SOURCE_PATH="$missing" "$CDD" self-upgrade

  assert_failure
  assert_output_contains "cdd self-upgrade: CDD source path does not exist: $missing"
  assert_output_contains "Set CDD_SOURCE_PATH to the CDD source repository path."
}
