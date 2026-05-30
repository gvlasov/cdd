A lifecycle phase is a recurring stage or operation in the life of a [[Project|project]].

Lifecycle phases are platform-level cohesion units. They group the commands, tool configuration, scripts, documentation, and generated outputs needed to move the project through a recurring operation.

Examples:

- `up` starts or prepares the local development environment.
- `test` verifies behavior.
- `lint` checks code style and static correctness.
- `build` creates project artifacts.
- `deploy` moves a project artifact or environment into production use.
- `release` prepares a version for users.
- `migrate` changes database state or schema.

Lifecycle phases are not usually domain concepts. They are about operating the project rather than representing the problem domain.

## Commands

Lifecycle phases commonly appear as [[CLI command|CLI commands]].

Examples:

- `up`
- `test`
- `lint`
- `build`
- `deploy`

Commands for lifecycle phases can also be namespaced when the phase has variants:

- `test:unit`
- `test:e2e`
- `build:frontend`
- `build:backend`
- `deploy:staging`
- `deploy:production`

## Maven

Maven is an example of an explicit formalization of a project lifecycle.

It names standard lifecycle phases such as `validate`, `compile`, `test`, `package`, `verify`, `install`, and `deploy`. This makes lifecycle operations predictable: tools and plugins can attach behavior to known phases instead of inventing unrelated commands for every project.

CDD does not require Maven's lifecycle model, but it uses the same underlying idea: recurring project operations deserve stable names and coherent organization.
