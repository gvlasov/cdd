#!/usr/bin/env bats

load test_helper

@test "cdd github:open opens the current project github branch in browser" {
  fake_bin="$BATS_TEST_TMPDIR/bin"
  opened_url="$BATS_TEST_TMPDIR/opened-url"
  mkdir -p "$fake_bin"

  cat > "$fake_bin/xdg-open" <<EOF
#!/usr/bin/env bash
printf '%s\n' "\$1" > "$opened_url"
EOF
  chmod +x "$fake_bin/xdg-open"

  run env PATH="$fake_bin:$PATH" "$CDD" github:open

  assert_success
  expected="https://github.com/gvlasov/concept-driven-organization/tree/master"
  [ "$(cat "$opened_url")" = "$expected" ]
}
