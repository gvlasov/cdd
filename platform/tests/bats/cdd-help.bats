#!/usr/bin/env bats

load test_helper

@test "cdd help lists built-in and project commands with grey descriptions" {
  run "$CDD" help

  assert_success

  esc=$'\033'
  assert_output_contains "cdd help ${esc}[37m- show available CDD commands${esc}[0m"
  assert_output_contains "cdd init [directory] ${esc}[37m- initialize a CDD project directory${esc}[0m"
  assert_output_contains "cdd print ${esc}[37m- print indexed project code${esc}[0m"
  assert_output_contains "cdd self-upgrade ${esc}[37m- self-upgrade CDD support from CDD_SOURCE_PATH${esc}[0m"
  assert_output_contains "tests ${esc}[37m- run project tests in Docker${esc}[0m"
}

@test "cdd help does not list legacy install command or duplicate built-ins" {
  run "$CDD" help

  assert_success

  ! printf '%s\n' "$output" | grep -q '^cdd install\b'
  [ "$(printf '%s\n' "$output" | grep -c '^cdd self-upgrade ')" -eq 1 ]
}
