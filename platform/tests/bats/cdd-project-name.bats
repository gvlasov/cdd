#!/usr/bin/env bats

load test_helper

@test "cdd project:displayName prints the name from /project/name at the git repo root" {
  project="$BATS_TEST_TMPDIR/project"
  mkdir -p "$project/project" "$project/sub"
  git -C "$project" init -q
  printf 'My Project\n' > "$project/project/name"

  cd "$project/sub"
  run "$CDD" project:displayName

  assert_success
  [ "$output" = "My Project" ]
}

@test "cdd project:displayName falls back to the current directory outside a git repo" {
  project="$BATS_TEST_TMPDIR/project"
  mkdir -p "$project/project"
  printf 'Plain Dir\n' > "$project/project/name"

  cd "$project"
  run "$CDD" project:displayName

  assert_success
  [ "$output" = "Plain Dir" ]
}

@test "cdd project:displayName fails when /project/name is missing" {
  project="$BATS_TEST_TMPDIR/project"
  mkdir -p "$project"
  git -C "$project" init -q

  cd "$project"
  run "$CDD" project:displayName

  assert_failure
}

@test "cdd project:slug derives a lowercase hyphenated slug from the display name" {
  project="$BATS_TEST_TMPDIR/project"
  mkdir -p "$project/project"
  git -C "$project" init -q
  printf 'CDD\n' > "$project/project/name"

  cd "$project"
  run "$CDD" project:slug

  assert_success
  [ "$output" = "cdd" ]
}

@test "cdd project:slug replaces runs of non-lowercase characters with a single hyphen" {
  project="$BATS_TEST_TMPDIR/project"
  mkdir -p "$project/project"
  git -C "$project" init -q
  printf 'My Cool  Project!!\n' > "$project/project/name"

  cd "$project"
  run "$CDD" project:slug

  assert_success
  [ "$output" = "my-cool-project" ]
}
