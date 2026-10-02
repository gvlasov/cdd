#!/usr/bin/env bats

load ../../platform/tests/bats/test_helper

setup() {
  export HOME="$BATS_TEST_TMPDIR/home"
  export CDD_PROJECTS_DIRECTORY="$BATS_TEST_TMPDIR/projects"
  mkdir -p "$HOME" "$CDD_PROJECTS_DIRECTORY/group/shop/concepts/orders"
  touch "$CDD_PROJECTS_DIRECTORY/group/shop/concepts/orders/Order.vue"

  # fake IDE that records its arguments
  export OPENED="$BATS_TEST_TMPDIR/opened"
  export CDD_IDE_CMD="$BATS_TEST_TMPDIR/phpstorm"
  printf '#!/usr/bin/env bash\nprintf "%%s\\n" "$*" > "$OPENED"\n' > "$CDD_IDE_CMD"
  chmod +x "$CDD_IDE_CMD"
}

@test "ide:open:url opens the file at line and column inside its project" {
  run "$CDD" ide:open:url 'jetbrains://php-storm/navigate/reference?project=shop&path=concepts/orders/Order.vue:12:5'

  assert_success
  root="$CDD_PROJECTS_DIRECTORY/group/shop"
  [ "$(cat "$OPENED")" = "$root --line 12 --column 5 $root/concepts/orders/Order.vue" ]
}

@test "ide:open:url maps a path from another filesystem into the project" {
  run "$CDD" ide:open:url 'jetbrains://php-storm/navigate/reference?project=shop&path=/var/www/concepts/orders/Order.vue:3:1'

  assert_success
  root="$CDD_PROJECTS_DIRECTORY/group/shop"
  [ "$(cat "$OPENED")" = "$root --line 3 --column 1 $root/concepts/orders/Order.vue" ]
}

@test "ide:open:url fails for an unknown project" {
  run "$CDD" ide:open:url 'jetbrains://php-storm/navigate/reference?project=nope&path=a.vue:1:1'

  assert_failure
}
