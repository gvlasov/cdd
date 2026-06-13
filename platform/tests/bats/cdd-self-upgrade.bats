#!/usr/bin/env bats

load test_helper

assert_installed_support() {
  [ -L "$HOME/.local/bin/cdd" ]
  [ "$(readlink "$HOME/.local/bin/cdd")" = "$PROJECT_ROOT/platform/cdd/cdd" ]
  [ -f "$HOME/.local/share/bash-completion/completions/cdd" ]
  [ -f "$HOME/.config/fish/conf.d/cdd.fish" ]
  [ -f "$HOME/.config/fish/completions/cdd.fish" ]
  [ -f "$HOME/.codex/skills/concept_driven_design/SKILL.md" ]
  [ -f "$HOME/.codex/skills/concept_driven_design/references/concepts.md" ]
  [ -f "$HOME/.claude/skills/concept_driven_design/SKILL.md" ]
  [ -f "$HOME/.claude/skills/concept_driven_design/references/concepts.md" ]
  [ -x "$HOME/.local/bin/terminal-tmuxinator-codex" ]

  [ "$(sed -n '1p' "$HOME/.codex/skills/concept_driven_design/SKILL.md")" = "---" ]
  [ "$(sed -n '4p' "$HOME/.codex/skills/concept_driven_design/SKILL.md")" = "---" ]
  grep -q 'name: concept_driven_design' "$HOME/.codex/skills/concept_driven_design/SKILL.md"
  grep -q 'references/concepts.md' "$HOME/.codex/skills/concept_driven_design/SKILL.md"
  grep -q '# concepts/agent-skills/AgentSkill.prompt.md' "$HOME/.codex/skills/concept_driven_design/references/concepts.md"

  [ "$(sed -n '1p' "$HOME/.claude/skills/concept_driven_design/SKILL.md")" = "---" ]
  [ "$(sed -n '4p' "$HOME/.claude/skills/concept_driven_design/SKILL.md")" = "---" ]
  grep -q 'name: concept_driven_design' "$HOME/.claude/skills/concept_driven_design/SKILL.md"
  grep -q 'references/concepts.md' "$HOME/.claude/skills/concept_driven_design/SKILL.md"
  grep -q '# concepts/agent-skills/AgentSkill.prompt.md' "$HOME/.claude/skills/concept_driven_design/references/concepts.md"
}

@test "cdd self-upgrade uses CDD_SOURCE_PATH and runs real installers in isolated HOME" {
  setup_test_home

  run env CDD_SELF_UPGRADE_SKIP_TESTS=1 CDD_SOURCE_PATH="$PROJECT_ROOT" "$CDD" self-upgrade

  assert_success
  assert_output_contains "Installing Bash support..."
  assert_output_contains "Installing Fish support..."
  assert_output_contains "Installing Codex skill..."
  assert_output_contains "Installing Claude Code skill..."
  assert_output_contains "Installing Codex project terminal launcher..."
  assert_output_contains "Upgraded CDD support from $PROJECT_ROOT"
  assert_installed_support
}

@test "cdd self-upgrade skips tests with --skip-tests and -S" {
  setup_test_home

  for flag in --skip-tests -S; do
    run env CDD_SOURCE_PATH="$PROJECT_ROOT" "$CDD" self-upgrade "$flag"

    assert_success
    ! printf '%s\n' "$output" | grep -q '^Running CDD tests...$'
    assert_output_contains "Installing Bash support..."
    assert_output_contains "Upgraded CDD support from $PROJECT_ROOT"
    assert_installed_support

    rm -rf "$HOME/.local" "$HOME/.config" "$HOME/.codex" "$HOME/.claude"
    mkdir -p "$HOME"
  done
}

@test "cdd self-upgrade defaults to HOME Projects personal cdd source path" {
  setup_test_home
  mkdir -p "$HOME/Projects/personal"
  ln -s "$PROJECT_ROOT" "$HOME/Projects/personal/cdd"

  run env CDD_SELF_UPGRADE_SKIP_TESTS=1 "$CDD" self-upgrade

  assert_success
  assert_installed_support
}

@test "cdd self-upgrade runs tests before installing" {
  setup_test_home
  fake_bin="$BATS_TEST_TMPDIR/bin"
  docker_log="$BATS_TEST_TMPDIR/docker.log"
  mkdir -p "$fake_bin"
  cat > "$fake_bin/docker" <<EOF
#!/usr/bin/env bash
printf '%s\n' "\$*" >> "$docker_log"
exit 0
EOF
  chmod +x "$fake_bin/docker"

  run env PATH="$fake_bin:$PATH" CDD_SOURCE_PATH="$PROJECT_ROOT" "$CDD" self-upgrade

  assert_success
  assert_output_contains "Running CDD tests..."
  assert_output_contains $'\033[32m✓\033[0m All tests pass fine'
  assert_output_contains "Installing Bash support..."
  assert_output_contains "Upgraded CDD support from $PROJECT_ROOT"
  grep -q "compose -f $PROJECT_ROOT/platform/tests/compose.yaml run --build --rm tests" "$docker_log"
  assert_installed_support
}

@test "cdd self-upgrade does not install when tests fail" {
  setup_test_home
  fake_bin="$BATS_TEST_TMPDIR/bin"
  docker_log="$BATS_TEST_TMPDIR/docker.log"
  mkdir -p "$fake_bin"
  cat > "$fake_bin/docker" <<EOF
#!/usr/bin/env bash
printf '%s\n' "\$*" >> "$docker_log"
exit 42
EOF
  chmod +x "$fake_bin/docker"

  run env PATH="$fake_bin:$PATH" CDD_SOURCE_PATH="$PROJECT_ROOT" "$CDD" self-upgrade

  assert_failure
  assert_output_contains "Running CDD tests..."
  ! printf '%s\n' "$output" | grep -q "Installing Bash support..."
  [ ! -e "$HOME/.local/bin/cdd" ]
  grep -q "compose -f $PROJECT_ROOT/platform/tests/compose.yaml run --build --rm tests" "$docker_log"
}

@test "cdd self-upgrade fails clearly when source path is missing" {
  setup_test_home
  missing="$BATS_TEST_TMPDIR/missing-cdd-source"

  run env CDD_SOURCE_PATH="$missing" "$CDD" self-upgrade

  assert_failure
  assert_output_contains "cdd self-upgrade: CDD source path does not exist: $missing"
  assert_output_contains "Set CDD_SOURCE_PATH to the CDD source repository path."
}
