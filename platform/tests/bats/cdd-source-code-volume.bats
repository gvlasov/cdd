#!/usr/bin/env bats

load test_helper

@test "cdd source-code:volume prints the same byte count as source-code:print piped to wc -c" {
  project="$BATS_TEST_TMPDIR/project"
  mkdir -p "$project"
  cd "$project"
  git init -q

  printf 'alpha\n' > alpha.txt
  printf 'beta\n' > beta.txt

  git add .

  expected="$("$CDD" source-code:print | wc -c)"

  run "$CDD" source-code:volume

  assert_success
  [ "$output" = "$expected" ]
}
