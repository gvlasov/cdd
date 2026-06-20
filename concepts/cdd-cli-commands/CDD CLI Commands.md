A `cdd` CLI command is a command handled by the `cdd` entrypoint itself.

CDD keeps these commands together so the entrypoint can discover, print, and dispatch them from one directory.

## Commands

- `help` lists available project commands
- `github:open` opens the current repository in GitHub
- `ide` opens a file in the user's editor
- `ide:which` prints the IDE command CDD will use
- `init` initializes a CDD project directory
- `print` prints indexed project code
- `source-code:print` prints indexed project code
- `plans` lists stored plans in the repository
- `plans:create:feature` creates a feature plan
- `plans:create:problem` creates a problem plan
- `plans:finish` finishes an active plan
- `projects` lists or resolves projects from the projects directory
- `self-help` lists the `cdd` commands
- `self-upgrade` self-upgrades CDD support from `CDD_SOURCE_PATH`

## Notes

- The files in this directory are the source of truth for `cdd` command names and descriptions.
- `cdd self-help` reads this directory and prints its contents in the same summary style as `cdd help`.
