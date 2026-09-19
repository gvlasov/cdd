// Static browsable reflection of Lifecycle phase.
export default [
  [
    {
      "kind": "identity",
      "value": "cdd.lifecyclePhase"
    },
    {
      "kind": "concept",
      "value": "cdd.concept"
    },
    {
      "kind": "slug",
      "value": "lifecyclePhase"
    },
    {
      "kind": "name",
      "value": "Lifecycle phase"
    },
    {
      "kind": "definition",
      "value": "A lifecycle phase is a recurring stage or operation in the life of a [project](cdd.project)."
    },
    {
      "kind": "details",
      "value": "Lifecycle phases are platform-level cohesion units. They group the commands, tool configuration, scripts, documentation, and generated outputs needed to move the project through a recurring operation.\n\nExamples:\n\n- `up` starts or prepares the local development environment.\n- `test` verifies behavior.\n- `lint` checks code style and static correctness.\n- `build` creates project artifacts.\n- `deploy` moves a project artifact or environment into production use.\n- `release` prepares a version for users.\n- `migrate` changes database state or schema.\n\nLifecycle phases are not usually domain concepts. They are about operating the project rather than representing the problem domain.\n\nCommands\n\nLifecycle phases commonly appear as [CLI commands](cdd.cliCommand).\n\nExamples:\n\n- `up`\n- `test`\n- `lint`\n- `build`\n- `deploy`\n\nCommands for lifecycle phases can also be namespaced when the phase has variants:\n\n- `test:unit`\n- `test:e2e`\n- `build:frontend`\n- `build:backend`\n- `deploy:staging`\n- `deploy:production`\n\nMaven\n\nMaven is an example of an explicit formalization of a project lifecycle.\n\nIt names standard lifecycle phases such as `validate`, `compile`, `test`, `package`, `verify`, `install`, and `deploy`. This makes lifecycle operations predictable: tools and plugins can attach behavior to known phases instead of inventing unrelated commands for every project.\n\nCDD does not require Maven's lifecycle model, but it uses the same underlying idea: recurring project operations deserve stable names and coherent organization."
    },
    {
      "kind": "examples",
      "value": [
        "cdd.lifecyclePhase:examples:1",
        "cdd.lifecyclePhase:examples:2",
        "cdd.lifecyclePhase:examples:3",
        "cdd.lifecyclePhase:examples:4",
        "cdd.lifecyclePhase:examples:5",
        "cdd.lifecyclePhase:examples:6",
        "cdd.lifecyclePhase:examples:7"
      ]
    }
  ],
  [
    {
      "kind": "identity",
      "value": "cdd.lifecyclePhase:examples:1"
    },
    {
      "kind": "concept",
      "value": "cdd.example"
    },
    {
      "kind": "description",
      "value": "`up` starts or prepares the local development environment."
    }
  ],
  [
    {
      "kind": "identity",
      "value": "cdd.lifecyclePhase:examples:2"
    },
    {
      "kind": "concept",
      "value": "cdd.example"
    },
    {
      "kind": "description",
      "value": "`test` verifies behavior."
    }
  ],
  [
    {
      "kind": "identity",
      "value": "cdd.lifecyclePhase:examples:3"
    },
    {
      "kind": "concept",
      "value": "cdd.example"
    },
    {
      "kind": "description",
      "value": "`lint` checks code style and static correctness."
    }
  ],
  [
    {
      "kind": "identity",
      "value": "cdd.lifecyclePhase:examples:4"
    },
    {
      "kind": "concept",
      "value": "cdd.example"
    },
    {
      "kind": "description",
      "value": "`build` creates project artifacts."
    }
  ],
  [
    {
      "kind": "identity",
      "value": "cdd.lifecyclePhase:examples:5"
    },
    {
      "kind": "concept",
      "value": "cdd.example"
    },
    {
      "kind": "description",
      "value": "`deploy` moves a project artifact or environment into production use."
    }
  ],
  [
    {
      "kind": "identity",
      "value": "cdd.lifecyclePhase:examples:6"
    },
    {
      "kind": "concept",
      "value": "cdd.example"
    },
    {
      "kind": "description",
      "value": "`release` prepares a version for users."
    }
  ],
  [
    {
      "kind": "identity",
      "value": "cdd.lifecyclePhase:examples:7"
    },
    {
      "kind": "concept",
      "value": "cdd.example"
    },
    {
      "kind": "description",
      "value": "`migrate` changes database state or schema."
    }
  ]
]
