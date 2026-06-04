#!/usr/bin/env bats

load test_helper

@test "cdd resolves commands/dev before platform/cli" {
  project="$BATS_TEST_TMPDIR/project"
  mkdir -p "$project/commands/dev" "$project/platform/cli"

  cat > "$project/commands/dev/example" <<'SCRIPT'
#!/usr/bin/env bash
printf 'commands/dev\n'
SCRIPT
  chmod +x "$project/commands/dev/example"

  cat > "$project/platform/cli/example" <<'SCRIPT'
#!/usr/bin/env bash
printf 'platform/cli\n'
SCRIPT
  chmod +x "$project/platform/cli/example"

  cd "$project"

  run "$CDD" example

  assert_success
  [ "$output" = "commands/dev" ]
}
