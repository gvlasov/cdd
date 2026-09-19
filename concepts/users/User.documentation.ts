// Static browsable reflection of User.
export default [
  [
    {
      "kind": "identity",
      "value": "cdd.user"
    },
    {
      "kind": "concept",
      "value": "cdd.concept"
    },
    {
      "kind": "slug",
      "value": "user"
    },
    {
      "kind": "name",
      "value": "User"
    },
    {
      "kind": "definition",
      "value": "A [Subject](cdd.subject) that has [[beliefs]] about how concepts can be represented and the outcomes of [processes](cdd.process) that he can run."
    },
    {
      "kind": "details",
      "value": "Every systems are built for users. Every system is assumed to have users. A good system knows about its users, specifies and models their intent, [Goal](cdd.goal), assumptions, preferences.\n\nExamples\n- A user of Google search engine - this is an example where the user is a [Stakeholder](cdd.stakeholder)\n- A program that calls `grep` (the belief is that it will filter the provided text) can be considered a users, but in actuality the developer that wrote that program"
    },
    {
      "kind": "examples",
      "value": [
        "cdd.user:examples:1",
        "cdd.user:examples:2"
      ]
    }
  ],
  [
    {
      "kind": "identity",
      "value": "cdd.user:examples:1"
    },
    {
      "kind": "concept",
      "value": "cdd.example"
    },
    {
      "kind": "description",
      "value": "A user of Google search engine - this is an example where the user is a [Stakeholder](cdd.stakeholder)"
    }
  ],
  [
    {
      "kind": "identity",
      "value": "cdd.user:examples:2"
    },
    {
      "kind": "concept",
      "value": "cdd.example"
    },
    {
      "kind": "description",
      "value": "A program that calls `grep` (the belief is that it will filter the provided text) can be considered a users, but in actuality the developer that wrote that program"
    }
  ]
]
