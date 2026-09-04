Here is a list of very practical reasons to adopt CDD:

## Project shell commands

CDD promotes well-structured project-specific commands that work directly in the project shell.

Instead of asking a developer to remember long setup instructions or search through documentation, a CDD project can expose clear namespaced commands from `/commands`:

- `help` lists available project commands
- `up` starts the local environment
- `test` runs tests
- `lint` checks code quality
- `build` builds the project artifact
- `claude:install` installs the Claude integration for the project
- `codex:install` installs the Codex integration for the project

These commands should work out of the box when the developer opens a shell in the project. This makes the project easier to operate, easier to discover, and easier to onboard into.

## Meaningful file groupings

CDD groups files by the cohesion unit they belong to:

- Concept
- Process
- Tool
- Lifecycle phase

This improves [cohesion](/concepts/substances/Cohesion.md), which is the ultimate good of a codebase. Related files stay together by meaning instead of being scattered by technical role.

A developer looking for order behavior opens the orders concept. A developer looking for refinement workflow opens the refinement process. A developer looking for Docker setup opens the Docker tool/platform area. A developer looking for testing setup opens the testing lifecycle phase.

The result is a project structure that is easier to navigate, easier to explain, and easier to pass to an LLM as meaningful context.
