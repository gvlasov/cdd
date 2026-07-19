A hierarchical directory structure of a [[Project]] suggested by the ontological approach to software engineering. 

**Structure:**
All project code is separated into:
- `/concepts` - all [[reflections|Reflection]] of the concepts, grouped in directories by a specific concept
- `/project` - project-only materials such as the project description, icon, and other project identity assets
- `/stakeholders` - all [[stakeholders|Stakeholder]] of the project, grouped in directories by a specific stakeholder
- `/processes` - all [[processes|Process]]
- `/platform` - code that sets up [[tools|Tool]] and [[runtime environment|Runtime environment]] - any means that run our application to reflect the problem being solved with it onto the hardware
- `/commands` - commands for the project developer to operate the project, immediately available in the [[Project shell]]
    - Setting up the project: `up`
    - Release lifecycle: `deploy`, `release`, `build`, `lint`
    - Bringing it up for manual testing
    - Operating data state from command line: `mysql` (that connects right to the database)
    - CLI commands (`artisan`)
    - GUI commands (like some launcher)
  The idea is being able to introduce a command here easily whenever you need one, and having the common commands named after the literal actions they perform, like `build`
- `/sandbox` - anything we have to actively work on but have yet to decide how to properly decompose it into concepts, stakeholders, processes, or platform. Staging area for ongoing experiments. Anything that goes here has to eventually move to `/concepts`, `/stakeholders`, `/processes`, or `/platform`.
  - Temporary storage for plans
  - For images being worked on
  - For drafts
  - For intermediate materials

**The problem it solves:**
For the entire software development history, project directory structures were created [[Tool-driven directory structure|for tools to ingest]], not for developers to understand the project. This manifests as:
- Tools want files grouped *by the tool* that uses them: tests ran with PHPUnit in /tests, source code compiled with esbuild in /src/resources/typescript. This naturally creates a kind of [shotgun surgery](https://www.wikiwand.com/en/Shotgun_surgery) where changes that should be cohesive span not many files, but many directories: 
	- backend changes in one directory, 
	- frontend changes in another directory, 
	- documentation changes in yet another directory.
- Every tool is a CLI instrument that you would want to run as simply as possible, so their configuration files would naturally be placed at the root of a repository, dedicating the / level as something for tools, e.g. /package.json for `npm`. This is fine while your configs are simple, but when they start requiring additional files, you will want to group them together so they are not scattered all over the codebase. And also it would result in transient directories like `node_modules` to appear at the root of the project.

Grouping files like that is great, because when a person or an LLM browses the codebase, the quesitons that arise are:
- How does this thing work? (browse `/concepts/$thing`)
- How do we use this tool? (browse `/platform/$tool`)
- Who are the stakeholders and what are their expectations? (browse `/stakeholders/$group`)
- What are we going to do next? (browse `/plans/{features,problems}`)
- What do I as a developer can and need to do within this project (browse `/commands`)

Inspiration is drawn from:
- Feature-sliced directory structure
- Wikipedia – organizing everything about a concept in one place, with links between concepts and no single definitional hierarchy of the concepts, there is no "root" concept on Wikipedia – only reflections of the real world.
- Bob Martin's "screaming architecture" concept
- REST's convention of organizing an API around resources (nouns) rather than actions – CDD concepts generalize this noun-first organization from the network boundary to the whole repository

See [[Diagram.url]]

**Example:**

```
/concepts/
/project/
/stakeholders/
/processes/
/platform/
/commands/
/commands/up
/concepts/apples/
/concepts/apples/Apple.php
/concepts/apples/Apple.vue
/concepts/apples/AppleGatheringJob.php
/concepts/apples/AppleIndex.php
/concepts/trees/
/concepts/trees/Tree.php
/concepts/trees/tree.ini
/concepts/trees/images/Tree1.png
/concepts/trees/images/Tree2.png
/concepts/trees/README.md
/platform/containers/docker-compose.yaml
/platform/frontend/vite.config.ts
/platform/typescript/tsconfig.json
/platform/dependencies/package.json
/platform/entrypoints
```

**Rules:**
- Concepts, stakeholders, processes, and platform are the main separation. It is deemed the most useful distinction for the project code, because most of the time you can definitely say if some expression reflects a concept, a stakeholder, a process, or platform code.
	- UI views, 
	- database models, 
	- controllers, 
	- resources, 
	- tests
	- migrations for the models - extracted in classes, with subsequent migration code as separate methods, but called somewhere in called in /platform/migrations / /platform/databases
- Platform code is anything that sets up the frameworks and operating system tools to run the application: infrastructure
	- Docker, 
	- package managers, 
	- linters, 
	- test runners
	- entry points for various runtime environments (e.g., artisan.php as CLI entry point and index.php as web entry point for Laravel)
- Commands are scripts used by developers to operate the project.
	- Use `/commands` as the single command entrypoint directory.
	- Prefer symlinks from `/commands` to implementations placed with the concept, stakeholder, process, or platform concern they belong to.


Anything that is still in /platform but relates to a specific concept, stakeholder, or process must be extracted from the platform to that directory.
