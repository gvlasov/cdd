// Static browsable reflection of Selling Points.
export default [
  [
    {
      "kind": "identity",
      "value": "cdd.sellingPoints"
    },
    {
      "kind": "concept",
      "value": "cdd.concept"
    },
    {
      "kind": "slug",
      "value": "sellingPoints"
    },
    {
      "kind": "name",
      "value": "Selling Points"
    },
    {
      "kind": "definition",
      "value": "Here is a list of very practical reasons to adopt CDD:"
    },
    {
      "kind": "details",
      "value": "Project shell commands\n\nCDD promotes well-structured project-specific commands that work directly in the project shell.\n\nInstead of asking a developer to remember long setup instructions or search through documentation, a CDD project can expose clear namespaced commands from `/commands`:\n\n- `help` lists available project commands\n- `up` starts the local environment\n- `test` runs tests\n- `lint` checks code quality\n- `build` builds the project artifact\n- `claude:install` installs the Claude integration for the project\n- `codex:install` installs the Codex integration for the project\n\nThese commands should work out of the box when the developer opens a shell in the project. This makes the project easier to operate, easier to discover, and easier to onboard into.\n\nMeaningful file groupings\n\nCDD groups files by the cohesion unit they belong to:\n\n- Concept\n- Process\n- Tool\n- Lifecycle phase\n\nThis improves [cohesion](cdd.cohesion), which is the ultimate good of a codebase. Related files stay together by meaning instead of being scattered by technical role.\n\nA developer looking for order behavior opens the orders concept. A developer looking for refinement workflow opens the refinement process. A developer looking for Docker setup opens the Docker tool/platform area. A developer looking for testing setup opens the testing lifecycle phase.\n\nThe result is a project structure that is easier to navigate, easier to explain, and easier to pass to an LLM as meaningful context."
    }
  ]
]
