Project directories are the default top-level and nested directories that a CDD project is expected to have.

The source of truth is [`directories-list.json`](directories-list.json).

## Directories

| Path                                                    | Purpose |
|---------------------------------------------------------| --- |
| `concepts`                                              | Concept reflections and related materials |
| [`project`](/concepts/projects/Project.md)              | Project-specific description, icon, and other project-only materials |
| [`stakeholders`](/concepts/stakeholders/Stakeholder.md) | Stakeholder reflections |
| [`processes`](/concepts/processes/Process.md)           | Process reflections |
| `platform`                                              | Platform code and tooling support |
| [`commands`](/concepts/commands/Command.md)             | Project commands for developers |
| `plans`                                                 | Stored project plans |
| `plans/problems`                                        | Active problem plans |
| `plans/features`                                        | Active feature plans |
| `plans/finished`                                        | Finished plans |
| `sandbox`                                               | Temporary or undecided work |

## `./commands`



## `./sandbox`

Anything that should not stay in the repository long-term

### Examples
- sketches
- scratchpads
- a cloned git repository for an IDE plugin to provide context for LLM about how to do something that existing plugin can do


## Isn't stakeholders just a concept? Shouldn't it belong to `/concepts`?

It is, and it can, and it would be fine. But the idea is that there are some concepts that are universal for the **development** of every project, in contrast to the concepts that are specific to this project. That's why `/stakeholders` and `/plans` and `/processes` live outside `/concepts`.