A `cdd` CLI command is a command handled by the `cdd` entrypoint itself.

CDD keeps these commands together so the entrypoint can discover, print, and dispatch them from one `kinds/` directory.

## Commands

- `help` lists available project commands
- `github:open` opens the current repository in GitHub
- `commands:create` creates a project command and opens it in the editor
- `commands:ln` links a file into `/commands` as a symlinked project command
- `ide:open` opens a file in the user's editor
- `ide:which` prints the IDE command CDD will use
- `init` initializes a CDD project directory and Git repository
- `print` prints indexed project code
- `source-code:print` prints indexed project code and can be restricted to given paths
- `source-code:volume` prints the indexed source-code volume in bytes
- `source-code:volume:analyze` prints source files ordered by indexed byte size and can be restricted to given paths
- `source-code:volume:assess` opens a terminal browser that ranks source-code items by aggregate volume
- `skill:print` prints the freshest installed CDD skill
- `codex:terminal` opens the last Codex session for this project in a tmuxinator-backed xterm
- `claude:terminal` opens the last Claude Code session for this project in a tmuxinator-backed xterm
- `plans` lists stored plans in the repository
- `features` lists feature plans in the repository
- `problems` lists problem plans in the repository
- `problem` opens an existing problem plan in the editor
- `feature` opens an existing feature plan, or creates it when missing
- `plans:features:create` creates a feature plan
- `plans:problems:create` creates a problem plan
- `features:create` creates a feature plan
- `problems:create` creates a problem plan
- `plans:finish` finishes an active plan
- `projects` lists or resolves projects from the projects directory
- `project:displayName` prints the current project's display name from `/project/name`
- `project:slug` prints the current project's slug, derived from its display name
- `self-help` lists the `cdd` commands
- `self-upgrade` self-upgrades CDD support from `CDD_SOURCE_PATH`
- `transactions:list` lists all transactions by scanning for `transactions` directories
- `llms:use codex|claude` selects the LLM command in the current project's generated tmuxinator configuration

## Notes

- The files in `kinds/` are the source of truth for `cdd` command names and descriptions.
- `cdd self-help` reads `kinds/` and prints its contents in the same summary style as `cdd help`.
