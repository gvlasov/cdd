# Roadmap

A roadmap is a step-wise plan to implement a project. It is a directed acyclic
graph of steps: a task to do, a goal to achieve, or a problem to solve.

## Attributes

- Steps (1+): the roadmap's task, goal, and problem vertices.
- Milestones (0+): subtrees in the roadmap.
- Diagram (1): the directed acyclic graph rendered from those steps and their dependencies.

## Example: CDD public release

For the CDD project, the roadmap is the rooted tree
`P → G → { T1, T2 → T3 }`:

- P — problem: developers cannot yet use CDD from a fresh checkout.
- G — goal: a developer can install and use CDD.
- T1 — task: write the installer.
- T2 — task: document installation.
- T3 — task: publish the first release.

The **Foundation** milestone is the subtree `P → G → T1`; the **Public
release** milestone is `G → T2 → T3`. The shared `G` step roots both
milestones without introducing a cycle. The ontology includes this
as the navigable `cdd.roadmap:examples:cddPublicRelease:roadmap` instance,
whose diagram renders the DAG from bottom to top.
