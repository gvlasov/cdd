#!/usr/bin/env bats

load test_helper

@test "jetbrains:plugin:build builds plugin and copies artifact to output directory" {
  fake_bin="$BATS_TEST_TMPDIR/bin"
  output_dir="$BATS_TEST_TMPDIR/artifacts"
  gradle_log="$BATS_TEST_TMPDIR/gradle.log"
  mkdir -p "$fake_bin"

  cat > "$fake_bin/gradle" <<'SCRIPT'
#!/usr/bin/env bash
printf '%s\n' "$PWD" > "$GRADLE_LOG"
printf '%s\n' "$*" >> "$GRADLE_LOG"
case " $* " in
  *" clean "*) rm -rf build ;;
esac
mkdir -p build/distributions
printf 'plugin zip\n' > build/distributions/cdd-jetbrains-integration-test.zip
SCRIPT
  chmod +x "$fake_bin/gradle"

  run env PATH="$fake_bin:$PATH" GRADLE_LOG="$gradle_log" "$PROJECT_ROOT/commands/jetbrains:plugin:build" "$output_dir"

  assert_success
  [ -f "$output_dir/cdd-jetbrains-integration-test.zip" ]
  [ "$output" = "$output_dir/cdd-jetbrains-integration-test.zip" ]
  grep -q "$PROJECT_ROOT/platform/jetbrains/integration-plugin" "$gradle_log"
  grep -q "clean buildPlugin --no-daemon" "$gradle_log"
}

@test "jetbrains:plugin:build defaults output directory to platform jetbrains build" {
  fake_bin="$BATS_TEST_TMPDIR/bin"
  gradle_log="$BATS_TEST_TMPDIR/gradle.log"
  default_output_dir="$PROJECT_ROOT/platform/jetbrains/build"
  mkdir -p "$fake_bin"

  cat > "$fake_bin/gradle" <<'SCRIPT'
#!/usr/bin/env bash
printf '%s\n' "$PWD" > "$GRADLE_LOG"
printf '%s\n' "$*" >> "$GRADLE_LOG"
mkdir -p build/distributions
printf 'plugin zip\n' > build/distributions/cdd-jetbrains-integration-test.zip
SCRIPT
  chmod +x "$fake_bin/gradle"

  run env PATH="$fake_bin:$PATH" GRADLE_LOG="$gradle_log" "$PROJECT_ROOT/commands/jetbrains:plugin:build"

  assert_success
  [ -f "$default_output_dir/cdd-jetbrains-integration-test.zip" ]
  [ "$output" = "$default_output_dir/cdd-jetbrains-integration-test.zip" ]
}

@test "jetbrains:plugin:build requires output directory argument" {
  run "$PROJECT_ROOT/commands/jetbrains:plugin:build" too many

  assert_failure
  assert_output_contains "usage: jetbrains:plugin:build [output-directory]"
}
