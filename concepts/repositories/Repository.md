Repository - an object that provides access to a concept's [[Real Volume|real volume]], which is mutable. Allows writing and reading its state. For CQRS purposes, may be split into read repository and write repository.

Essentially the same as DDD repository. An interface with a database that allows to express CRUD operations with domain language.

The atomicity boundary for a state change does not live in the repository itself. It lives in the [[Transaction|transaction]] that calls into the repository: the transaction owns the boundary, along with the input constraints and side effects (caching, transport) surrounding the change.