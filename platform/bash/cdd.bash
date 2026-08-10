# Bash wrapper so `cdd projects:cd <project>` can change the current shell directory.
cdd() {
  if [ "$#" -eq 2 ] && [ "$1" = "projects:cd" ]; then
    local project_path

    project_path="$(command cdd projects:cd "$2")" || return
    cd "$project_path"
    return
  fi

  command cdd "$@"
}
