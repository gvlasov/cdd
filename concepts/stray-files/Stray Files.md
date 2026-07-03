## Stray paths

Sometimes it is impossible to strictly keep the concept driven directory. Such files are called *stray files*/*stray paths* in CDD

### Examples

- Godot engine requires some files at the project root
- tsconfig and node_modules have to be at a level near or above the source code of the application to work properly with IDE
- `.obsidian/`, `.claude/` directories etc - many tools create dot-directories in the project

### What to do in this case

- Store the files in their proper place in `/platform/`/`/concepts/`/wherever, and make symlinks to the paths at the project root that the tools expect
- Use CDD scope in your IDEs project view to filter out the stray files in the project files browser
