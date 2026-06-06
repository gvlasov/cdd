#!/usr/bin/env bats

load test_helper

@test "cdd resolves project commands from /commands" {
  project="$BATS_TEST_TMPDIR/project"
  mkdir -p "$project/commands"

  cat > "$project/commands/example" <<'SCRIPT'
#!/usr/bin/env bash
printf 'commands\n'
SCRIPT
  chmod +x "$project/commands/example"

  cd "$project"

  run "$CDD" example

  assert_success
  [ "$output" = "commands" ]
}
