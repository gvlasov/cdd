// Static browsable reflection of Source code.
export default [
  [
    {
      "kind": "identity",
      "value": "cdd.sourceCode"
    },
    {
      "kind": "concept",
      "value": "cdd.concept"
    },
    {
      "kind": "slug",
      "value": "sourceCode"
    },
    {
      "kind": "name",
      "value": "Source code"
    },
    {
      "kind": "definition",
      "value": "Source code of a project is whatever text sources can a human or LLM read about the project."
    },
    {
      "kind": "details",
      "value": "CDD allows collecting full source code of a project with `cdd source-code:print` command to feed to an LLM so that it can quickly build the full context. It excludes everything from the project that is not source code. Whenever a CDD-aware LLM must have a large-scale understanding of a project, it must read `cdd source-code:print`\n\nNot only executable pieces qualify as source code. For example, documentation for concepts in `.md` files is considered source code too, for the purpose of building context.\n\nExamples\n\n- PHP scripts\n- Tests\n- Markdown documentation\n- [Mermaid](https://mermaid.ai/) diagrams\n\nWhat is not a project's source code\n- Generated code\n- Binary artifacts\n- Source code of the dependency libraries\n- Whatever is .gitignore'd is not considered source code, e.g. dependencies and .env files\n- Lock and manifest files like `package-lock.json` and `composer.json`\n\nSource-code commands\n\n- `cdd source-code:print` prints the indexed source tree, optionally restricted to paths\n- `cdd source-code:volume` prints the volume of the source tree in bytes\n- `cdd source-code:volume:analyze` ranks indexed source files by byte size, optionally restricted to paths\n- `cdd source-code:volume:assess` opens a terminal browser that ranks source-code items by aggregate volume"
    },
    {
      "kind": "examples",
      "value": [
        "cdd.sourceCode:examples:1",
        "cdd.sourceCode:examples:2",
        "cdd.sourceCode:examples:3",
        "cdd.sourceCode:examples:4"
      ]
    }
  ],
  [
    {
      "kind": "identity",
      "value": "cdd.sourceCode:examples:1"
    },
    {
      "kind": "concept",
      "value": "cdd.example"
    },
    {
      "kind": "description",
      "value": "PHP scripts"
    }
  ],
  [
    {
      "kind": "identity",
      "value": "cdd.sourceCode:examples:2"
    },
    {
      "kind": "concept",
      "value": "cdd.example"
    },
    {
      "kind": "description",
      "value": "Tests"
    }
  ],
  [
    {
      "kind": "identity",
      "value": "cdd.sourceCode:examples:3"
    },
    {
      "kind": "concept",
      "value": "cdd.example"
    },
    {
      "kind": "description",
      "value": "Markdown documentation"
    }
  ],
  [
    {
      "kind": "identity",
      "value": "cdd.sourceCode:examples:4"
    },
    {
      "kind": "concept",
      "value": "cdd.example"
    },
    {
      "kind": "description",
      "value": "[Mermaid](https://mermaid.ai/) diagrams"
    }
  ]
]
