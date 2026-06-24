#!/usr/bin/env bats

load test_helper

@test "cdd init creates CDD directories at the requested target" {
  target="$BATS_TEST_TMPDIR/project"

  run "$CDD" init "$target"

  assert_success
  assert_output_contains "Initialized CDD directory structure in $target"

  [ -d "$target/.git" ]
  git -C "$target" rev-parse --is-inside-work-tree >/dev/null

  [ -d "$target/concepts" ]
  [ -d "$target/project" ]
  [ -d "$target/stakeholders" ]
  [ -d "$target/processes" ]
  [ -d "$target/platform" ]
  [ -d "$target/commands" ]
  [ -d "$target/plans" ]
  [ -d "$target/plans/problems" ]
  [ -d "$target/plans/features" ]
  [ -d "$target/plans/finished" ]
  [ -d "$target/sandbox" ]
}

@test "cdd init defaults to the current directory" {
  target="$BATS_TEST_TMPDIR/default-project"
  mkdir -p "$target"
  cd "$target"

  run "$CDD" init

  assert_success
  assert_output_contains "Initialized CDD directory structure in ."

  [ -d .git ]
  git rev-parse --is-inside-work-tree >/dev/null

  [ -d concepts ]
  [ -d project ]
  [ -d stakeholders ]
  [ -d processes ]
  [ -d platform ]
  [ -d commands ]
  [ -d plans ]
  [ -d plans/problems ]
  [ -d plans/features ]
  [ -d plans/finished ]
  [ -d sandbox ]
}

@test "cdd init accepts github remotes and adds origin" {
  root="$BATS_TEST_TMPDIR/projects"
  mkdir -p "$root/ssh" "$root/https"

  cd "$root/ssh"
  run "$CDD" init 'git@github.com:chriego/cdd.git'
  assert_success
  assert_output_contains "Initialized CDD directory structure in ."
  [ "$(git -C "$root/ssh" remote get-url origin)" = 'git@github.com:chriego/cdd.git' ]

  cd "$root/https"
  run "$CDD" init 'https://github.com/chriego/cdd.git'
  assert_success
  assert_output_contains "Initialized CDD directory structure in ."
  [ "$(git -C "$root/https" remote get-url origin)" = 'https://github.com/chriego/cdd.git' ]
}
