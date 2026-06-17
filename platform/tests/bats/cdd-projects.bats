#!/usr/bin/env bats

load test_helper

@test "cdd projects ls lists first-level directories in the configured projects directory" {
  projects_root="$BATS_TEST_TMPDIR/projects"
  mkdir -p "$projects_root/problems" "$projects_root/features" "$projects_root/problems/nested"

  run env CDD_PROJECTS_DIRECTORY="$projects_root" "$CDD" projects ls

  assert_success
  [ "$output" = $'features\nproblems' ]
}

@test "cdd projects pwd prints the absolute path of a project directory" {
  projects_root="$BATS_TEST_TMPDIR/projects"
  mkdir -p "$projects_root/problems"

  run env CDD_PROJECTS_DIRECTORY="$projects_root" "$CDD" projects pwd problems

  assert_success
  [ "$output" = "$(realpath "$projects_root/problems")" ]
}

@test "cdd projects cd resolves the absolute path of a project directory" {
  projects_root="$BATS_TEST_TMPDIR/projects"
  mkdir -p "$projects_root/problems"

  run env CDD_PROJECTS_DIRECTORY="$projects_root" "$CDD" projects cd problems

  assert_success
  [ "$output" = "$(realpath "$projects_root/problems")" ]
}

@test "cdd projects bash completion offers subcommands then project names" {
  projects_root="$BATS_TEST_TMPDIR/projects"
  mkdir -p "$projects_root/problems" "$projects_root/features"

  cd "$BATS_TEST_TMPDIR"
  export CDD_PROJECTS_DIRECTORY="$projects_root"
  source "$PROJECT_ROOT/platform/bash/completions/cdd"

  COMP_WORDS=(cdd projects "")
  COMP_CWORD=2
  COMPREPLY=()
  _cdd
  [ "${COMPREPLY[*]}" = "ls cd pwd" ]

  COMP_WORDS=(cdd projects pwd "")
  COMP_CWORD=3
  COMPREPLY=()
  _cdd
  [ "$(printf '%s\n' "${COMPREPLY[@]}" | sort)" = $'features\nproblems' ]
}

@test "cdd projects fish completion offers subcommands then project names" {
  projects_root="$BATS_TEST_TMPDIR/projects"
  mkdir -p "$projects_root/problems" "$projects_root/features"

  run env PROJECT_ROOT="$PROJECT_ROOT" CDD_PROJECTS_DIRECTORY="$projects_root" fish --no-config -c 'source "$PROJECT_ROOT/platform/fish/completions/cdd.fish"; printf "%s\n" (__cdd_projects_subcommands)'

  assert_success
  [ "$output" = $'ls\ncd\npwd' ]

  run env PROJECT_ROOT="$PROJECT_ROOT" CDD_PROJECTS_DIRECTORY="$projects_root" fish --no-config -c 'source "$PROJECT_ROOT/platform/fish/completions/cdd.fish"; complete -C "cdd projects cd p"'

  assert_success
  [ "$output" = "problems" ]
}
