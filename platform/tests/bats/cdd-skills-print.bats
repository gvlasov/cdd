#!/usr/bin/env bats

load test_helper

@test "cdd skill:print prints the freshest installed skill" {
  HOME="$BATS_TEST_TMPDIR/home"
  mkdir -p "$HOME/.codex/skills/concept_driven_design" "$HOME/.claude/skills/concept_driven_design"

  printf 'codex-skill\n' > "$HOME/.codex/skills/concept_driven_design/SKILL.md"
  printf 'claude-skill\n' > "$HOME/.claude/skills/concept_driven_design/SKILL.md"

  touch -t 202001010101 "$HOME/.codex/skills/concept_driven_design/SKILL.md"
  touch -t 202101010101 "$HOME/.claude/skills/concept_driven_design/SKILL.md"

  run env HOME="$HOME" "$CDD" skill:print

  assert_success
  [ "$output" = "claude-skill" ]

  touch -t 202201010101 "$HOME/.codex/skills/concept_driven_design/SKILL.md"

  run env HOME="$HOME" "$CDD" skill:print

  assert_success
  [ "$output" = "codex-skill" ]
}

@test "cdd skill:print fails when no installed skill exists" {
  HOME="$BATS_TEST_TMPDIR/home"
  mkdir -p "$HOME"

  run env HOME="$HOME" "$CDD" skill:print

  assert_failure
  assert_output_contains "cdd skill:print: no installed skill found"
}

@test "cdd skill completions include skill:print in bash and fish" {
  cd "$PROJECT_ROOT"
  source "$PROJECT_ROOT/platform/bash/completions/cdd"

  COMP_WORDS=(cdd sk)
  COMP_CWORD=1
  COMPREPLY=()
  _cdd
  [ "$(printf '%s\n' "${COMPREPLY[@]}" | sort)" = "skill:print" ]

  run env PROJECT_ROOT="$PROJECT_ROOT" fish --no-config -c 'source "$PROJECT_ROOT/platform/fish/completions/cdd.fish"; complete -C "cdd sk"'

  assert_success
  assert_output_contains "skill:print"
}
