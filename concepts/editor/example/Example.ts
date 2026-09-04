// An example pairs an `instance` (a link to the concept it exemplifies) with a
// `description` of that instance's relevance in this context. Declared as an
// owned, structured attribute wherever a concept lists examples of itself —
// see cdd.concept:examples.
export default [
  [
    { kind: 'identity', value: 'cdd.example' },
    { kind: 'concept', value: 'cdd.concept' },
    { kind: 'slug', value: 'example' },
    { kind: 'name', value: 'Example' },
    {
      kind: 'definition',
      value: 'a link to an [instance](.instance) paired with a description of it in context.',
    },
    { kind: 'attributes', value: ['cdd.example:instance', 'cdd.example:description'] },
  ],
  [
    { kind: 'identity', value: 'cdd.example:instance' },
    { kind: 'concept', value: 'cdd.attribute' },
    { kind: 'slug', value: 'instance' },
    { kind: 'name', value: 'instance' },
    { kind: 'type', value: 'cdd.concept' },
    { kind: 'cardinality', value: '1' },
  ],
  [
    { kind: 'identity', value: 'cdd.example:description' },
    { kind: 'concept', value: 'cdd.attribute' },
    { kind: 'slug', value: 'description' },
    { kind: 'name', value: 'description' },
    { kind: 'type', value: 'cdd.definition' },
    { kind: 'cardinality', value: '0-1' },
  ],
]
