#!/usr/bin/env bats

load test_helper

@test "cdd transactions:list glues concept and transaction names, with grey concept paths, sorted" {
  project="$BATS_TEST_TMPDIR/project"
  mkdir -p "$project/concepts/orders/transactions/cancel"
  mkdir -p "$project/concepts/orders/transactions/create"
  mkdir -p "$project/concepts/users/Transactions/delete"
  touch "$project/concepts/orders/transactions/create/CreateOrder.php"
  touch "$project/concepts/orders/transactions/cancel/CancelOrder.php"
  touch "$project/concepts/users/Transactions/delete/DeleteUser.php"

  cd "$project"
  git init -q
  git add -A

  run "$CDD" transactions:list

  assert_success

  esc=$'\033'
  expected="orders:cancel ${esc}[37m- concepts/orders${esc}[0m
orders:create ${esc}[37m- concepts/orders${esc}[0m
users:delete ${esc}[37m- concepts/users${esc}[0m"
  [ "$output" = "$expected" ]
}

@test "cdd transactions:list ignores transactions directories with no tracked files" {
  project="$BATS_TEST_TMPDIR/project"
  mkdir -p "$project/concepts/orders/transactions/create"

  cd "$project"
  git init -q

  run "$CDD" transactions:list

  assert_success
  [ "$output" = "" ]
}

@test "cdd transactions:list prints nothing when no transactions directories exist" {
  project="$BATS_TEST_TMPDIR/project"
  mkdir -p "$project/concepts/orders"
  touch "$project/concepts/orders/Order.php"

  cd "$project"
  git init -q
  git add -A

  run "$CDD" transactions:list

  assert_success
  [ "$output" = "" ]
}

@test "cdd transactions:list skips gitignored transactions" {
  project="$BATS_TEST_TMPDIR/project"
  mkdir -p "$project/concepts/orders/transactions/create"
  mkdir -p "$project/concepts/ignored-thing/transactions/txn"
  touch "$project/concepts/orders/transactions/create/CreateOrder.php"
  touch "$project/concepts/ignored-thing/transactions/txn/Ignored.php"

  cd "$project"
  git init -q
  printf 'concepts/ignored-thing/\n' > .gitignore
  git add -A

  run "$CDD" transactions:list

  assert_success

  esc=$'\033'
  [ "$output" = "orders:create ${esc}[37m- concepts/orders${esc}[0m" ]
}
