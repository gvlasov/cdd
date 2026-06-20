#!/usr/bin/env bats

load test_helper

@test "cdd help lists project commands with grey descriptions" {
  run "$CDD" help

  assert_success

  esc=$'\033'
  assert_output_contains "ide ${esc}[37m- open a file in the user's editor.${esc}[0m"
  assert_output_contains "plans ${esc}[37m- list stored plans in the repository.${esc}[0m"
  assert_output_contains "plans:create:feature ${esc}[37m- create a feature plan and open it in the editor.${esc}[0m"
  assert_output_contains "plans:create:problem ${esc}[37m- create a problem plan and open it in the editor.${esc}[0m"
  assert_output_contains "plans:finish ${esc}[37m- finish an active plan by moving it to the finished plans directory.${esc}[0m"
  assert_output_contains "projects ${esc}[37m- list, resolve, or print projects from cdd_projects_directory.${esc}[0m"
  assert_output_contains "tests ${esc}[37m- run project tests in docker${esc}[0m"
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
  assert_output_contains "cdd github:open ${esc}[37m- open this project's github repository in browser.${esc}[0m"
  assert_output_contains "cdd ide ${esc}[37m- open a file in the user's editor.${esc}[0m"
  assert_output_contains "cdd ide:which ${esc}[37m- print the ide command cdd will use.${esc}[0m"
  assert_output_contains "cdd plans ${esc}[37m- list stored plans in the repository.${esc}[0m"
  assert_output_contains "cdd plans:create:feature ${esc}[37m- create a feature plan and open it in the editor.${esc}[0m"
  assert_output_contains "cdd plans:create:problem ${esc}[37m- create a problem plan and open it in the editor.${esc}[0m"
  assert_output_contains "cdd plans:finish ${esc}[37m- finish an active plan by moving it to the finished plans directory.${esc}[0m"
  assert_output_contains "cdd source-code:print ${esc}[37m- print indexed project code to stdout.${esc}[0m"
  assert_output_contains "cdd self-help ${esc}[37m- print cdd command subcommands.${esc}[0m"
  assert_output_contains "cdd help ${esc}[37m- print commands and their descriptions from project command directories.${esc}[0m"
  assert_output_contains "cdd init ${esc}[37m- initialize a cdd directory structure${esc}[0m"
  assert_output_contains "cdd print ${esc}[37m- print indexed project code to stdout.${esc}[0m"
  assert_output_contains "cdd projects ${esc}[37m- list, resolve, or print projects from cdd_projects_directory.${esc}[0m"
  assert_output_contains "cdd self-upgrade ${esc}[37m- self-upgrade cdd support from the configured cdd source repository${esc}[0m"
}

@test "cdd without arguments lists cdd subcommands" {
  run "$CDD"

  assert_success

  assert_output_contains "cdd self-help"
  assert_output_contains "cdd help"
  assert_output_contains "cdd init"
  assert_output_contains "cdd projects"
}
