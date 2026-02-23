A command interface for a [[Project]]

A good project has a command available for every action that is required during development, deployment and CI/CD2

A project may have multiple shells for different types of commands

/shells/
/shells/fish
/shells/mysql
/shells/artisan-tinker

Best practices:

- Point your IDE to use a particular shell for its integrated terminal in your project
- Make your shells available in PATH for your project, e.g. for bash:
```bash
export PATH=$PATH:./shells
```
