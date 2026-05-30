Cohesion is the principle that things related by meaning should stay together.

Cohesion is the most important principle of organizing a codebase. Code should be grouped by what it is about, not by incidental technical shape. If two things participate in the same meaning, they should be close to each other. If two things express different meanings, they should be separated even if a framework, file type, or habit suggests putting them together.

## Levels

Cohesion applies at every level of code organization:

- Expressions should belong to the same immediate idea.
- Statements should form one meaningful step.
- Functions should do one coherent action or calculation.
- Files, classes, and modules should reflect one concept or one tightly bound representation of a concept.
- Directories should group files by concept, process, tool, or platform concern.
- A project should contain a coherent conceptual system.

The same rule repeats at every scale: related by meaning means kept together; unrelated by meaning means split apart.

## Hierarchy

A codebase is a hierarchy of cohesion units.

Code-level cohesion units:

- A statement is a cohesion unit of expressions that belong together.
- A function is a cohesion unit of statements that belong together.
- A properly designed class or module is a cohesion unit of functions, state, and definitions that belong together.

Concept-level cohesion units:

- A concept is a cohesion unit of representations that belong together by meaning.
- A concept directory groups the concept's reflections: code, tests, views, commands, documentation, assets, and other representations of that concept.

Process-level cohesion units:

- An individual [[Process|process]] is a cohesion unit of representations that describe or implement that process.
- Process documentation, process commands, process diagrams, and process scripts belong together when they are about the same process.

Platform-level cohesion units:

- A [[Tool|tool]] is a cohesion unit for its configuration, wrappers, support files, and sometimes its generated outputs.
- Composer can have its configuration and `vendor` output grouped as a Composer/tool concern.
- NPM can have its configuration and `node_modules` output grouped as an NPM/tool concern.
- A [[Lifecycle phase|lifecycle phase]] is also a platform-level cohesion unit: testing, linting, CLI, compilation, deployment, and similar concerns group the tool setup needed to run the project.

Project-level cohesion unit:

- A [[Project|project]] is a cohesion unit composed of concepts, processes, and platform.

The hierarchy is not only about nesting files. It is about preserving meaning at every scale, from an expression inside a statement to the structure of the whole project.

## Meaning over shape

Technical similarity is not enough for cohesion.

Files are not cohesive because they are all controllers, models, tests, jobs, migrations, views, or components. They are cohesive when they describe the same part of reality or the same tool concern.

Examples:

- An order model, order view, order test, order import command, and order settlement job are cohesive because they are about orders.
- A Docker compose file, Docker helper script, and Docker documentation are cohesive because they are about Docker as a platform tool.
- All tests in one `/tests` directory are *not* cohesive by meaning; they are only similar by technical role.

## Relation to concepts

A [[Concept|concept]] is a unit of cohesion in a project.

A concept directory exists because its reflections belong together by meaning. A concept can contain classes, views, tests, commands, documentation, assets, fixtures, and any other reflections that are about that concept.

Representations of a concept inside one concept directory are highly cohesive. They can be passed to an LLM by referencing the whole directory, and the LLM can understand the concept in its entirety because the directory contains the concept's related reflections instead of scattered technical fragments.

This is why [[Concept-driven directory structure|concept-driven directory structure]] matters: it makes cohesion visible in the filesystem.

## Signs of good cohesion

- A change to one idea usually happens in one place.
- A developer can find related code by thinking about the domain concept.
- File placement can be explained by meaning.
- Names inside a unit share the same subject.
- Dependencies flow between distinct meanings rather than mixing them together.

## Signs of poor cohesion

- A single change requires editing many technical-role directories.
- A file contains expressions that are about several unrelated concepts.
- A function mixes multiple reasons to change.
- A directory groups things only because they use the same framework mechanism.
- A developer has to know the framework's storage conventions before they can find conceptually related code.

Poor cohesion creates [[Mess|mess]]: things are out of place, and the developer has to spend attention reassembling meaning from scattered fragments.
