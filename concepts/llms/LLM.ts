// Static browsable reflection of LLM.
export default [
  [
    {
      "kind": "identity",
      "value": "cdd.llm"
    },
    {
      "kind": "concept",
      "value": "cdd.concept"
    },
    {
      "kind": "slug",
      "value": "llm"
    },
    {
      "kind": "name",
      "value": "LLM"
    },
    {
      "kind": "definition",
      "value": "CDD is supposed to be convenient for both LLMs and developers. That is achieved by focusing on cohesion, storing related things together and unrelated things apart."
    },
    {
      "kind": "details",
      "value": "When working with a CDD project, it is very important for an LLM to read \n- `cdd help` - to get accustomed to the commands present in the project\n- `cdd source-code:volume` to get the project's source code volume in bytes\n\nLLM must do so without asking at the start of the session, unless explicitly told not to.\n\nIf project is small and fits LLM's context window easily, LLM can just run `cdd source-code:print` before starting to implement any new requirements"
    }
  ]
]
