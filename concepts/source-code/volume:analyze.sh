#!/usr/bin/env bash
# Print source files ordered by indexed byte size.
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

git_root="$(git rev-parse --show-toplevel)"
cd "$git_root"

tmpfile="$(mktemp)"
trap 'rm -f "$tmpfile"' EXIT

ls_files_args=(--cached --stage -z)
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

  size="$(git cat-file -s "$blob")"
  printf '%s\t%s\n' "$path" "$size" >>"$tmpfile"
done < <(git ls-files "${ls_files_args[@]}")

LC_ALL=C sort -t "$(printf '\t')" -k2,2n -k1,1 "$tmpfile" | awk -F '\t' '{ print $1, $2 }'
