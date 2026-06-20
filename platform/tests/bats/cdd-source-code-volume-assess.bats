#!/usr/bin/env bats

load test_helper

strip_ansi() {
  perl -pe 's/\e\[[0-9;]*[A-Za-z]//g'
}

@test "cdd source-code:volume:assess dump shows root items sorted by volume" {
  project="$BATS_TEST_TMPDIR/project"
  mkdir -p "$project/alpha" "$project/beta/zeta" "$project/beta/omega"
  cd "$project"
  git init -q

  printf 'aaa' > alpha/a.txt
  printf 'bbbbbbbbbb' > beta/zeta/big.txt
  printf 'c' > beta/omega/small.txt
  printf 'rootxxx' > root.txt
  printf 'ignored image\n' > image.png
  ln -s alpha/a.txt alpha-link.txt

  git add .

  run "$CDD" source-code:volume:assess --dump

  assert_success

  clean_output="$(printf '%s\n' "$output" | strip_ansi)"
  output="$clean_output"
  ! printf '%s\n' "$clean_output" | grep -q '^Controls:'
  [ "$(printf '%s\n' "$clean_output" | grep -n '^Current directory: \./$' | cut -d: -f1)" -lt "$(printf '%s\n' "$clean_output" | grep -n '^> beta/ 11 B$' | cut -d: -f1)" ]
  [ "$(printf '%s\n' "$clean_output" | grep -n '^> beta/ 11 B$' | cut -d: -f1)" -lt "$(printf '%s\n' "$clean_output" | grep -n '^  root.txt 7 B$' | cut -d: -f1)" ]
  [ "$(printf '%s\n' "$clean_output" | grep -n '^  root.txt 7 B$' | cut -d: -f1)" -lt "$(printf '%s\n' "$clean_output" | grep -n '^  alpha/ 3 B$' | cut -d: -f1)" ]
}

@test "cdd source-code:volume:assess dump shows mixed files and directories for a subtree" {
  project="$BATS_TEST_TMPDIR/project"
  mkdir -p "$project/beta/zeta" "$project/beta/omega"
  cd "$project"
  git init -q

  printf 'bbbbbbbbbb' > beta/zeta/big.txt
  printf 'c' > beta/omega/small.txt
  printf 'middle' > beta/mid.txt

  git add .

  run "$CDD" source-code:volume:assess --dump --dump-path=beta

  assert_success

  clean_output="$(printf '%s\n' "$output" | strip_ansi)"
  output="$clean_output"
  assert_output_contains "Current directory: ./beta"
  [ "$(printf '%s\n' "$clean_output" | grep -n '^> zeta/ 10 B$' | cut -d: -f1)" -lt "$(printf '%s\n' "$clean_output" | grep -n '^  mid.txt 6 B$' | cut -d: -f1)" ]
  [ "$(printf '%s\n' "$clean_output" | grep -n '^  mid.txt 6 B$' | cut -d: -f1)" -lt "$(printf '%s\n' "$clean_output" | grep -n '^  omega/ 1 B$' | cut -d: -f1)" ]
}

@test "cdd source-code:volume:assess dump shows an empty state for directories with no source items" {
  project="$BATS_TEST_TMPDIR/project"
  mkdir -p "$project/solo"
  cd "$project"
  git init -q

  printf 'ignored png\n' > solo/image.png

  git add .

  run "$CDD" source-code:volume:assess --dump --dump-path=solo

  assert_success

  clean_output="$(printf '%s\n' "$output" | strip_ansi)"
  output="$clean_output"
  assert_output_contains "Current directory: ./solo"
  assert_output_contains "No source-code items here."
}
