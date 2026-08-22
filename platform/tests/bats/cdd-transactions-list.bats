#!/usr/bin/env bats

load test_helper

@test "cdd transactions:list lists transactions grouped by concept, sorted" {
  project="$BATS_TEST_TMPDIR/project"
  mkdir -p "$project/concepts/orders/write-operations/orders:cancel"
  mkdir -p "$project/concepts/orders/write-operations/orders:create"
  mkdir -p "$project/concepts/users/WriteOperations/users:delete"
  touch "$project/concepts/orders/write-operations/orders:create/CreateOrder.php"
  touch "$project/concepts/users/WriteOperations/users:delete/DeleteUser.php"

  cd "$project"
  git init -q

  run "$CDD" transactions:list

  assert_success
  [ "$output" = $'concepts/orders: orders:cancel\nconcepts/orders: orders:create\nconcepts/users: users:delete' ]
}

@test "cdd transactions:list ignores write-operations directories with no subdirectories" {
  project="$BATS_TEST_TMPDIR/project"
  mkdir -p "$project/concepts/orders/write-operations"

  cd "$project"
  git init -q

  run "$CDD" transactions:list

  assert_success
  [ "$output" = "" ]
}

@test "cdd transactions:list prints nothing when no write-operations directories exist" {
  project="$BATS_TEST_TMPDIR/project"
  mkdir -p "$project/concepts/orders"

  cd "$project"
  git init -q

  run "$CDD" transactions:list

  assert_success
  [ "$output" = "" ]
}
