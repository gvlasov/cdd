Maps [[User|user]] input to a [[Goal|goal]], with 0+ changes to state and 0+ user feedbacks

Commands accessible from project [[shell]] are called CLI commands. They include
- Project-specific commands: `load-fixture`, `delete-user`, `up`
- Framework-specific commands `artisan`
- CLI tools: `npm`, `composer`, `yarn`
- OS commands: `ls`, `cat`, `grep`, `systemctl`

Examples:
	- `ls` - 0 changes to state, user feedback in the form of output.
	- `rm` - changes state - removes the file - but no user feedback by default.
	- `artisan users:delete -v` - changes state by executing a transaction to users database, does feedback with some verbose output.

CDD aims to organize all kinds of shell commands into a single system, making sure that developer doesn't have to `cd` around to call various CLI commands. CDD puts every command into IDE shell always accessible to developer when working on a CDD project.

- Docker configuration lives in `/platform/docker/docker-compose.yml`, but `/commands/dev/compose` is a command that is added to `$PATH` automatically and allows developer to work with project's containerized environment from a shell in project root.
- NPM configuration lives in `/platform/npm/package.json`, but `/commands/dev/npm` is a command that is added to `$PATH` automatically and allows developer to work with project's javascript dependencies from a shell in project root

Then technically any operation on the data storage is a command, in accord with the notions for [Command-Query Separation (CQS)](https://www.wikiwand.com/en/Command%E2%80%93query_separation) and [Command-Query Responsibility Segregation (CQRS)]()