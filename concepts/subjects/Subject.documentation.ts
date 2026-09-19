// Static browsable reflection of Subject.
export default [
  [
    {
      "kind": "identity",
      "value": "cdd.subject"
    },
    {
      "kind": "concept",
      "value": "cdd.concept"
    },
    {
      "kind": "slug",
      "value": "subject"
    },
    {
      "kind": "name",
      "value": "Subject"
    },
    {
      "kind": "definition",
      "value": "Something that can start [processes](cdd.process)"
    },
    {
      "kind": "details",
      "value": "Subject may have the ability to consume the output of a process to drive its decisions\n\nHeuristic:\n\nSomething is a subject when it is natural to narrate its behavior with an action verb that ascribes it agency — e.g. \"systemd killed my service.\" When the natural narration instead credits whoever configured or wrote it — e.g. a script that merely calls `grep` is not what \"filtered the text,\" its author is — the thing is a mechanism, not a subject. This is why not every process-starter qualifies: see [User](cdd.user)'s counterexample of a program calling `grep`.\n\nExamples:\n\n- A systemd daemon on a host is a subject\n- Any [User](cdd.user) is a subject\n- A multithreaded scheduler is a subject\n- A browser is a subject when talking to backend over REST API\n- Backend is a subject when talking to browser"
    },
    {
      "kind": "examples",
      "value": [
        "cdd.subject:examples:1",
        "cdd.subject:examples:2",
        "cdd.subject:examples:3",
        "cdd.subject:examples:4",
        "cdd.subject:examples:5"
      ]
    }
  ],
  [
    {
      "kind": "identity",
      "value": "cdd.subject:examples:1"
    },
    {
      "kind": "concept",
      "value": "cdd.example"
    },
    {
      "kind": "description",
      "value": "A systemd daemon on a host is a subject"
    }
  ],
  [
    {
      "kind": "identity",
      "value": "cdd.subject:examples:2"
    },
    {
      "kind": "concept",
      "value": "cdd.example"
    },
    {
      "kind": "description",
      "value": "Any [User](cdd.user) is a subject"
    }
  ],
  [
    {
      "kind": "identity",
      "value": "cdd.subject:examples:3"
    },
    {
      "kind": "concept",
      "value": "cdd.example"
    },
    {
      "kind": "description",
      "value": "A multithreaded scheduler is a subject"
    }
  ],
  [
    {
      "kind": "identity",
      "value": "cdd.subject:examples:4"
    },
    {
      "kind": "concept",
      "value": "cdd.example"
    },
    {
      "kind": "description",
      "value": "A browser is a subject when talking to backend over REST API"
    }
  ],
  [
    {
      "kind": "identity",
      "value": "cdd.subject:examples:5"
    },
    {
      "kind": "concept",
      "value": "cdd.example"
    },
    {
      "kind": "description",
      "value": "Backend is a subject when talking to browser"
    }
  ]
]
