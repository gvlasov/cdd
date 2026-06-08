Paste as Symlink is a user action for creating a symbolic link from an already selected or copied filesystem entry.

The intended flow is gesture-first:

- user copies a file or directory
- user selects the destination directory
- user asks the tool to paste as symlink

This avoids asking the user to manually type or browse for both source and destination paths.

In JetBrains IDEs, the CDD plugin reflects this concept as a Project View context menu action.
