When an observation is incompatible with a conceptualized notion

Contradiction consists of an observation and the notion it contradicts. This applies to any [conceptual system](/concepts/concepts/Conceptual system.md), not only CDD's own. A bug is a contradiction: the system produced an observation the developer's model said was impossible.

Finding a contradiction is a chance to improve a conceptual system:
- Contradiction in the system's rules: write a test for it, see it fail, fix the problem, TDD-style.
- Contradiction in the system's layout: a reflection is not where its meaning says it belongs — move it.
- Contradiction in the methodology itself: revise the methodology's rules, as in CDD's own [refinement](/processes/refinement/Refinement.md) process.

### Examples

- An exception thrown in an exceptional case
- An error log record
- A failing test revealing the implementation doesn't match the intended invariant
- A user report describing behavior the model says shouldn't be possible

### Problems

Contradictions consume attention to integrate them into the model of the system

### Utility

Contradictions help find opportunities for improvement in a system