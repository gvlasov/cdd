# Bash wrapper so `cdd projects cd <project>` can change the current shell directory.
cdd() {
  if [ "$#" -eq 3 ] && [ "$1" = projects ] && [ "$2" = cd ]; then
    local project_path

    project_path="$(command cdd projects pwd "$3")" || return
    cd "$project_path"
    return
  fi

  command cdd "$@"
}
