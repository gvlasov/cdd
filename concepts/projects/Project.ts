// Static browsable reflection of Project.
export default [
  [
    {
      "kind": "identity",
      "value": "cdd.project"
    },
    {
      "kind": "concept",
      "value": "cdd.concept"
    },
    {
      "kind": "slug",
      "value": "project"
    },
    {
      "kind": "name",
      "value": "Project"
    },
    {
      "kind": "definition",
      "value": "Is a reflection of a [Conceptual system](cdd.conceptualSystem) in source code"
    },
    {
      "kind": "details",
      "value": "Project itself consists of a set of reflections of the concepts of the conceptual system\n\nStructure:\n\nA project has \n- a name and \n- a directory structure, ideally a [concept-driven](cdd.conceptDrivenDirectoryStructure) one\n\nCDD suggests storing project-only material such as the project description, icon, and other identity assets in `/project`. The project's display name is stored in `/project/name`; `cdd project:displayName` and `cdd project:slug` read and derive from it.\n\nCDD suggests storing all projects in `$CDD_PROJECTS_DIRECTORY` which is `~/Projects` by default. `cdd` utility has `cdd projects` familiy of commands to operate on projects on current development machine.\n\nAttributes of a project\n\n- Name\n- Logo\n- Description\n- Code files in directory structure\n- Authors\n- Stakeholders\n- Plans\n- Commands\n\nSome things that can be thought about as an attribute of a project are actually platform/concept concerns."
    }
  ]
]
