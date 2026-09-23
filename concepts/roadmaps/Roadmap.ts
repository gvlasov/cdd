// Static browsable reflection of Roadmap and its milestone attribute.
export default [
  [
    { kind: 'identity', value: 'cdd.roadmap' },
    { kind: 'concept', value: 'cdd.concept' },
    { kind: 'slug', value: 'roadmap' },
    { kind: 'name', value: 'Roadmap' },
    {
      kind: 'definition',
      value:
        'A step-wise plan to implement a [project](cdd.project). It is a directed acyclic graph of steps: a task to do, a goal to achieve, or a problem to solve.',
    },
    { kind: 'attributes', value: ['cdd.roadmap:milestones'] },
  ],
  [
    { kind: 'identity', value: 'cdd.roadmap:milestones' },
    { kind: 'concept', value: 'cdd.attribute' },
    { kind: 'slug', value: 'milestones' },
    { kind: 'name', value: 'milestones' },
    { kind: 'type', value: 'cdd.milestone' },
    { kind: 'cardinality', value: '0+' },
  ],
  [
    { kind: 'identity', value: 'cdd.milestone' },
    { kind: 'concept', value: 'cdd.concept' },
    { kind: 'slug', value: 'milestone' },
    { kind: 'name', value: 'Milestone' },
    { kind: 'definition', value: 'A subtree in a [roadmap](cdd.roadmap).' },
  ],
]
