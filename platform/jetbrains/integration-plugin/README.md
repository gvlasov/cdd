# CDD JetBrains Integration Plugin

JetBrains IDE plugin for Concept-Driven Design projects.

## Current functionality

- Adds a `CDD` scope to the Project tool window.
- Adds a `CDD` subpane under `Settings | Tools | Startup Tasks` with buttons for common CDD startup shell tasks.
- The scope contains files under these project-root directories:
  - `concepts`
  - `stakeholders`
  - `processes`
  - `platform`
  - `commands`
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
