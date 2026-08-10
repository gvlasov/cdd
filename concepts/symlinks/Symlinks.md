[Symlinks](https://www.wikiwand.com/en/Symbolic_link) can be pretty useful in CDD!

CDD is based on a hierarchy represented by the file system. But oftentimes you want the same file in multiple places, because it belongs to all those places, but that would violate the hierarchy. Symlinks can help with file access from different semantical areas.

### Examples

- A screen specification belongs both to the stakeholder that sees the screen and to the concept reflected by that screen
- A command that runs some process belongs both to the list of commands in `/commands/` and to that process in `/processes/`
- IntelliJ IDEA wants tsconfig.json at the repository root to properly load the paths, so it is stored in `/platform/typescript/tsconfig.json` and symlinked as `/tsconfig.json`
- Any dotdirs and dotfiles that require to live in the project root: `/platform/claude` -> `/.claude`