# CDD JetBrains Integration Plugin

JetBrains IDE plugin for Concept-Driven Design projects.

## Current functionality

- Adds a `CDD` scope to the Project tool window.
- Adds `New Problem Plan` and `New Feature Plan` actions to the New menu. They always create files under `plans/problems` and `plans/features` in the project root.
- Adds a `CDD` subpane under `Settings | Tools | Startup Tasks` with buttons for common CDD startup shell tasks.
- The scope contains files under the directories listed in `concepts/project-directories/directories-list.json`.
- The scope also contains the project-root `README.md` file.
- Adds `Paste as Symlink` for copied files. When a destination directory is selected in Project View, the action creates links there immediately. When invoked from Search Everywhere without a selected destination directory, it asks for the destination directory.

## Development

Build the plugin:

```bash
./gradlew buildPlugin
```

Run a sandbox IDE:

```bash
./gradlew runIde
```
