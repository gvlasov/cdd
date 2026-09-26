# Roadmap

A roadmap is a step-wise plan to implement a project. It is a directed acyclic
graph of steps: a task to do, a goal to achieve, or a problem to solve.

## Attributes

- Steps (1+): the roadmap's task, goal, and problem vertices.
- Milestones (0+): ordered, non-overlapping phases that partition their steps;
  one step cannot belong to multiple milestones.
- Diagram (1): the directed acyclic graph rendered from those steps and their dependencies.

## Example: CDD public release

For the CDD project, the example roadmap progresses through four milestones:

- **Foundation** — identify the fresh-checkout problem and establish the goal.
- **Implementation** — write the installer, package the CLI, and automate releases.
- **Validation** — test the installer and CLI together, document installation,
  test a fresh checkout, and publish the validated documentation.
- **Public release** — publish the release, announce it, and collect feedback.

The graph includes converging dependencies. Integration tests and installation
documentation each require both the installer and packaged CLI. A fresh-checkout
test requires both integration tests and documentation. Publishing the release
requires the fresh-checkout test, published documentation, and release automation.
The ontology includes this as the navigable
`cdd.roadmap:examples:cddPublicRelease:roadmap` instance, whose diagram renders
the DAG from bottom to top.
