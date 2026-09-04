export default [
  [
    { kind: 'identity', value: 'cdd.attribute' },
    { kind: 'concept', value: 'cdd.concept' },
    { kind: 'slug', value: 'attribute' },
    { kind: 'name', value: 'Attribute' },
    {
      kind: 'definition',
      value:
        'Belongs to a [concept](.concept). Defines one slot — name, `type` and `cardinality` — on that concept’s instances.',
    },
    {
      kind: 'attributes',
      value: ['cdd.attribute:name', 'cdd.attribute:slug', 'cdd.attribute:type', 'cdd.attribute:cardinality'],
    },
  ],
  [
    { kind: 'identity', value: 'cdd.attribute:name' },
    { kind: 'concept', value: 'cdd.attribute' },
    { kind: 'slug', value: 'name' },
    { kind: 'name', value: 'name' },
    { kind: 'type', value: 'cdd.name' },
    { kind: 'cardinality', value: '1' },
  ],
  [
    { kind: 'identity', value: 'cdd.attribute:slug' },
    { kind: 'concept', value: 'cdd.attribute' },
    { kind: 'slug', value: 'slug' },
    { kind: 'name', value: 'slug' },
    { kind: 'type', value: 'cdd.slug' },
    { kind: 'cardinality', value: '1' },
  ],
  [
    { kind: 'identity', value: 'cdd.attribute:type' },
    { kind: 'concept', value: 'cdd.attribute' },
    { kind: 'slug', value: 'type' },
    { kind: 'name', value: 'type' },
    { kind: 'type', value: 'cdd.concept' },
    { kind: 'cardinality', value: '1' },
  ],
  [
    { kind: 'identity', value: 'cdd.attribute:cardinality' },
    { kind: 'concept', value: 'cdd.attribute' },
    { kind: 'slug', value: 'cardinality' },
    { kind: 'name', value: 'cardinality' },
    { kind: 'type', value: 'cdd.cardinality' },
    { kind: 'cardinality', value: '1' },
  ],
]
