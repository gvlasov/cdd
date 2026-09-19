// Static browsable reflection of Problems.
export default [
  [
    {
      "kind": "identity",
      "value": "cdd.problems"
    },
    {
      "kind": "concept",
      "value": "cdd.concept"
    },
    {
      "kind": "slug",
      "value": "problems"
    },
    {
      "kind": "name",
      "value": "Problems"
    },
    {
      "kind": "definition",
      "value": "Problem - a part of the current state of a reality that we want to change"
    },
    {
      "kind": "details",
      "value": "Every project has a problem it solves, which is the reason a project exists\n\nExamples\n\n- a task tracker solves a problem of task management being difficult and cognitively and organizationally demanding\n- twitter solves the problem of having your ideas reach other people cheaply\n\nUsually different kinds of problems are solved for different kinds of stakeholders in a project, so there are almost always multiple problems being solved per project. Twitter (or basically any social network) has several at once:\n\n- Users get to spread their ideas and read other people's ideas\n- Software engineers get paid for building the project\n- Owners get money from marketers – a specific kind of rich users who want to spread their specific kind of ideas for money\n\nDifferent problems often involve different [Process](cdd.process) because they concern different stakeholders, and thus are about different sets of concepts and their interactions.\n\nAttributes of a problem\n\n- Stakeholder. Who has the problem\n- Project. What project is this problem a part of, if any\n- Problem statement - description of a problem\n- Tasks - what has to be done and how\n- Status - active / resolved / postponed\n- Deadline - a date until which the problem has to be resolved\n- Notes - any artifacts that represent parts of a problem\n  - Findings - whatever important information was discovered while working on a solution\n  - Ideas - ways to solve problems\n- Solutions - algorithms to solve the problem\n- Stakeholder payouts - what does each stakeholder get for solving the problem\n- Subproblems - problems that have to be solved before being able to solve the problem. Splitting a problem into subproblems until every supbroblem becomes manageable is the process of decomposition, one of the main engineering techniques.\n- Resolution - text description of how the problem was resolved. Only for resolved problems\n\nProblem tracking and task tracking\n\nThey are similar, but problem tracking is a more complete framework for finishing projects, because it is more transparent. Task tracking assumes that the task executor does not necessarily understand the motivation of the task author, or what exact problem the task solves.\n\nProblems as parts of a project ontology in CDD\n\nProblem statements give crucial [Context](cdd.context) for the project.\n\nIf an engineer can't formulate the problem statements for a project, he is not suited to build the project properly."
    },
    {
      "kind": "examples",
      "value": [
        "cdd.problems:examples:1",
        "cdd.problems:examples:2",
        "cdd.problems:examples:3",
        "cdd.problems:examples:4",
        "cdd.problems:examples:5"
      ]
    }
  ],
  [
    {
      "kind": "identity",
      "value": "cdd.problems:examples:1"
    },
    {
      "kind": "concept",
      "value": "cdd.example"
    },
    {
      "kind": "description",
      "value": "a task tracker solves a problem of task management being difficult and cognitively and organizationally demanding"
    }
  ],
  [
    {
      "kind": "identity",
      "value": "cdd.problems:examples:2"
    },
    {
      "kind": "concept",
      "value": "cdd.example"
    },
    {
      "kind": "description",
      "value": "twitter solves the problem of having your ideas reach other people cheaply"
    }
  ],
  [
    {
      "kind": "identity",
      "value": "cdd.problems:examples:3"
    },
    {
      "kind": "concept",
      "value": "cdd.example"
    },
    {
      "kind": "description",
      "value": "Users get to spread their ideas and read other people's ideas"
    }
  ],
  [
    {
      "kind": "identity",
      "value": "cdd.problems:examples:4"
    },
    {
      "kind": "concept",
      "value": "cdd.example"
    },
    {
      "kind": "description",
      "value": "Software engineers get paid for building the project"
    }
  ],
  [
    {
      "kind": "identity",
      "value": "cdd.problems:examples:5"
    },
    {
      "kind": "concept",
      "value": "cdd.example"
    },
    {
      "kind": "description",
      "value": "Owners get money from marketers – a specific kind of rich users who want to spread their specific kind of ideas for money"
    }
  ]
]
