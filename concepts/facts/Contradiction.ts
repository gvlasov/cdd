// Static browsable reflection of Contradiction.
export default [
  [
    {
      "kind": "identity",
      "value": "cdd.contradiction"
    },
    {
      "kind": "concept",
      "value": "cdd.concept"
    },
    {
      "kind": "slug",
      "value": "contradiction"
    },
    {
      "kind": "name",
      "value": "Contradiction"
    },
    {
      "kind": "definition",
      "value": "When an observation is incompatible with a conceptualized notion"
    },
    {
      "kind": "details",
      "value": "Contradiction consists of an observation and the notion it contradicts. This applies to any [conceptual system](cdd.conceptualSystem), not only CDD's own. A bug is a contradiction: the system produced an observation the developer's model said was impossible.\n\nFinding a contradiction is a chance to improve a conceptual system:\n- Contradiction in the system's rules: write a test for it, see it fail, fix the problem, TDD-style.\n- Contradiction in the system's layout: a reflection is not where its meaning says it belongs — move it.\n- Contradiction in the methodology itself: revise the methodology's rules, as in CDD's own refinement process.\n\nExamples\n\n- An exception thrown in an exceptional case\n- An error log record\n- A failing test revealing the implementation doesn't match the intended invariant\n- A user report describing behavior the model says shouldn't be possible\n\nProblems\n\nContradictions consume attention to integrate them into the model of the system\n\nUtility\n\nContradictions help find opportunities for improvement in a system"
    },
    {
      "kind": "examples",
      "value": [
        "cdd.contradiction:examples:1",
        "cdd.contradiction:examples:2",
        "cdd.contradiction:examples:3",
        "cdd.contradiction:examples:4"
      ]
    }
  ],
  [
    {
      "kind": "identity",
      "value": "cdd.contradiction:examples:1"
    },
    {
      "kind": "concept",
      "value": "cdd.example"
    },
    {
      "kind": "description",
      "value": "An exception thrown in an exceptional case"
    }
  ],
  [
    {
      "kind": "identity",
      "value": "cdd.contradiction:examples:2"
    },
    {
      "kind": "concept",
      "value": "cdd.example"
    },
    {
      "kind": "description",
      "value": "An error log record"
    }
  ],
  [
    {
      "kind": "identity",
      "value": "cdd.contradiction:examples:3"
    },
    {
      "kind": "concept",
      "value": "cdd.example"
    },
    {
      "kind": "description",
      "value": "A failing test revealing the implementation doesn't match the intended invariant"
    }
  ],
  [
    {
      "kind": "identity",
      "value": "cdd.contradiction:examples:4"
    },
    {
      "kind": "concept",
      "value": "cdd.example"
    },
    {
      "kind": "description",
      "value": "A user report describing behavior the model says shouldn't be possible"
    }
  ]
]
