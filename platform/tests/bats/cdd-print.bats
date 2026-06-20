#!/usr/bin/env bats

load test_helper

@test "cdd print prints only indexed files without ignored extensions" {
  project="$BATS_TEST_TMPDIR/project"
  mkdir -p "$project/indexed" "$project/subset"
  cd "$project"
  git init -q

  printf 'indexed text\n' > app.txt
  printf '<svg>indexed svg</svg>\n' > vector.svg
  printf 'linked text\n' > linked.txt
  ln -s linked.txt link-to-text
  printf 'subset text\n' > subset/app.txt
  printf '<svg>subset svg</svg>\n' > subset/vector.svg

  mapfile -t ignored_extensions < <(
    awk '
      /^ignored_extensions=\(/ { inside = 1; next }
      inside && /^\)/ { exit }
      inside && NF { print $1 }
    ' "$PROJECT_ROOT/concepts/source-code/print.sh"
  )

  for extension in "${ignored_extensions[@]}"; do
    printf 'ignored %s\n' "$extension" > "indexed/ignored.$extension"
  done

  git add .

  printf 'unstaged text\n' > app.txt
  printf 'untracked text\n' > untracked.txt

  run "$CDD" print

  assert_success

  expected=$'\napp.txt:\nindexed text\n\nlinked.txt:\nlinked text\n\nsubset/app.txt:\nsubset text\n\nsubset/vector.svg:\n<svg>subset svg</svg>\n\nvector.svg:\n<svg>indexed svg</svg>'
  [ "$output" = "$expected" ]

  run "$CDD" source-code:print

  assert_success
  [ "$output" = "$expected" ]

  run "$CDD" source-code:print subset

  assert_success
  [ "$output" = $'\nsubset/app.txt:\nsubset text\n\nsubset/vector.svg:\n<svg>subset svg</svg>' ]
}

@test "cdd source-code bash completion offers relative paths for source-code commands" {
  project="$BATS_TEST_TMPDIR/project"
  mkdir -p "$project/sub"
  touch "$project/file.txt" "$project/sub/nested.txt"

  cd "$project"
  source "$PROJECT_ROOT/platform/bash/completions/cdd"

  COMP_WORDS=(cdd source-code:print f)
  COMP_CWORD=2
  COMPREPLY=()
  _cdd
  [ "$(printf '%s\n' "${COMPREPLY[@]}" | sort)" = "file.txt" ]

  COMP_WORDS=(cdd source-code:print sub/)
  COMP_CWORD=2
  COMPREPLY=()
  _cdd
  [ "$(printf '%s\n' "${COMPREPLY[@]}" | sort)" = "sub/nested.txt" ]
}
