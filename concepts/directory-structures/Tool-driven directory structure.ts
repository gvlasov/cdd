// Static browsable reflection of Tool-driven directory structure.
export default [
  [
    {
      "kind": "identity",
      "value": "cdd.toolDrivenDirectoryStructure"
    },
    {
      "kind": "concept",
      "value": "cdd.concept"
    },
    {
      "kind": "slug",
      "value": "toolDrivenDirectoryStructure"
    },
    {
      "kind": "name",
      "value": "Tool-driven directory structure"
    },
    {
      "kind": "definition",
      "value": "Project directory structure that is dictated by the tools rather than by the conceptual structure. An opposite of [Concept-driven directory structure](cdd.conceptDrivenDirectoryStructure)."
    },
    {
      "kind": "details",
      "value": "Tools want files grouped *by the tool* that uses them: \n- tests ran with PHPUnit in /tests, \n- source code compiled with esbuild in /src/resources/typescript. \n\nTool-driven directory structure has its advantages over CDDS:\n\n- Supported out of the box by every major tool\n- Developers are generally are more familiar with it\n\nTool-driven directory structure is considered bad by concept-driven methodology because:\n\n- It promotes splitting conceptually cohesive module groups by tool in favor of tool setup simplicity\n- It doesn't provide you a standardized way to store platform configuration\n-"
    }
  ]
]
