Source code of a project is whatever text sources can a human or LLM read about the project.

CDD allows collecting full source code of a project with `cdd source-code:print` command to feed to an LLM so that it can quickly build the full context. It excludes everything from the project that is not source code. Whenever a CDD-aware LLM must have a large-scale understanding of a project, it must read `cdd source-code:print`

Not only executable pieces qualify as source code. For example, documentation for concepts in `.md` files is considered source code too, for the purpose of building context.


### Examples

- PHP scripts
- Tests
- Markdown documentation
- [Mermaid](https://mermaid.ai/) diagrams

### What is not a project's source code
- Generated code
- Binary artifacts
- Source code of the dependency libraries
- Whatever is .gitignore'd is not considered source code, e.g. dependencies and .env files

## Source-code commands

- `cdd source-code:print` prints the full indexed source tree
- `cdd source-code:volume:analyze` ranks indexed source files by byte size
