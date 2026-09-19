// Static browsable reflection of Repository.
export default [
  [
    {
      "kind": "identity",
      "value": "cdd.repository"
    },
    {
      "kind": "concept",
      "value": "cdd.concept"
    },
    {
      "kind": "slug",
      "value": "repository"
    },
    {
      "kind": "name",
      "value": "Repository"
    },
    {
      "kind": "definition",
      "value": "Repository - an object that provides access to a concept's [real volume](cdd.realVolume), which is mutable. Allows writing and reading its state. For CQRS purposes, may be split into read repository and write repository."
    },
    {
      "kind": "details",
      "value": "Essentially the same as DDD repository. An interface with a database that allows to express CRUD operations with domain language.\n\nThe atomicity boundary for a state change does not live in the repository itself. It lives in the [transaction](cdd.transaction) that calls into the repository: the transaction owns the boundary, along with the input constraints and side effects (caching, transport) surrounding the change."
    }
  ]
]
