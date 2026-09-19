// Static browsable reflection of CDD CLI Commands.
export default [
  [
    {
      "kind": "identity",
      "value": "cdd.cddCliCommands"
    },
    {
      "kind": "concept",
      "value": "cdd.concept"
    },
    {
      "kind": "slug",
      "value": "cddCliCommands"
    },
    {
      "kind": "name",
      "value": "CDD CLI Commands"
    },
    {
      "kind": "definition",
      "value": "A `cdd` CLI command is a command handled by the `cdd` entrypoint itself."
    },
    {
      "kind": "details",
      "value": "CDD keeps these commands together so the entrypoint can discover, print, and dispatch them from one `kinds/` directory.\n\nCommands\n\n- `help` lists available project commands\n- `github:open` opens the current repository in GitHub\n- `commands:create` creates a project command and opens it in the editor\n- `commands:ln` links a file into `/commands` as a symlinked project command\n- `ide:open` opens a file in the user's editor\n- `ide:which` prints the IDE command CDD will use\n- `init` initializes a CDD project directory and Git repository\n- `print` prints indexed project code\n- `source-code:print` prints indexed project code and can be restricted to given paths\n- `source-code:volume` prints the indexed source-code volume in bytes\n- `source-code:volume:analyze` prints source files ordered by indexed byte size and can be restricted to given paths\n- `source-code:volume:assess` opens a terminal browser that ranks source-code items by aggregate volume\n- `skill:print` prints the freshest installed CDD skill\n- `codex:terminal` opens the last Codex session for this project in a tmuxinator-backed xterm\n- `claude:terminal` opens the last Claude Code session for this project in a tmuxinator-backed xterm\n- `plans` lists stored plans in the repository\n- `features` lists feature plans in the repository\n- `problems` lists problem plans in the repository\n- `problem` opens an existing problem plan in the editor\n- `feature` opens an existing feature plan, or creates it when missing\n- `plans:features:create` creates a feature plan\n- `plans:problems:create` creates a problem plan\n- `features:create` creates a feature plan\n- `problems:create` creates a problem plan\n- `plans:finish` finishes an active plan\n- `projects` lists or resolves projects from the projects directory\n- `project:displayName` prints the current project's display name from `/project/name`\n- `project:slug` prints the current project's slug, derived from its display name\n- `self-help` lists the `cdd` commands\n- `self-upgrade` self-upgrades CDD support from `CDD_SOURCE_PATH`\n- `transactions:list` lists all transactions by scanning for `transactions` directories\n- `llms:use codex|claude` selects the LLM command in the current project's generated tmuxinator configuration\n\nNotes\n\n- The files in `kinds/` are the source of truth for `cdd` command names and descriptions.\n- `cdd self-help` reads `kinds/` and prints its contents in the same summary style as `cdd help`."
    }
  ]
]
