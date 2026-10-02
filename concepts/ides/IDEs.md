CDD can be used with any IDE

CDD has Jetbrains IDE support – this repository builds a [plugin for it]&#40;/platform/jetbrains/)

CDD relies on detecting the IDE that is used with it.

Open files with the `cdd ide:open [--line N] [--column N] [--project DIR] <file>` command. `--line`, `--column` and `--project` are used for the IDEs that support them (JetBrains, vim, VS Code).
Use `cdd ide:which` to print the IDE command CDD will use.

## Links from the browser

`cdd ide:open:url <jetbrains://IDE/navigate/reference?project=NAME&path=FILE:LINE:COL>` opens such a link in the IDE: it finds project `NAME` under `$CDD_PROJECTS_DIRECTORY` (up to two levels deep), maps a path from another filesystem (e.g. a docker container's `/var/www`) into it, opens the file with `cdd ide:open`, and raises the IDE window (`CDD_IDE_FOCUS_CMD` overrides how; `i3-msg` is used when available).

`cdd install` (and so `cdd self-upgrade`) registers it as the system handler of `jetbrains://` links through `cdd ide:url-handler:install`. Browser launches don't see the shell's `$EDITOR`, so the editor chosen at install time (`CDD_IDE_CMD` or `$EDITOR`) is pinned in the handler's `.desktop` file; run the install again after changing it.
