#!/usr/bin/env bats

load test_helper

@test "cdd init creates CDD directories at the requested target" {
  target="$BATS_TEST_TMPDIR/project"

  run "$CDD" init "$target"

  assert_success
  assert_output_contains "Initialized CDD directory structure in $target"

  [ -d "$target/concepts" ]
  [ -d "$target/stakeholders" ]
  [ -d "$target/processes" ]
  [ -d "$target/platform" ]
  [ -d "$target/commands" ]
  [ -d "$target/sandbox" ]
}

@test "cdd init defaults to the current directory" {
  target="$BATS_TEST_TMPDIR/default-project"
  mkdir -p "$target"
  cd "$target"

  run "$CDD" init

  assert_success
  assert_output_contains "Initialized CDD directory structure in ."

  [ -d concepts ]
  [ -d stakeholders ]
  [ -d processes ]
  [ -d platform ]
  [ -d commands ]
  [ -d sandbox ]
}
