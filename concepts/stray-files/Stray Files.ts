// Static browsable reflection of Stray Files.
export default [
  [
    {
      "kind": "identity",
      "value": "cdd.strayFiles"
    },
    {
      "kind": "concept",
      "value": "cdd.concept"
    },
    {
      "kind": "slug",
      "value": "strayFiles"
    },
    {
      "kind": "name",
      "value": "Stray Files"
    },
    {
      "kind": "definition",
      "value": "Stray paths"
    },
    {
      "kind": "details",
      "value": "Sometimes it is impossible to strictly keep the concept driven directory. Such files are called *stray files*/*stray paths* in CDD\n\nExamples\n\n- Godot engine requires some files at the project root\n- tsconfig and node_modules have to be at a level near or above the source code of the application to work properly with IDE\n- `.obsidian/`, `.claude/` directories etc - many tools create dot-directories in the project\n- Some things require that a file is present at the repository root - for example, Jetbrains IDE will need tsconfig.json at the repository root to correctly detect code paths to suggest paths completion. This is cleanly handled in CDD with [symlinks](cdd.symlinks)\n\nWhat to do in this case\n\n- Store the files in their proper place in `/platform/`/`/concepts/`/wherever, and make symlinks to the paths at the project root that the tools expect\n- Use CDD scope in your IDEs project view to filter out the stray files in the project files browser"
    },
    {
      "kind": "examples",
      "value": [
        "cdd.strayFiles:examples:1",
        "cdd.strayFiles:examples:2",
        "cdd.strayFiles:examples:3",
        "cdd.strayFiles:examples:4"
      ]
    }
  ],
  [
    {
      "kind": "identity",
      "value": "cdd.strayFiles:examples:1"
    },
    {
      "kind": "concept",
      "value": "cdd.example"
    },
    {
      "kind": "description",
      "value": "Godot engine requires some files at the project root"
    }
  ],
  [
    {
      "kind": "identity",
      "value": "cdd.strayFiles:examples:2"
    },
    {
      "kind": "concept",
      "value": "cdd.example"
    },
    {
      "kind": "description",
      "value": "tsconfig and node_modules have to be at a level near or above the source code of the application to work properly with IDE"
    }
  ],
  [
    {
      "kind": "identity",
      "value": "cdd.strayFiles:examples:3"
    },
    {
      "kind": "concept",
      "value": "cdd.example"
    },
    {
      "kind": "description",
      "value": "`.obsidian/`, `.claude/` directories etc - many tools create dot-directories in the project"
    }
  ],
  [
    {
      "kind": "identity",
      "value": "cdd.strayFiles:examples:4"
    },
    {
      "kind": "concept",
      "value": "cdd.example"
    },
    {
      "kind": "description",
      "value": "Some things require that a file is present at the repository root - for example, Jetbrains IDE will need tsconfig.json at the repository root to correctly detect code paths to suggest paths completion. This is cleanly handled in CDD with [symlinks](cdd.symlinks)"
    }
  ]
]
