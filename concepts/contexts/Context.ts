// Static browsable reflection of Context.
export default [
  [
    {
      "kind": "identity",
      "value": "cdd.context"
    },
    {
      "kind": "concept",
      "value": "cdd.concept"
    },
    {
      "kind": "slug",
      "value": "context"
    },
    {
      "kind": "name",
      "value": "Context"
    },
    {
      "kind": "definition",
      "value": "Context is all information about something available at a given time"
    },
    {
      "kind": "details",
      "value": "CDD project is designed to be a single big context that structures the whole project in a predictable manner which is easy for both developers and LLMs to digest.\n\nExamples of context pieces:\n- Problem statements\n- Representations of concepts\n- Platform tools configurations\n- Requirements documentation\n\nBoth developers and LLMs need context to build a project. \n\nCDD solves a problem of rapid context building. During development, developer gets new pieces of context. It is important to have as much unique context available as possible to solve problems  efficiently. Thus any new piece of context must be quickly documented - put in its place. CDD makes that easy.\n\nCDD gives you a quick answer for any new piece of context - \"where do I put it?\" with a simple algorithm\n\n- you definitely put it into the project directory\n- determine which subdirectory\n- is it a reflection of any single specific concept? then it is `/concepts` directory\n  - does it reflect an existing concept? if not, create a new directory for it\n- otherwise, is it a reflection of any specific stakeholder?  then it goes  to `/stakeholders` directory\n- is it related to how multiple concept instances evolve together in time? then it goes to `/processes` directory\n- is it related to the tools or runtime environment that run the project? then it goes to `/platform` directory\n- if you don't know where it should go, then it goes to `/sandbox` directory until you decide where it belongs"
    }
  ]
]
