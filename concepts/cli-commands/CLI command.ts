// Static browsable reflection of CLI command.
export default [
  [
    {
      "kind": "identity",
      "value": "cdd.cliCommand"
    },
    {
      "kind": "concept",
      "value": "cdd.concept"
    },
    {
      "kind": "slug",
      "value": "cliCommand"
    },
    {
      "kind": "name",
      "value": "CLI command"
    },
    {
      "kind": "definition",
      "value": "A CLI command is a [command](cdd.command) available from a shell."
    },
    {
      "kind": "details",
      "value": "CDD promotes creating as many CLI commands as makes the project easier to operate. Whenever a developer notices a repeated shell action, a long invocation, a hard-to-remember tool command, or a project operation that should be discoverable, they are encouraged to define a command for it.\n\nThe project should feel like it comes with its own command language.\n\nStandard commands\n\nCDD projects have dedicated directory to store project-specific CLI commands: `/commands`.\n\nCommand names and semantics that are universal for any project:\n\n- `help` lists available project commands\n- `up` starts the local project environment\n- `build` builds the project artifact\n- `lint` checks code style and static correctness\n- `tests` runs tests\n- `ssh:prod` runs ssh to production\n- `run` runs a command in a one-sho CLI container (`compose exec --rm`)\n- `prod:deploy` deploys to production\n- `prod:deploy:dirty` deploys current local git worktree to production (without unstaged and gitignored files )\n\nThe exact implementation depends on the project, but the names should remain boring and predictable. A developer should be able to open a shell in the IDE and try `help`, `up`, `build`, `lint`, `tests` without first studying the repository.\n\nCDD also implements some reusable shell support:\n\n- `platform/fish/cdd.fish` provides `help` through `cdd-help`\n- `platform/fish/cdd.fish` provides `cdd-cd` to jump to the project root\n- `platform/fish/cdd.fish` keeps the current project's `commands` directory on `PATH`, so project commands take precedence over commands from the default path. It re-evaluates on every directory change: `cd`ing into another CDD project swaps in that project's commands, and `cd`ing outside every CDD project removes them.\n\n`cdd` utility\n\nCDD provides a system-wide utility `cdd` that suggests [commands for common project operations](/home/chriego/Projects/personal/cdd/concepts/cdd-cli-commands/kinds):\n\n- `cdd init` initializes a project\n- `cdd github:open` opens the project on github\n- `cdd projects` lists projects in the projects directory\n- `cdd projects:cd spotify` cds to the directory of project named `spotify`\n\netc.\n\nProject shell\n\nCLI commands are extremely important for project usability. When a shell opens in an IDE or terminal inside a project, the project-specific commands should already be available on a host where `cdd` is installed. A developer should not have to remember long tool invocations, change directories, or know where platform configuration lives before they can work on the project.\n\nCommand names should describe the developer's goal, not the underlying tool. The point is not to hide tools, but to make the project operable through stable, memorable commands. Tools can change underneath while the project command vocabulary remains stable.\n\nPlacement\n\nCommand scripts, when stored in the project directory tree, must be grouped by what they belong to.\n\nIf a CLI command is related to a domain concept, it makes sense to store the command code in that concept's directory.\n\nExamples:\n\n- A command that imports orders belongs near the orders concept.\n- A command that recalculates invoices belongs near the invoices concept.\n- A command that deletes users belongs near the users concept.\n\nIf a CLI command is related to a tool, framework, project lifecycle, or runtime environment, it makes sense to store the command code in `/platform/*/`.\n\nExamples:\n\n- A `compose.sh` Docker command belongs to `./platform/docker/compose.sh`, exposed as `./commands/compose`\n- An `npm.sh` command belongs to `./platform/npm/npm.sh`, exposed as `./commands/npm`\n- A framework wrapper belongs near that framework's platform integration, e.g. `./platform/laravel/artisan` exposed as  `./commands/artisan`\n- A project lifecycle command such as `build`, `lint`, or `tests` may belong near the tool that implements it, e.g. `./platform/phpunit/phpunit.sh` exposed as `./commands/tests`\n\nExposing commands\n\n`/commands` is the command entrypoint directory. It should usually contain symlinks to command files, not the command implementations themselves. This keeps commands immediately available in the shell while preserving CDD's core rule: group files by concept or by tool, not by technical role.\n\nExamples:\n\n- `/commands/install-to-codex` can be a symlink to `/concepts/agent-skills/install-to-codex`.\n- `/commands/refine` can be a symlink to `/processes/refinement/refine`.\n- `/commands/npm` can be a symlink to `/platform/npm/npm`.\n\nIn this project, `commands/refine` is an example of a CLI command entrypoint. It links to `processes/refinement/refine`, because the command belongs to the refinement process rather than to the command entrypoint directory itself.\n\nThe usual pattern is to create the actual command script in a `/concept`/`/platform`/`/stakeholder`/`/process`/`/envs` directory and expose it with a symlink at `/commands`, with a name that does not necessarily mathc the original file. It is fine to give the original file an extension for additional context to indicate the language used in the script, but omit the extension for the exposed command for convenience.\n\nExamples:\n\n- `/envs/production/ssh.sh` -> `/commands/ssh:prod`\n- `/platform/npm/npm.sh` -> `/commands/npm`\n\n`cdd commands:ln`\n\n`cdd commands:ln <source-file> <command-name>` creates the symlink for you:\n\n```bash\ncdd commands:ln platform/npm/npm.sh npm\ncdd commands:ln envs/production/ssh.sh ssh:prod\ncdd commands:ln concepts/people/create-person.sh people:create\n```\n\nIt makes the source file executable, creates `/commands` if missing, computes the correct relative symlink target regardless of how deep the source file is nested, and refuses to overwrite an existing command. This exists because the implementation belongs with its concept, stakeholder, process, or platform directory, while the exposed name lives in `/commands` — `commands:ln` makes that split easy so there is no temptation to shortcut it by writing the command body directly into `/commands`.\n\nKinds\n\nCommands accessible from the project shell include:\n\n- Project-specific commands: `up`, `help`, `build`, `lint`, `test`, `load-fixture`, `delete-user`\n- Framework-specific commands wrapped for project use: `artisan`, `rails`, `mix`, `manage.py`\n- Package manager commands wrapped for project use: `npm`, `composer`, `yarn`, `pnpm`\n- Operating system commands used directly when no project-specific wrapper is needed: `ls`, `cat`, `grep`, `systemctl`\n\nCDD organizes project CLI commands into a single system so a developer can operate the project from one shell.\n\nNaming project-wide commands\n\nThere are a few principles for naming new project-wide commands\n\n0. There are \"full-form\" commands whose name start with the concept they represent, that is the first \"part\". They use `:` as part separators. Then in the following order go optional parts that represent an\n   - attribute - noun\n   - subset - adverb\n   - operation - verb\n   - mode - adverb\n   Examples: \n   - `errors:list`\n   - `errors:fatal:list`\n   - `errors:clear`\n   - `errors:fatal:clear`\n   - `users:create`\nException: when is a proxy to run something in another environment (not in the local dev environment), the name of the environment becomes the first part\nExamples:\n   - `prod:composer`\n   - `cicd:run`\n   - `staging:database:reset`\nThis style is inherited from Laravel's `artisan` command naming style.\nThe commands otherwise follow the standard POSIX convention: \n1. If developer needs a command with a certain name for a certain operation, he must be free to create one.\n2. Commands are named with the names of concepts, processes, tools, verbs, project lifecycle phases\n3. If it is a very commonly used command, then a single verb or the name of a lifecycle phase is enough\nExamples: `build`, `tests`, `up`, `lint`\n4. Commands use `:` as namespacing separator right in the filenames, e.g. `ssh:prod`\n5. If the command is related to a concept in the problem domain, it should start with that concept's canonical name, e.g. `orders:create`, `users:delete`. Any level of nesting is allowed, e.g. `orders:create:from-template`.\n6. If the command is related to a tool, it should start with that tool name\nExamples:\n    - `compose` as a shorthand for `docker compose -f $service1 -f $service2 -f $service3`\n    - `phpunit` as a shorthand for `docker compose exec app vendor/bin/phpunit \"$@\"`\n7. If a command runs something in another environment while being called in developer's local development envionrment, it can and must start with the target environment name.  Example: `prod:compose`  for production `docker compose` proxy, `ci-cd:run` to connect to CI/CD  server and run the pipeline.\n8. `cdd` subcommands use the same naming principles"
    },
    {
      "kind": "examples",
      "value": [
        "cdd.cliCommand:examples:1",
        "cdd.cliCommand:examples:2",
        "cdd.cliCommand:examples:3"
      ]
    }
  ],
  [
    {
      "kind": "identity",
      "value": "cdd.cliCommand:examples:1"
    },
    {
      "kind": "concept",
      "value": "cdd.example"
    },
    {
      "kind": "description",
      "value": "A command that imports orders belongs near the orders concept."
    }
  ],
  [
    {
      "kind": "identity",
      "value": "cdd.cliCommand:examples:2"
    },
    {
      "kind": "concept",
      "value": "cdd.example"
    },
    {
      "kind": "description",
      "value": "A command that recalculates invoices belongs near the invoices concept."
    }
  ],
  [
    {
      "kind": "identity",
      "value": "cdd.cliCommand:examples:3"
    },
    {
      "kind": "concept",
      "value": "cdd.example"
    },
    {
      "kind": "description",
      "value": "A command that deletes users belongs near the users concept."
    }
  ]
]
