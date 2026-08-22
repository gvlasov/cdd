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
  expected="https://github.com/gvlasov/cdd/tree/master"
  [ "$(cat "$opened_url")" = "$expected" ]
  [ ! -e "$PROJECT_ROOT/cdd" ]
}

@test "cdd github:open is offered by bash completion at top level" {
  cd "$PROJECT_ROOT"
  source "$PROJECT_ROOT/platform/bash/completions/cdd"

  COMP_WORDS=(cdd g)
  COMP_CWORD=1
  COMPREPLY=()
  _cdd

  [ "$(printf '%s\n' "${COMPREPLY[@]}" | sort)" = "github:open" ]
}

@test "cdd github:open is offered by fish completion at top level" {
  run env PROJECT_ROOT="$PROJECT_ROOT" fish --no-config -c 'source "$PROJECT_ROOT/platform/fish/completions/cdd.fish"; complete -C "cdd g"'

  assert_success
  assert_output_contains "github:open"
}

@test "cdd features and problems are offered by top-level bash completion" {
  cd "$PROJECT_ROOT"
  source "$PROJECT_ROOT/platform/bash/completions/cdd"

  COMP_WORDS=(cdd f)
  COMP_CWORD=1
  COMPREPLY=()
  _cdd

  printf '%s\n' "${COMPREPLY[@]}" | grep -qx "features"

  COMP_WORDS=(cdd p)
  COMP_CWORD=1
  COMPREPLY=()
  _cdd

  printf '%s\n' "${COMPREPLY[@]}" | grep -qx "problems"
}

@test "cdd features and problems are offered by top-level fish completion" {
  run env PROJECT_ROOT="$PROJECT_ROOT" fish --no-config -c 'source "$PROJECT_ROOT/platform/fish/completions/cdd.fish"; complete -C "cdd f"'

  assert_success
  assert_output_contains "features"

  run env PROJECT_ROOT="$PROJECT_ROOT" fish --no-config -c 'source "$PROJECT_ROOT/platform/fish/completions/cdd.fish"; complete -C "cdd p"'

  assert_success
  assert_output_contains "plans"
  assert_output_contains "problems"
}
