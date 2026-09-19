// Static browsable reflection of Mess.
export default [
  [
    {
      "kind": "identity",
      "value": "cdd.mess"
    },
    {
      "kind": "concept",
      "value": "cdd.concept"
    },
    {
      "kind": "slug",
      "value": "mess"
    },
    {
      "kind": "name",
      "value": "Mess"
    },
    {
      "kind": "definition",
      "value": "Mess is a property of a system that reflects how out of order it is. It is the primary enemy of a system developer."
    },
    {
      "kind": "details",
      "value": "The opposite of mess can be called order or place.\n\nMess is not chaos. Chaos is change. Mess is things out of their place. Chaos can create mess, or chaos can be contained to produce little mess within a mess container.\n\nPutting a thing in its place removes mess introduced by that thing. It can also indirectly create more total mess by driving things connected to that thing out of their place.\n\nHaving mess is sometimes cheaper than creating a proper order not only in the moment, but overall. So mess can be tolerated, but must be constrained and contained:\n\nExamples of tolerable mess\n\n- Non-trivial bash scripts can be hard to read and especially modify manually, so they are intrinsically messy. It is ok to have a messy bash script as long as its inputs and outputs are well documented and the script itself is properly placed.\n- `/sandbox` is the place to experiment, its contents are expected to be messy\n- A frontend component with a lot of complex interactions within it may become messy, but is ok as long as the mess is cohesive, the interface is clear, the internals don't leak out, and no other components would make sense to be cleanly extracted out of it.\n\nCriteria for mess tolerance\n- Mess must not spread\n- Nothing should depend on the internals of a mess\n- Mess must have a clear boundary with well-defined inputs and outputs\n- Mess must be contained within a single file/directory, thus different parts of the same mess must not exist across filesystem"
    }
  ]
]
