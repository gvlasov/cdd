A command is an action a [subject](/concepts/subjects/Subject.md) can ask a system to perform. The asking subject need not be a person — a [user](/concepts/users/User.md) is the common case, but a cron job or another process asking a system to do something is a subject too.

Commands are how a subject turns intent into effects. A command can change [state](/concepts/databases/State.md), produce feedback, start a [process](/concepts/processes/Process.md), or combine these outcomes. The important thing is that the subject is not just asking for information; the subject is asking the system to do something.

Examples:

- `rm file.txt` removes a file.
- `build` creates a project artifact.
- `up` starts a local development environment.
- A "Delete user" button removes a user.
- A "Send invoice" button starts an invoicing process.
- `artisan users:delete -v` changes user state and returns verbose execution feedback.

## Command and query

A command is different from a query.

A query asks for information without intending to change state:

- `ls`
- "Show user profile"
- "List failed jobs"

A command asks the system to perform an action:

- `rm`
- "Delete user"
- "Retry failed jobs"

This distinction follows Command-Query Separation and Command-Query Responsibility Segregation. In practice, a command may still return feedback, but feedback is not the primary purpose. The primary purpose is the requested action.

A command that changes a concept's [real volume](/concepts/classes/RealVolume.md) is a [transaction](/concepts/transactions/Transaction.md). Every transaction is a command; not every command is a transaction — some only start a [process](/concepts/processes/Process.md) or produce feedback.

## Naming

When naming a command module, prefer a verb phrase that says what action is requested.

Examples:

- `ImportOrder` instead of `OrderImport`
- `DeleteUser` instead of `UserDeletion`
- `RetryFailedJobs` instead of `FailedJobRetry`

This applies to command classes in frameworks such as Laravel as well as to other modules that implement commands. A command name should read like an imperative action, not like a process noun.

## Namespacing

Commands often need namespacing because the same action can exist for multiple concepts, tools, or lifecycle phases.

For example, a project may need import commands for orders, users, and products. A framework such as Laravel Artisan needs a predefined way to name those commands so they are easy to discover and do not collide.

A good namespace prefix is the thing the command belongs to:

- Concept name: `orders:import`, `users:import`, `products:import`
- Tool name: `composer:install`, `npm:build`, `docker:up`
- [Lifecycle phase](/concepts/lifecycle-phases/Lifecycle phase.md) name: `test:unit`, `test:e2e`, `build:frontend`, `deploy:production`

The command module can still be named as a verb phrase, such as `ImportOrder`, while the shell command name can use a namespaced form such as `orders:import`.

## Reflections

Commands can be reflected in many forms:

- Shell commands
- Buttons
- Menu actions
- HTTP endpoints
- Queue jobs
- Scheduled tasks

If a command reflects a domain concept, its implementation belongs to that concept. If it exists to operate the project or its environment, it belongs with project commands such as [CLI commands](/concepts/cli-commands/CLI command.md).
