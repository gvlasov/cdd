#!/usr/bin/env bats

load test_helper

@test "cdd help lists project commands with grey descriptions" {
  run "$CDD" help

  assert_success

  esc=$'\033'
  assert_output_contains "tests ${esc}[37m- run project tests in Docker${esc}[0m"
  ! printf '%s\n' "$output" | grep -q '^cdd help\b'
  ! printf '%s\n' "$output" | grep -q '^cdd init\b'
  ! printf '%s\n' "$output" | grep -q '^cdd print\b'
  ! printf '%s\n' "$output" | grep -q '^cdd self-upgrade\b'
}

@test "cdd help does not list legacy install command or cdd command entrypoint" {
  run "$CDD" help

  assert_success

  ! printf '%s\n' "$output" | grep -q '^cdd install\b'
  ! printf '%s\n' "$output" | grep -q '^cdd\b'
}

@test "cdd self-help lists cdd subcommands" {
  run "$CDD" self-help

  assert_success

  esc=$'\033'
  assert_output_contains "cdd self-help ${esc}[37m- show cdd subcommands${esc}[0m"
  assert_output_contains "cdd help ${esc}[37m- show available project commands${esc}[0m"
  assert_output_contains "cdd init [directory] ${esc}[37m- initialize a CDD project directory${esc}[0m"
  assert_output_contains "cdd print ${esc}[37m- print indexed project code${esc}[0m"
  assert_output_contains "cdd self-upgrade ${esc}[37m- self-upgrade CDD support from CDD_SOURCE_PATH${esc}[0m"
}

@test "cdd without arguments lists cdd subcommands" {
  run "$CDD"

  assert_success

  assert_output_contains "cdd self-help"
  assert_output_contains "cdd help"
  assert_output_contains "cdd init [directory]"
}
