#!/usr/bin/env bats

load test_helper

@test "cdd plans lists stored plans with grey descriptions" {
  project="$BATS_TEST_TMPDIR/project"
  mkdir -p "$project/plans/problems" "$project/plans/features"

  cat > "$project/plans/problems/login-failure.md" <<'EOF'
# Login failure

Describe the login problem.
EOF

  cat > "$project/plans/features/remember-me.md" <<'EOF'
# Remember me

Describe the feature.
EOF

  cd "$project"

  run "$CDD" plans

  assert_success
  esc=$'\033'
  assert_output_contains "problems/login-failure ${esc}[37m- login failure${esc}[0m"
  assert_output_contains "features/remember-me ${esc}[37m- remember me${esc}[0m"
}

@test "cdd plans:problems:create creates and opens a problem plan" {
  project="$BATS_TEST_TMPDIR/project"
  fake_bin="$BATS_TEST_TMPDIR/bin"
  opened_file="$BATS_TEST_TMPDIR/opened-file"
  mkdir -p "$project" "$fake_bin"

  cat > "$fake_bin/editor" <<EOF
#!/usr/bin/env bash
printf '%s\n' "\$1" > "$opened_file"
EOF
  chmod +x "$fake_bin/editor"

  cd "$project"

  run env PATH="$fake_bin:$PATH" EDITOR="$fake_bin/editor" "$CDD" plans:problems:create "Problem description"

  assert_success
  [ -f "$project/plans/problems/problem-description.md" ]
  [ "$(cat "$opened_file")" = "$(realpath "$project/plans/problems/problem-description.md")" ]
  grep -q '^# Problem description$' "$project/plans/problems/problem-description.md"
}

@test "cdd problems:create is a synonym for plans:problems:create" {
  project="$BATS_TEST_TMPDIR/project"
  fake_bin="$BATS_TEST_TMPDIR/bin"
  opened_file="$BATS_TEST_TMPDIR/opened-file"
  mkdir -p "$project" "$fake_bin"

  cat > "$fake_bin/editor" <<EOF
#!/usr/bin/env bash
printf '%s\n' "\$1" > "$opened_file"
EOF
  chmod +x "$fake_bin/editor"

  cd "$project"

  run env PATH="$fake_bin:$PATH" EDITOR="$fake_bin/editor" "$CDD" problems:create "Problem description"

  assert_success
  [ -f "$project/plans/problems/problem-description.md" ]
  [ "$(cat "$opened_file")" = "$(realpath "$project/plans/problems/problem-description.md")" ]
  grep -q '^# Problem description$' "$project/plans/problems/problem-description.md"
}

@test "cdd plans:features:create creates and opens a feature plan" {
  project="$BATS_TEST_TMPDIR/project"
  fake_bin="$BATS_TEST_TMPDIR/bin"
  opened_file="$BATS_TEST_TMPDIR/opened-file"
  mkdir -p "$project" "$fake_bin"

  cat > "$fake_bin/editor" <<EOF
#!/usr/bin/env bash
printf '%s\n' "\$1" > "$opened_file"
EOF
  chmod +x "$fake_bin/editor"

  cd "$project"

  run env PATH="$fake_bin:$PATH" EDITOR="$fake_bin/editor" "$CDD" plans:features:create "Feature description"

  assert_success
  [ -f "$project/plans/features/feature-description.md" ]
  [ "$(cat "$opened_file")" = "$(realpath "$project/plans/features/feature-description.md")" ]
  grep -q '^# Feature description$' "$project/plans/features/feature-description.md"
}

@test "cdd features:create is a synonym for plans:features:create" {
  project="$BATS_TEST_TMPDIR/project"
  fake_bin="$BATS_TEST_TMPDIR/bin"
  opened_file="$BATS_TEST_TMPDIR/opened-file"
  mkdir -p "$project" "$fake_bin"

  cat > "$fake_bin/editor" <<EOF
#!/usr/bin/env bash
printf '%s\n' "\$1" > "$opened_file"
EOF
  chmod +x "$fake_bin/editor"

  cd "$project"

  run env PATH="$fake_bin:$PATH" EDITOR="$fake_bin/editor" "$CDD" features:create "Feature description"

  assert_success
  [ -f "$project/plans/features/feature-description.md" ]
  [ "$(cat "$opened_file")" = "$(realpath "$project/plans/features/feature-description.md")" ]
  grep -q '^# Feature description$' "$project/plans/features/feature-description.md"
}

@test "cdd problem opens an existing problem plan in the editor" {
  project="$BATS_TEST_TMPDIR/project"
  fake_bin="$BATS_TEST_TMPDIR/bin"
  opened_file="$BATS_TEST_TMPDIR/opened-file"
  mkdir -p "$project/plans/problems" "$fake_bin"

  cat > "$project/plans/problems/login-failure.md" <<'EOF'
# Login failure

Describe the problem.
EOF

  cat > "$fake_bin/editor" <<EOF
#!/usr/bin/env bash
printf '%s\n' "\$1" > "$opened_file"
EOF
  chmod +x "$fake_bin/editor"

  cd "$project"

  run env PATH="$fake_bin:$PATH" EDITOR="$fake_bin/editor" "$CDD" problem login-failure

  assert_success
  [ "$(cat "$opened_file")" = "$(realpath "$project/plans/problems/login-failure.md")" ]
}

@test "cdd feature opens an existing feature plan in the editor" {
  project="$BATS_TEST_TMPDIR/project"
  fake_bin="$BATS_TEST_TMPDIR/bin"
  opened_file="$BATS_TEST_TMPDIR/opened-file"
  mkdir -p "$project/plans/features" "$fake_bin"

  cat > "$project/plans/features/remember-me.md" <<'EOF'
# Remember me

Describe the feature.
EOF

  cat > "$fake_bin/editor" <<EOF
#!/usr/bin/env bash
printf '%s\n' "\$1" > "$opened_file"
EOF
  chmod +x "$fake_bin/editor"

  cd "$project"

  run env PATH="$fake_bin:$PATH" EDITOR="$fake_bin/editor" "$CDD" feature remember-me

  assert_success
  [ "$(cat "$opened_file")" = "$(realpath "$project/plans/features/remember-me.md")" ]
}

@test "cdd plans:finish moves an active plan into finished and opens it" {
  project="$BATS_TEST_TMPDIR/project"
  fake_bin="$BATS_TEST_TMPDIR/bin"
  opened_file="$BATS_TEST_TMPDIR/opened-file"
  mkdir -p "$project/plans/problems" "$fake_bin"

  cat > "$project/plans/problems/login-failure.md" <<'EOF'
# Login failure

Describe the problem.
EOF

  cat > "$fake_bin/editor" <<EOF
#!/usr/bin/env bash
printf '%s\n' "\$1" > "$opened_file"
EOF
  chmod +x "$fake_bin/editor"

  cd "$project"

  run env PATH="$fake_bin:$PATH" EDITOR="$fake_bin/editor" "$CDD" plans:finish problems/login-failure.md

  assert_success
  [ ! -e "$project/plans/problems/login-failure.md" ]
  [ -f "$project/plans/finished/problems/login-failure.md" ]
  [ "$(cat "$opened_file")" = "$(realpath "$project/plans/finished/problems/login-failure.md")" ]
}

@test "cdd plans:finish bash completion offers contents of the plans directory" {
  project="$BATS_TEST_TMPDIR/project"
  mkdir -p "$project/plans/problems" "$project/plans/features" "$project/plans/finished"

  cat > "$project/plans/problems/login-failure.md" <<'EOF'
# Login failure
EOF

  cat > "$project/plans/features/remember-me.md" <<'EOF'
# Remember me
EOF

  cd "$project"

  source "$PROJECT_ROOT/platform/bash/completions/cdd"

  COMP_WORDS=(cdd plans:finish "")
  COMP_CWORD=2
  COMPREPLY=()
  _cdd
  [ "$(printf '%s\n' "${COMPREPLY[@]}" | sort)" = $'features\nfinished\nproblems' ]

  COMP_WORDS=(cdd plans:finish problems/l)
  COMP_CWORD=2
  COMPREPLY=()
  _cdd
  [ "${COMPREPLY[*]}" = "problems/login-failure.md" ]
}

@test "cdd plans:finish fish completion offers contents of the plans directory" {
  project="$BATS_TEST_TMPDIR/project"
  mkdir -p "$project/plans/problems" "$project/plans/features" "$project/plans/finished"

  cat > "$project/plans/problems/login-failure.md" <<'EOF'
# Login failure
EOF

  cat > "$project/plans/features/remember-me.md" <<'EOF'
# Remember me
EOF

  cd "$project"

  run env PROJECT_ROOT="$PROJECT_ROOT" fish --no-config -c 'source "$PROJECT_ROOT/platform/fish/completions/cdd.fish"; printf "%s\n" (__cdd_plans_finish_complete "")'

  assert_success
  [ "$output" = $'features/\nfinished/\nproblems/' ]

  run env PROJECT_ROOT="$PROJECT_ROOT" fish --no-config -c 'source "$PROJECT_ROOT/platform/fish/completions/cdd.fish"; printf "%s\n" (__cdd_plans_finish_complete "problems/l")'

  assert_success
  [ "$output" = "problems/login-failure.md" ]
}

@test "cdd feature and problem bash completions offer contents of their plan directories" {
  project="$BATS_TEST_TMPDIR/project"
  mkdir -p "$project/plans/problems" "$project/plans/features"

  cat > "$project/plans/problems/login-failure.md" <<'EOF'
# Login failure
EOF

  cat > "$project/plans/features/remember-me.md" <<'EOF'
# Remember me
EOF

  cd "$project"

  source "$PROJECT_ROOT/platform/bash/completions/cdd"

  COMP_WORDS=(cdd problem "")
  COMP_CWORD=2
  COMPREPLY=()
  _cdd
  [ "${COMPREPLY[*]}" = "login-failure.md" ]

  COMP_WORDS=(cdd feature "")
  COMP_CWORD=2
  COMPREPLY=()
  _cdd
  [ "${COMPREPLY[*]}" = "remember-me.md" ]
}

@test "cdd feature and problem fish completions offer contents of their plan directories" {
  project="$BATS_TEST_TMPDIR/project"
  mkdir -p "$project/plans/problems" "$project/plans/features"

  cat > "$project/plans/problems/login-failure.md" <<'EOF'
# Login failure
EOF

  cat > "$project/plans/features/remember-me.md" <<'EOF'
# Remember me
EOF

  cd "$project"

  run env PROJECT_ROOT="$PROJECT_ROOT" fish --no-config -c 'source "$PROJECT_ROOT/platform/fish/completions/cdd.fish"; printf "%s\n" (__cdd_plans_open_complete problem l)'

  assert_success
  [ "$output" = "login-failure.md" ]

  run env PROJECT_ROOT="$PROJECT_ROOT" fish --no-config -c 'source "$PROJECT_ROOT/platform/fish/completions/cdd.fish"; printf "%s\n" (__cdd_plans_open_complete feature r)'

  assert_success
  [ "$output" = "remember-me.md" ]
}
