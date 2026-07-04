#!/usr/bin/env bats

load test_helper

@test "cdd skill build includes project files and prints the assembled skill" {
  cd "$PROJECT_ROOT"

  run ./concepts/agent-skills/build

  assert_success
  assert_output_contains "---"
  assert_output_contains "# concepts/source-code/Source code"
  assert_output_contains "# platform/jetbrains/integration-plugin/README"
  assert_output_contains "# concepts/agent-skills/AgentSkill.prompt.md"

  HOME="$BATS_TEST_TMPDIR/home"
  mkdir -p "$HOME/.codex/skills/cdd"
  printf '%s\n' "$output" > "$HOME/.codex/skills/cdd/SKILL.md"

  run env HOME="$HOME" "$CDD" skill:print

  assert_success
  assert_output_contains "# concepts/source-code/Source code"
  assert_output_contains "# platform/jetbrains/integration-plugin/README"
  assert_output_contains "# concepts/agent-skills/AgentSkill.prompt.md"
}
