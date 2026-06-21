#!/usr/bin/env bats

load test_helper

@test "cdd projects ls lists first-level directories in the configured projects directory" {
  projects_root="$BATS_TEST_TMPDIR/projects"
  mkdir -p "$projects_root/problems" "$projects_root/features" "$projects_root/problems/nested"

  run env CDD_PROJECTS_DIRECTORY="$projects_root" "$CDD" projects ls

  assert_success
  [ "$output" = $'features\nproblems' ]
}

@test "cdd projects defaults to ls when no argument is provided" {
  projects_root="$BATS_TEST_TMPDIR/projects"
  mkdir -p "$projects_root/problems" "$projects_root/features"

  run env CDD_PROJECTS_DIRECTORY="$projects_root" "$CDD" projects

  assert_success
  [ "$output" = $'features\nproblems' ]
}

@test "cdd projects pwd prints the absolute path of a project directory" {
  projects_root="$BATS_TEST_TMPDIR/projects"
  mkdir -p "$projects_root/problems"

  run env CDD_PROJECTS_DIRECTORY="$projects_root" "$CDD" projects pwd problems

  assert_success
  [ "$output" = "$(realpath "$projects_root/problems")" ]
}

@test "cdd projects cd resolves the absolute path of a project directory" {
  projects_root="$BATS_TEST_TMPDIR/projects"
  mkdir -p "$projects_root/problems"

  run env CDD_PROJECTS_DIRECTORY="$projects_root" "$CDD" projects cd problems

  assert_success
  [ "$output" = "$(realpath "$projects_root/problems")" ]
}

@test "bash cdd projects cd changes into the project directory" {
  projects_root="$BATS_TEST_TMPDIR/projects"
  mkdir -p "$projects_root/problems"

  run env CDD_PROJECTS_DIRECTORY="$projects_root" PROJECT_ROOT="$PROJECT_ROOT" PATH="$PROJECT_ROOT/platform/cdd:$PATH" bash -c '
    source "$PROJECT_ROOT/platform/bash/cdd.bash"
    cdd projects cd problems
    pwd -P
  '

  assert_success
  [ "$output" = "$(realpath "$projects_root/problems")" ]
}

@test "fish cdd projects cd changes into the project directory" {
  projects_root="$BATS_TEST_TMPDIR/projects"
  mkdir -p "$projects_root/problems"

  run env CDD_PROJECTS_DIRECTORY="$projects_root" PROJECT_ROOT="$PROJECT_ROOT" fish --no-config -c '
    source "$PROJECT_ROOT/platform/fish/cdd.fish"
    cdd projects cd problems
    pwd -P
  '

  assert_success
  [ "$output" = "$(realpath "$projects_root/problems")" ]
}

@test "cdd projects bash completion offers subcommands then project names" {
  projects_root="$BATS_TEST_TMPDIR/projects"
  mkdir -p "$projects_root/problems" "$projects_root/features"

  cd "$BATS_TEST_TMPDIR"
  export CDD_PROJECTS_DIRECTORY="$projects_root"
  source "$PROJECT_ROOT/platform/bash/completions/cdd"

  COMP_WORDS=(cdd projects "")
  COMP_CWORD=2
  COMPREPLY=()
  _cdd
  [ "${COMPREPLY[*]}" = "ls cd pwd" ]

  COMP_WORDS=(cdd projects pwd "")
  COMP_CWORD=3
  COMPREPLY=()
  _cdd
  [ "$(printf '%s\n' "${COMPREPLY[@]}" | sort)" = $'features\nproblems' ]
}

@test "cdd projects fish completion offers subcommands then project names" {
  projects_root="$BATS_TEST_TMPDIR/projects"
  mkdir -p "$projects_root/problems" "$projects_root/features"

  run env PROJECT_ROOT="$PROJECT_ROOT" CDD_PROJECTS_DIRECTORY="$projects_root" fish --no-config -c 'source "$PROJECT_ROOT/platform/fish/completions/cdd.fish"; printf "%s\n" (__cdd_projects_subcommands)'

  assert_success
  [ "$output" = $'ls\ncd\npwd' ]

  run env PROJECT_ROOT="$PROJECT_ROOT" CDD_PROJECTS_DIRECTORY="$projects_root" fish --no-config -c 'source "$PROJECT_ROOT/platform/fish/completions/cdd.fish"; complete -C "cdd projects cd p"'

  assert_success
  [ "$output" = "problems" ]
}

@test "cdd ide bash completion offers files from current and relative directories" {
  project="$BATS_TEST_TMPDIR/project"
  mkdir -p "$project/sub"
  touch "$project/file.md" "$project/local-file.txt" "$project/sub/nested-file.txt"

  cd "$project"
  source "$PROJECT_ROOT/platform/bash/completions/cdd"

  COMP_WORDS=(cdd ide "")
  COMP_CWORD=2
  COMPREPLY=()
  _cdd
  [ "$(printf '%s\n' "${COMPREPLY[@]}" | sort)" = $'file.md\nlocal-file.txt\nsub' ]

  COMP_WORDS=(cdd ide file)
  COMP_CWORD=2
  COMPREPLY=()
  _cdd
  [ "$(printf '%s\n' "${COMPREPLY[@]}" | sort)" = "file.md" ]

  COMP_WORDS=(cdd ide sub/)
  COMP_CWORD=2
  COMPREPLY=()
  _cdd
  [ "$(printf '%s\n' "${COMPREPLY[@]}" | sort)" = "sub/nested-file.txt" ]

  COMP_WORDS=(cdd ide ../p)
  COMP_CWORD=2
  COMPREPLY=()
  _cdd
  [ "$(printf '%s\n' "${COMPREPLY[@]}" | sort)" = "../project" ]
}

@test "cdd ide uses CDD_IDE_CMD before editor discovery" {
  project="$BATS_TEST_TMPDIR/project"
  mkdir -p "$project"
  touch "$project/file.txt"

  fake_bin="$BATS_TEST_TMPDIR/bin"
  mkdir -p "$fake_bin"
  cat > "$fake_bin/ide-cmd" <<'EOF'
#!/usr/bin/env bash
printf '%s\n' "$@" > "$BATS_TEST_TMPDIR/ide-args.txt"
EOF
  chmod +x "$fake_bin/ide-cmd"

  run env BATS_TEST_TMPDIR="$BATS_TEST_TMPDIR" PATH="$fake_bin:$PATH" CDD_IDE_CMD="$fake_bin/ide-cmd" "$CDD" ide "$project/file.txt"

  assert_success
  [ "$(<"$BATS_TEST_TMPDIR/ide-args.txt")" = "$(realpath "$project/file.txt")" ]
}

@test "cdd ide:which prints the configured IDE command" {
  fake_bin="$BATS_TEST_TMPDIR/bin"
  mkdir -p "$fake_bin"
  cat > "$fake_bin/ide-cmd" <<'EOF'
#!/usr/bin/env bash
printf '%s\n' "$0"
EOF
  chmod +x "$fake_bin/ide-cmd"

  run env PATH="$fake_bin:$PATH" CDD_IDE_CMD="$fake_bin/ide-cmd" "$CDD" ide:which

  assert_success
  [ "$output" = "$fake_bin/ide-cmd" ]
}

@test "cdd ide fish completion offers files from current and relative directories" {
  root="$BATS_TEST_TMPDIR/root"
  project="$root/project"
  mkdir -p "$project/sub"
  touch "$project/file.md" "$project/local-file.txt" "$project/sub/nested-file.txt"

  cd "$project"

  run env PROJECT_ROOT="$PROJECT_ROOT" fish --no-config -c 'source "$PROJECT_ROOT/platform/fish/completions/cdd.fish"; complete -C "cdd ide "'

  assert_success
  assert_output_contains "local-file.txt"
  assert_output_contains "sub"

  run env PROJECT_ROOT="$PROJECT_ROOT" fish --no-config -c 'source "$PROJECT_ROOT/platform/fish/completions/cdd.fish"; complete -C "cdd ide file"'

  assert_success
  [ "$output" = "file.md" ]

  run env PROJECT_ROOT="$PROJECT_ROOT" fish --no-config -c 'source "$PROJECT_ROOT/platform/fish/completions/cdd.fish"; complete -C "cdd ide sub/n"'

  assert_success
  assert_output_contains "sub/nested-file.txt"

  run env PROJECT_ROOT="$PROJECT_ROOT" BATS_TEST_TMPDIR="$BATS_TEST_TMPDIR" fish --no-config -c 'cd "$BATS_TEST_TMPDIR/root/project"; source "$PROJECT_ROOT/platform/fish/completions/cdd.fish"; complete -C "cdd ide ../p"'

  assert_success
  [ "$output" = "../project" ]
}
