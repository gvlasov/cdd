A `cdd` CLI command is a command handled by the `cdd` entrypoint itself.

CDD keeps these commands together so the entrypoint can discover, print, and dispatch them from one directory.

## Commands

- `help` lists available project commands
- `github:open` opens the current repository in GitHub
- `commands:create` creates a project command and opens it in the editor
- `ide:open` opens a file in the user's editor
- `ide:which` prints the IDE command CDD will use
- `init` initializes a CDD project directory and Git repository
- `print` prints indexed project code
- `source-code:print` prints indexed project code and can be restricted to given paths
- `source-code:volume` prints the indexed source-code volume in bytes
- `source-code:volume:analyze` prints source files ordered by indexed byte size and can be restricted to given paths
- `source-code:volume:assess` opens a terminal browser that ranks source-code items by aggregate volume
- `skill:print` prints the freshest installed CDD skill
- `plans` lists stored plans in the repository
- `problem` opens an existing problem plan in the editor
- `feature` opens an existing feature plan in the editor
- `plans:features:create` creates a feature plan
- `plans:problems:create` creates a problem plan
- `features:create` creates a feature plan
- `problems:create` creates a problem plan
- `plans:finish` finishes an active plan
- `projects` lists or resolves projects from the projects directory
- `self-help` lists the `cdd` commands
- `self-upgrade` self-upgrades CDD support from `CDD_SOURCE_PATH`

## Notes

- The files in this directory are the source of truth for `cdd` command names and descriptions.
- `cdd self-help` reads this directory and prints its contents in the same summary style as `cdd help`.
