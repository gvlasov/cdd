#!/usr/bin/env bats

load test_helper

@test "cdd source-code:volume:analyze prints indexed source files sorted by size" {
  project="$BATS_TEST_TMPDIR/project"
  mkdir -p "$project"
  cd "$project"
  git init -q

  printf 'a\n' > small.txt
  printf 'abcd\n' > medium.txt
  printf 'abcdefghij\n' > large.txt
  printf 'ignored png\n' > image.png
  ln -s large.txt linked.txt

  git add .

  run "$CDD" source-code:volume:analyze

  assert_success

  expected=$'large.txt 11\nmedium.txt 5\nsmall.txt 2'
  [ "$output" = "$expected" ]
}

@test "cdd source-code completions include source-code commands in bash" {
  cd "$PROJECT_ROOT"
  source "$PROJECT_ROOT/platform/bash/completions/cdd"

  COMP_WORDS=(cdd source-code:)
  COMP_CWORD=1
  COMPREPLY=()
  _cdd

  [ "$(printf '%s\n' "${COMPREPLY[@]}" | sort)" = $'source-code:print\nsource-code:volume:analyze' ]
}

@test "cdd source-code completions include source-code commands in fish" {
  run env PROJECT_ROOT="$PROJECT_ROOT" fish --no-config -c 'source "$PROJECT_ROOT/platform/fish/completions/cdd.fish"; complete -C "cdd source-code:"'

  assert_success
  assert_output_contains "source-code:print"
  assert_output_contains "source-code:volume:analyze"
}
