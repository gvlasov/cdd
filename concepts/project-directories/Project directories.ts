// Static browsable reflection of Project directories.
export default [
  [
    {
      "kind": "identity",
      "value": "cdd.projectDirectories"
    },
    {
      "kind": "concept",
      "value": "cdd.concept"
    },
    {
      "kind": "slug",
      "value": "projectDirectories"
    },
    {
      "kind": "name",
      "value": "Project directories"
    },
    {
      "kind": "definition",
      "value": "Project directories are the default top-level and nested directories that a CDD project is expected to have."
    },
    {
      "kind": "details",
      "value": "The source of truth is [`directories-list.json`](directories-list.json).\n\nDirectories\n\n| Path                                                    | Purpose |\n|---------------------------------------------------------| --- |\n| `concepts`                                              | Concept reflections and related materials |\n| [`project`](cdd.project)              | Project-specific description, icon, and other project-only materials |\n| [`stakeholders`](cdd.stakeholder) | Stakeholder reflections |\n| [`processes`](cdd.process)           | Process reflections |\n| `platform`                                              | Platform code and tooling support |\n| [`commands`](cdd.command)             | Project commands for developers |\n| [`envs`](cdd.environment)          | Environment-specific configuration and materials |\n| `plans`                                                 | Stored project plans |\n| `plans/problems`                                        | Active problem plans |\n| `plans/features`                                        | Active feature plans |\n| `plans/finished`                                        | Finished plans |\n| `sandbox`                                               | Temporary or undecided work |\n\n`./commands`\n\n`./envs`\n\nEnvironment-specific configuration and materials, grouped by environment: local development, CI/CD, staging, production, etc.\n\nExamples\n- `envs/production/ssh.sh`\n- `envs/ci-cd/pipeline.yml`\n\n`./sandbox`\n\nAnything that should not stay in the repository long-term\n\nExamples\n- sketches\n- scratchpads\n- a cloned git repository for an IDE plugin to provide context for LLM about how to do something that existing plugin can do\n\nIsn't stakeholders just a concept? Shouldn't it belong to `/concepts`?\n\nIt is, and it can, and it would be fine. But the idea is that there are some concepts that are universal for the development of every project, in contrast to the concepts that are specific to this project. That's why `/stakeholders` and `/plans` and `/processes` live outside `/concepts`."
    },
    {
      "kind": "examples",
      "value": [
        "cdd.projectDirectories:examples:1",
        "cdd.projectDirectories:examples:2"
      ]
    }
  ],
  [
    {
      "kind": "identity",
      "value": "cdd.projectDirectories:examples:1"
    },
    {
      "kind": "concept",
      "value": "cdd.example"
    },
    {
      "kind": "description",
      "value": "`envs/production/ssh.sh`"
    }
  ],
  [
    {
      "kind": "identity",
      "value": "cdd.projectDirectories:examples:2"
    },
    {
      "kind": "concept",
      "value": "cdd.example"
    },
    {
      "kind": "description",
      "value": "`envs/ci-cd/pipeline.yml`"
    }
  ]
]
