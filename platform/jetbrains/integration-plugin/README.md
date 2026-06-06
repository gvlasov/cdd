# CDD JetBrains Integration Plugin

JetBrains IDE plugin for Concept-Driven Design projects.

## Current functionality

- Adds a `CDD` scope to the Project tool window.
- The scope contains files under these project-root directories:
  - `concepts`
  - `stakeholders`
  - `processes`
  - `platform`
  - `commands`
- The scope also contains the project-root `README.md` file.

## Development

Build the plugin:

```bash
./gradlew buildPlugin
```

Run a sandbox IDE:

```bash
./gradlew runIde
```
