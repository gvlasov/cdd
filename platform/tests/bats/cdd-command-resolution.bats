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

@test "cdd commands:create creates an executable command and opens it in the editor" {
  project="$BATS_TEST_TMPDIR/project"
  mkdir -p "$project"
  cd "$project"

  fake_bin="$BATS_TEST_TMPDIR/bin"
  mkdir -p "$fake_bin"
  cat > "$fake_bin/ide-cmd" <<'EOF'
#!/usr/bin/env bash
printf '%s\n' "$@" > "$BATS_TEST_TMPDIR/ide-args.txt"
EOF
  chmod +x "$fake_bin/ide-cmd"

  run env BATS_TEST_TMPDIR="$BATS_TEST_TMPDIR" PATH="$fake_bin:$PATH" CDD_IDE_CMD="$fake_bin/ide-cmd" "$CDD" commands:create example:build

  assert_success
  [ -f "$project/commands/example:build" ]
  [ -x "$project/commands/example:build" ]
  [ "$(sed -n '1p' "$project/commands/example:build")" = '#!/usr/bin/env bash' ]
  [ "$(sed -n '2p' "$project/commands/example:build")" = 'set -euo pipefail' ]
  [ "$(<"$BATS_TEST_TMPDIR/ide-args.txt")" = "$(realpath "$project/commands/example:build")" ]
}
