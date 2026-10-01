#!/usr/bin/env bats

load test_helper

@test "cdd skill build includes non-ignored project documentation" {
  cd "$PROJECT_ROOT"

  run ./concepts/agent-skills/build

  assert_success
  assert_output_contains "---"
  assert_output_contains "# CDD"
  assert_output_contains "## Workflow"
  assert_output_contains "# concepts/source-code/Source code"
  case "$output" in
    *"# platform/web/ontology-editor/README"*|*"# concepts/ontology-editor/Ontology editor"*)
      printf 'CDD skill must not embed ontology-editor documentation\n' >&2
      return 1
      ;;
    *"# platform/web/ontology-editor/node_modules/"*)
      printf 'CDD skill must not embed gitignored documentation\n' >&2
      return 1
      ;;
  esac

  HOME="$BATS_TEST_TMPDIR/home"
  mkdir -p "$HOME/.codex/skills/cdd"
  printf '%s\n' "$output" > "$HOME/.codex/skills/cdd/SKILL.md"

  run env HOME="$HOME" "$CDD" skill:print

  assert_success
  assert_output_contains "# CDD"
  assert_output_contains "## Workflow"
  assert_output_contains "# concepts/source-code/Source code"
  case "$output" in
    *"# platform/web/ontology-editor/README"*|*"# concepts/ontology-editor/Ontology editor"*)
      printf 'CDD skill must not embed ontology-editor documentation\n' >&2
      return 1
      ;;
    *"# platform/web/ontology-editor/node_modules/"*)
      printf 'CDD skill must not embed gitignored documentation\n' >&2
      return 1
      ;;
  esac
}
