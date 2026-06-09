#!/usr/bin/env bats

load test_helper

@test "cdd print prints only indexed files without ignored extensions" {
  project="$BATS_TEST_TMPDIR/project"
  mkdir -p "$project/indexed"
  cd "$project"
  git init -q

  printf 'indexed text\n' > app.txt
  printf '<svg>indexed svg</svg>\n' > vector.svg
  printf 'linked text\n' > linked.txt
  ln -s linked.txt link-to-text

  mapfile -t ignored_extensions < <(
    awk '
      /^ignored_extensions=\(/ { inside = 1; next }
      inside && /^\)/ { exit }
      inside && NF { print $1 }
    ' "$PROJECT_ROOT/processes/printing/print"
  )

  for extension in "${ignored_extensions[@]}"; do
    printf 'ignored %s\n' "$extension" > "indexed/ignored.$extension"
  done

  git add .

  printf 'unstaged text\n' > app.txt
  printf 'untracked text\n' > untracked.txt

  run "$CDD" print

  assert_success

  expected=$'\napp.txt:\nindexed text\n\nlinked.txt:\nlinked text\n\nvector.svg:\n<svg>indexed svg</svg>'
  [ "$output" = "$expected" ]
}
