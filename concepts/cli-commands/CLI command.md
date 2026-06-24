A CLI command is a [[Command|command]] available from a shell.

CDD promotes creating as many CLI commands as makes the project easier to operate. Whenever a developer notices a repeated shell action, a long invocation, a hard-to-remember tool command, or a project operation that should be discoverable, they are encouraged to define a command for it.

The project should feel like it comes with its own command language.

## Standard commands

CDD projects have dedicated directory to store project-specific CLI commands: `/commands`.

Command names and semantics that are universal for any project:

- `help` lists available project commands
- `up` starts the local project environment
- `build` builds the project artifact
- `lint` checks code style and static correctness
- `tests` runs tests
- `ssh:prod` runs ssh to production
- `run` runs a command in a one-sho CLI container (`compose exec --rm`)
- `prod:deploy` deploys to production
- `prod:deploy:dirty` deploys current local git worktree to production (without unstaged and gitignored files )

The exact implementation depends on the project, but the names should remain boring and predictable. A developer should be able to open a shell in the IDE and try `help`, `up`, `build`, `lint`, `tests` without first studying the repository.

CDD also implements some reusable shell support:

- `platform/fish/cdd.fish` provides `help` through `cdd-help`
- `platform/fish/cdd.fish` provides `cdd-cd` to jump to the project root
- `platform/fish/cdd.fish` prepends `commands` to the shell path when it exists, so project commands take precedence over commands from the default path

## `cdd` utility

CDD provides a system-wide utility `cdd` that suggests [commands for common project operations](/home/chriego/Projects/personal/cdd/concepts/cdd-cli-commands/kinds):

- `cdd init` initializes a project
- `cdd github:open` opens the project on github
- `cdd projects` lists projects in the projects directory
- `cdd projects cd spotify` cds to the directory of project named `spotify`

etc.

## Project shell

CLI commands are extremely important for project usability. When a shell opens in an IDE or terminal inside a project, the project-specific commands should already be available on a host where `cdd` is installed. A developer should not have to remember long tool invocations, change directories, or know where platform configuration lives before they can work on the project.

Command names should describe the developer's goal, not the underlying tool. The point is not to hide tools, but to make the project operable through stable, memorable commands. Tools can change underneath while the project command vocabulary remains stable.

## Placement

Command scripts, when stored in the project directory tree, must be grouped by what they belong to.

If a CLI command is related to a domain concept, it makes sense to store the command code in that concept's directory.

Examples:

- A command that imports orders belongs near the orders concept.
- A command that recalculates invoices belongs near the invoices concept.
- A command that deletes users belongs near the users concept.

If a CLI command is related to a tool, framework, project lifecycle, or runtime environment, it makes sense to store the command code in `/platform/*/`.

### Examples:

- A `compose.sh` Docker command belongs to `./platform/docker/compose.sh`, exposed as `./commands/compose`
- An `npm.sh` command belongs to `./platform/npm/npm.sh`, exposed as `./commands/npm`
- A framework wrapper belongs near that framework's platform integration, e.g. `./platform/laravel/artisan` exposed as  `./commands/artisan`
- A project lifecycle command such as `build`, `lint`, or `tests` may belong near the tool that implements it, e.g. `./platform/phpunit/phpunit.sh` exposed as `./commands/tests`

## Exposing commands

`/commands` is the command entrypoint directory. It should usually contain symlinks to command files, not the command implementations themselves. This keeps commands immediately available in the shell while preserving CDD's core rule: group files by concept or by tool, not by technical role.

Examples:

- `/commands/install-to-codex` can be a symlink to `/concepts/agent-skills/install-to-codex`.
- `/commands/refine` can be a symlink to `/processes/refinement/refine`.
- `/commands/npm` can be a symlink to `/platform/npm/npm`.

In this project, `commands/refine` is an example of a CLI command entrypoint. It links to `processes/refinement/refine`, because the command belongs to the refinement process rather than to the command entrypoint directory itself.

The usual pattern is to create the actual command script in a `/concept`/`/platform`/`/stakeholder`/`/process`/`/environment` directory and expose it with a symlink at `/commands`, with a name that does not necessarily mathc the original file. It is fine to give the original file an extension for additional context to indicate the language used in the script, but omit the extension for the exposed command for convenience.

Examples:

- `/environments/production/ssh.sh` -> `/commands/ssh:prod`
- `/platform/npm/npm.sh` -> `/commands/npm`

## Kinds

Commands accessible from the project shell include:

- Project-specific commands: `up`, `help`, `build`, `lint`, `test`, `load-fixture`, `delete-user`
- Framework-specific commands wrapped for project use: `artisan`, `rails`, `mix`, `manage.py`
- Package manager commands wrapped for project use: `npm`, `composer`, `yarn`, `pnpm`
- Operating system commands used directly when no project-specific wrapper is needed: `ls`, `cat`, `grep`, `systemctl`

CDD organizes project CLI commands into a single system so a developer can operate the project from one shell.

## Naming commands

There are a few principles for naming new commands

1. Commands are named with the names of concepts, processes, tools, verbs, project lifecycle phases
2. If it is a very commonly used command, then a single verb or the name of a lifecycle phase is enough
Examples: `build`, `tests`, `up`, `lint`
3. Commands use `:` as namespacing separator right in the filenames, e.g. `ssh:prod`
4. If the command is related to a concept in the problem domain, it should start with that concept's canonical name, e.g. `orders:create`, `users:delete`. Any level of nesting is allowed, e.g. `orders:create:from-template`.
5. If the command is related to a tool, it should start with that tool name
Examples:
    - `compose` as a shorthand for `docker compose -f $service1 -f $service2 -f $service3`
    - `phpunit` as a shorthand for `docker compose exec app vendor/bin/phpunit "$@"`
6. If a command runs something in another environment while being called in developer's local development envionrment, it can and must start with the target environment name.  Example: `prod:compose`  for production `docker compose` proxy, `ci-cd:run` to connect to CI/CD  server and run the pipeline.
7. `cdd` subcommands use the same naming principles
