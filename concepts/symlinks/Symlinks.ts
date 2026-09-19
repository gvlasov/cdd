// Static browsable reflection of Symlinks.
export default [
  [
    {
      "kind": "identity",
      "value": "cdd.symlinks"
    },
    {
      "kind": "concept",
      "value": "cdd.concept"
    },
    {
      "kind": "slug",
      "value": "symlinks"
    },
    {
      "kind": "name",
      "value": "Symlinks"
    },
    {
      "kind": "definition",
      "value": "[Symlinks](https://www.wikiwand.com/en/Symbolic_link) can be pretty useful in CDD!"
    },
    {
      "kind": "details",
      "value": "CDD is based on a hierarchy represented by the file system. But oftentimes you want the same file in multiple places, because it belongs to all those places, but that would violate the hierarchy. Symlinks can help with file access from different semantical areas.\n\nExamples\n\n- A screen specification belongs both to the stakeholder that sees the screen and to the concept reflected by that screen\n- A command that runs some process belongs both to the list of commands in `/commands/` and to that process in `/processes/`\n- IntelliJ IDEA wants tsconfig.json at the repository root to properly load the paths, so it is stored in `/platform/typescript/tsconfig.json` and symlinked as `/tsconfig.json`\n- Any dotdirs and dotfiles that require to live in the project root: `/platform/claude` -> `/.claude`"
    },
    {
      "kind": "examples",
      "value": [
        "cdd.symlinks:examples:1",
        "cdd.symlinks:examples:2",
        "cdd.symlinks:examples:3",
        "cdd.symlinks:examples:4"
      ]
    }
  ],
  [
    {
      "kind": "identity",
      "value": "cdd.symlinks:examples:1"
    },
    {
      "kind": "concept",
      "value": "cdd.example"
    },
    {
      "kind": "description",
      "value": "A screen specification belongs both to the stakeholder that sees the screen and to the concept reflected by that screen"
    }
  ],
  [
    {
      "kind": "identity",
      "value": "cdd.symlinks:examples:2"
    },
    {
      "kind": "concept",
      "value": "cdd.example"
    },
    {
      "kind": "description",
      "value": "A command that runs some process belongs both to the list of commands in `/commands/` and to that process in `/processes/`"
    }
  ],
  [
    {
      "kind": "identity",
      "value": "cdd.symlinks:examples:3"
    },
    {
      "kind": "concept",
      "value": "cdd.example"
    },
    {
      "kind": "description",
      "value": "IntelliJ IDEA wants tsconfig.json at the repository root to properly load the paths, so it is stored in `/platform/typescript/tsconfig.json` and symlinked as `/tsconfig.json`"
    }
  ],
  [
    {
      "kind": "identity",
      "value": "cdd.symlinks:examples:4"
    },
    {
      "kind": "concept",
      "value": "cdd.example"
    },
    {
      "kind": "description",
      "value": "Any dotdirs and dotfiles that require to live in the project root: `/platform/claude` -> `/.claude`"
    }
  ]
]
