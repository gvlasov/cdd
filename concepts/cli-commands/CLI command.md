A CLI command is a [[Command|command]] available from a shell.

CDD promotes creating as many CLI commands as makes the project easier to operate. Whenever a developer notices a repeated shell action, a long invocation, a hard-to-remember tool command, or a project operation that should be discoverable, they are encouraged to define a command for it.

The project should feel like it comes with its own command language.

## Standard commands

CDD suggests a small standard vocabulary for common project operations:

- `help` lists available project commands
- `up` starts the local project environment
- `build` builds the project artifact
- `lint` checks code style and static correctness
- `test` runs tests

The exact implementation depends on the project, but the names should remain boring and predictable. A developer should be able to open a shell in the IDE and try `help`, `up`, `build`, `lint`, or `test` without first studying the repository.

CDD also implements some reusable shell support:

- `platform/fish/cdd.fish` provides `help` through `cdd-help`
- `platform/fish/cdd.fish` provides `cdd-cd` to jump to the project root
- `platform/fish/cdd.fish` prepends `commands` to the shell path when it exists, so project commands take precedence over commands from the default path

## Project shell

A project should expose its own command vocabulary through its [[Project shell|project shell]].

CLI commands are extremely important for project usability. When a shell opens in an IDE or terminal inside a project, the project-specific commands should already be available. A developer should not have to remember long tool invocations, change directories, or know where platform configuration lives before they can work on the project.

Command names should describe the developer's goal, not the underlying tool. The point is not to hide tools, but to make the project operable through stable, memorable commands. Tools can change underneath while the project command vocabulary remains stable.

## Placement

Commands must still be grouped by what they belong to.

If a CLI command is related to a domain concept, it makes sense to store the command code in that concept's directory.

Examples:

- A command that imports orders belongs near the orders concept.
- A command that recalculates invoices belongs near the invoices concept.
- A command that deletes users belongs near the users concept.

If a CLI command is related to a tool, framework, project lifecycle, or runtime environment, it makes sense to store the command code in `/platform/*/`.

### Examples:

- A Docker command belongs near Docker platform configuration.
- An NPM command belongs near NPM platform configuration.
- A framework wrapper belongs near that framework's platform integration.
- A project lifecycle command such as `build`, `lint`, or `test` may belong near the tool that implements it.

`/commands` is the command entrypoint directory. It should usually contain symlinks to command files, not the command implementations themselves. This keeps commands immediately available in the shell while preserving CDD's core rule: group files by concept or by tool, not by technical role.

Examples:

- `/commands/install-to-codex` can be a symlink to `/concepts/agent-skills/install-to-codex`.
- `/commands/refine` can be a symlink to `/processes/refinement/refine`.
- `/commands/npm` can be a symlink to `/platform/npm/npm`.

In this project, `commands/refine` is an example of a CLI command entrypoint. It links to `processes/refinement/refine`, because the command belongs to the refinement process rather than to the command entrypoint directory itself.

## Kinds

Commands accessible from the project shell include:

- Project-specific commands: `up`, `help`, `build`, `lint`, `test`, `load-fixture`, `delete-user`
- Framework-specific commands wrapped for project use: `artisan`, `rails`, `mix`, `manage.py`
- Package manager commands wrapped for project use: `npm`, `composer`, `yarn`, `pnpm`
- Operating system commands used directly when no project-specific wrapper is needed: `ls`, `cat`, `grep`, `systemctl`

CDD organizes project CLI commands into a single system so a developer can operate the project from one shell.
