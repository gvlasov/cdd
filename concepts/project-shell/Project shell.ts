// Static browsable reflection of Project shell.
export default [
  [
    {
      "kind": "identity",
      "value": "cdd.projectShell"
    },
    {
      "kind": "concept",
      "value": "cdd.concept"
    },
    {
      "kind": "slug",
      "value": "projectShell"
    },
    {
      "kind": "name",
      "value": "Project shell"
    },
    {
      "kind": "definition",
      "value": "A command interface for a [Project](cdd.project)"
    },
    {
      "kind": "details",
      "value": "A good project has a command available for every action that is required during development, deployment and CI/CD2\n\nA project may have multiple shells for different types of commands\n\n/shells/\n/shells/fish\n/shells/mysql\n/shells/artisan-tinker\n\nBest practices:\n\n- Point your IDE to use a particular shell for its integrated terminal in your project\n- Make your shells available in PATH for your project, e.g. for bash:\n```bash\nexport PATH=$PATH:./shells\n```"
    }
  ]
]
