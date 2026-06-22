#!/usr/bin/env bash
# Assess source-code items by volume
set -euo pipefail

ignored_extensions=(
  3fr
  3g2
  3gp
  3gpp
  ai
  apng
  arw
  asf
  avi
  avif
  bmp
  braw
  cr2
  cr3
  crm
  crw
  dcr
  dng
  doc
  docx
  drf
  dv
  erf
  exr
  f4v
  flv
  gif
  gz
  gpr
  heic
  heif
  ico
  j2c
  j2k
  jfif
  jif
  jp2
  jpe
  jpeg
  jpg
  jpx
  k25
  kdc
  m2ts
  m2v
  m4v
  mef
  mj2
  mjpeg
  mkv
  mng
  mos
  mov
  mp4
  mpe
  mpeg
  mpg
  mpo
  mrw
  mts
  nef
  nrw
  ogm
  ogv
  orf
  pef
  pdf
  png
  psd
  raf
  rar
  raw
  rm
  rmvb
  rw2
  rwl
  sr2
  srf
  srw
  tif
  tiff
  ts
  vob
  webm
  webp
  wmv
  x3f
  xls
  xlsx
  xz
  zip
)

ignored_filenames=(
  composer.json
  package-lock.json
)

is_ignored_filename() {
  local path="$1"
  local basename ignored_filename

  basename="${path##*/}"
  for ignored_filename in "${ignored_filenames[@]}"; do
    if [ "$basename" = "$ignored_filename" ]; then
      return 0
    fi
  done

  return 1
}

declare -A dir_bytes=()
declare -A node_bytes=()
declare -A node_kind=()
declare -A child_seen=()
declare -A children_of=()
declare -a current_children=()
declare -a scroll_history=()
root_key="__root__"
top_index=0
viewport_height=1

is_ignored_extension() {
  local path="$1"
  local basename extension ignored_extension

  basename="${path##*/}"
  if [ "$basename" = "${basename%.*}" ]; then
    return 1
  fi

  extension="${basename##*.}"
  extension="${extension,,}"

  for ignored_extension in "${ignored_extensions[@]}"; do
    if [ "$extension" = "$ignored_extension" ]; then
      return 0
    fi
  done

  return 1
}

human_bytes() {
  local bytes="${1:-0}"
  local unit=0
  local rem=0
  local units=(B KiB MiB GiB TiB PiB EiB)

  while [ "$bytes" -ge 1024 ] && [ "$unit" -lt $((${#units[@]} - 1)) ]; do
    rem=$((bytes % 1024))
    bytes=$((bytes / 1024))
    unit=$((unit + 1))
  done

  if [ "$unit" -eq 0 ]; then
    printf '%s %s' "$bytes" "${units[$unit]}"
    return 0
  fi

  if [ "$rem" -eq 0 ]; then
    printf '%s %s' "$bytes" "${units[$unit]}"
    return 0
  fi

  printf '%s.%s %s' "$bytes" "$((rem * 10 / 1024))" "${units[$unit]}"
}

display_path() {
  local path="${1:-}"

  if [ -z "$path" ]; then
    printf './'
  else
    printf './%s' "$path"
  fi
}

tree_key() {
  local path="${1:-}"

  if [ -z "$path" ]; then
    printf '%s' "$root_key"
  else
    printf '%s' "$path"
  fi
}

parent_dir() {
  local path="${1:-}"

  if [[ "$path" == *"/"* ]]; then
    printf '%s' "${path%/*}"
  fi
}

add_child() {
  local parent="$1"
  local child="$2"
  local kind="${3:-dir}"
  local parent_key
  local key

  parent_key="$(tree_key "$parent")"
  key="$parent_key"$'\t'"$child"
  if [ -n "${child_seen[$key]+x}" ]; then
    return 0
  fi

  child_seen["$key"]=1
  if [ "$kind" = "dir" ]; then
    node_kind["$child"]="dir"
  fi
  children_of["$parent_key"]+="$child"$'\n'
}

add_dir_bytes() {
  local dir="$1"
  local size="$2"

  dir_bytes["$dir"]=$(( ${dir_bytes["$dir"]:-0} + size ))
}

add_node() {
  local path="$1"
  local size="$2"
  local kind="$3"

  node_bytes["$path"]="$size"
  node_kind["$path"]="$kind"
}

item_size() {
  local path="$1"

  if [ "${node_kind[$path]-}" = "file" ]; then
    printf '%s' "${node_bytes[$path]:-0}"
    return 0
  fi

  printf '%s' "${dir_bytes[$path]:-0}"
}

build_tree() {
  local ls_files_args=("--cached" "--stage" "-z")
  local index_entry mode meta path blob size current dir parent

  if [ "$#" -gt 0 ]; then
    ls_files_args+=(-- "$@")
  fi

  while IFS= read -r -d '' index_entry; do
    mode="${index_entry%% *}"
    meta="${index_entry%%$'\t'*}"
    path="${index_entry#*$'\t'}"
    blob="${meta#* }"
    blob="${blob%% *}"

    if [ "$mode" = "120000" ]; then
      continue
    fi

    if is_ignored_extension "$path"; then
      continue
    fi

    if is_ignored_filename "$path"; then
      continue
    fi

    size="$(git cat-file -s "$blob")"
    add_node "$path" "$size" file

    current="$(parent_dir "$path")"
    add_child "$current" "$path" file

    while [ -n "$current" ]; do
      add_dir_bytes "$current" "$size"
      parent="$(parent_dir "$current")"
      add_child "$parent" "$current" dir
      current="$parent"
    done
  done < <(git ls-files "${ls_files_args[@]}")
}

dump_mode=0
dump_path=""
build_tree_args=()
for arg in "$@"; do
  case "$arg" in
    --dump)
      dump_mode=1
      ;;
    --dump-path=*)
      dump_mode=1
      dump_path="${arg#--dump-path=}"
      ;;
    *)
      build_tree_args+=("$arg")
      ;;
  esac
done

sorted_children() {
  local current="$1"
  local child_list="${children_of[$(tree_key "$current")]-}"
  local child

  if [ -z "$child_list" ]; then
    return 0
  fi

  while IFS= read -r child; do
    [ -n "$child" ] || continue
    printf '%s\t%s\t%s\n' "$(item_size "$child")" "${child##*/}" "$child"
  done <<<"$child_list" |
    LC_ALL=C sort -t "$(printf '\t')" -k1,1nr -k2,2 |
    while IFS=$'\t' read -r _ _ child; do
      printf '%s\n' "$child"
    done
}

render() {
  local child selected_child selected_name selected_bytes child_count child_suffix end_index visible_index
  local -a items=()

  mapfile -t items < <(sorted_children "$current")
  current_children=("${items[@]}")
  child_count="${#current_children[@]}"
  if [ "$dump_mode" -eq 1 ]; then
    viewport_height="$child_count"
  fi

  printf '\033[2J\033[H'
  printf 'Source-code browser\n'
  printf 'Current directory: %s\n' "$(display_path "$current")"
  printf '\n'

  if [ "$child_count" -eq 0 ]; then
    printf 'No source-code items here.\n'
    return 0
  fi

  if [ "$selected" -ge "$child_count" ]; then
    selected=$((child_count - 1))
  fi

  if [ "$top_index" -gt $((child_count - viewport_height)) ]; then
    top_index=$((child_count - viewport_height))
  fi
  if [ "$top_index" -lt 0 ]; then
    top_index=0
  fi

  if [ "$selected" -lt "$top_index" ]; then
    top_index="$selected"
  fi
  if [ "$selected" -ge $((top_index + viewport_height)) ]; then
    top_index=$((selected - viewport_height + 1))
  fi

  end_index=$((top_index + viewport_height - 1))
  if [ "$end_index" -ge $((child_count - 1)) ]; then
    end_index=$((child_count - 1))
  fi

  for ((visible_index=top_index; visible_index<=end_index; visible_index++)); do
    child="${current_children[$visible_index]}"
    selected_name="${child##*/}"
    selected_bytes="$(item_size "$child")"
    child_suffix=""
    if [ "${node_kind[$child]-}" = "dir" ]; then
      child_suffix="/"
    fi
    if [ "$visible_index" -eq "$selected" ]; then
      printf '> %s%s %s\n' "$selected_name" "$child_suffix" "$(human_bytes "$selected_bytes")"
    else
      printf '  %s%s %s\n' "$selected_name" "$child_suffix" "$(human_bytes "$selected_bytes")"
    fi
  done
}

move_up() {
  if [ "${#current_children[@]}" -eq 0 ]; then
    return 0
  fi

  if [ "$selected" -gt 0 ]; then
    selected=$((selected - 1))
  fi
}

move_down() {
  if [ "${#current_children[@]}" -eq 0 ]; then
    return 0
  fi

  if [ "$selected" -lt $((${#current_children[@]} - 1)) ]; then
    selected=$((selected + 1))
  fi
}

open_selected() {
  local child

  if [ "${#current_children[@]}" -eq 0 ]; then
    return 0
  fi

  child="${current_children[$selected]}"
  if [ "${node_kind[$child]-}" != "dir" ]; then
    return 0
  fi

  history+=("$current")
  selection_history+=("$selected")
  scroll_history+=("$top_index")
  current="$child"
  selected=0
  top_index=0
}

go_back() {
  local history_index

  if [ "${#history[@]}" -eq 0 ]; then
    return 1
  fi

  history_index=$((${#history[@]} - 1))
  current="${history[$history_index]}"
  unset 'history[$history_index]'
  selected="${selection_history[$history_index]}"
  unset 'selection_history[$history_index]'
  top_index="${scroll_history[$history_index]}"
  unset 'scroll_history[$history_index]'
  return 0
}

read_key() {
  local key rest

  if ! IFS= read -rsn1 key; then
    return 1
  fi

  if [ "$key" = $'\033' ]; then
    if IFS= read -rsn2 -t 0.01 rest; then
      case "$rest" in
        '[A') key=$'k' ;;
        '[B') key=$'j' ;;
        '[C') key=$'l' ;;
        '[D') key=$'h' ;;
      esac
    fi
  fi

  printf '%s' "$key"
}

handle_key() {
  local key="$1"

  case "$key" in
    q|$'\003')
      return 1
      ;;
    j|$'\016')
      move_down
      ;;
    k|$'\020')
      move_up
      ;;
    l|$'\n'|$'\r')
      open_selected
      ;;
    h|$'\033')
      if [ "${#history[@]}" -gt 0 ]; then
        go_back
      fi
      ;;
  esac

  return 0
}

cleanup_done=

cleanup() {
  if [ -n "$cleanup_done" ]; then
    return 0
  fi

  cleanup_done=1
  stty "$old_stty_state" 2>/dev/null || true
  printf '\033[?25h'
  printf '\033[0m'
}

main() {
  if [ "$dump_mode" -eq 0 ] && { [ ! -t 0 ] || [ ! -t 1 ]; }; then
    printf 'cdd: source-code:volume:assess requires a terminal\n' >&2
    exit 1
  fi

  if [ "$dump_mode" -eq 0 ]; then
    printf 'Assessing...\n'
  fi

  git_root="$(git rev-parse --show-toplevel)"
  cd "$git_root"

  build_tree "${build_tree_args[@]}"

  current=""
  history=()
  selection_history=()
  scroll_history=()
  selected=0

  if [ "$dump_mode" -eq 1 ]; then
    current="$dump_path"
    render
    return 0
  fi

  old_stty_state="$(stty -g)"
  viewport_height="$(tput lines 2>/dev/null || printf 24)"
  viewport_height=$((viewport_height - 3))
  if [ "$viewport_height" -lt 1 ]; then
    viewport_height=1
  fi
  trap cleanup EXIT
  trap 'cleanup; exit 130' INT
  trap 'cleanup; exit 143' TERM
  stty -echo -icanon min 1 time 0
  printf '\033[?25l'

  while true; do
    render
    if ! key="$(read_key)"; then
      break
    fi

    if ! handle_key "$key"; then
      break
    fi
  done
}

if [ "${BASH_SOURCE[0]}" = "$0" ]; then
  main "$@"
fi
