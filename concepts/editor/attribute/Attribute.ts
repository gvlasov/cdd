// `computed` (0-1) marks an attribute as derived rather than stored; when
// `'true'`, `function` (0-1) holds the JS body — `(instance, ontology) =>
// value` — that derives it. See cdd.transaction's canonicalName for a worked
// example.
export default [
  [
    { kind: 'identity', value: 'cdd.attribute' },
    { kind: 'concept', value: 'cdd.concept' },
    { kind: 'slug', value: 'attribute' },
    { kind: 'name', value: 'Attribute' },
    {
      kind: 'definition',
      value:
        'belongs to a [concept](.concept). defines one slot — name, `type` and `cardinality` — on that concept’s instances. a computed attribute (`computed`) derives its value from `function` instead of storing it.',
    },
    {
      kind: 'attributes',
      value: [
        'cdd.attribute:name',
        'cdd.attribute:slug',
        'cdd.attribute:type',
        'cdd.attribute:cardinality',
        'cdd.attribute:computed',
        'cdd.attribute:function',
        'cdd.attribute:description',
        'cdd.attribute:examples',
      ],
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
  [
    { kind: 'identity', value: 'cdd.attribute:computed' },
    { kind: 'concept', value: 'cdd.attribute' },
    { kind: 'slug', value: 'computed' },
    { kind: 'name', value: 'computed' },
    { kind: 'type', value: 'cdd.name' },
    { kind: 'cardinality', value: '0-1' },
  ],
  [
    { kind: 'identity', value: 'cdd.attribute:function' },
    { kind: 'concept', value: 'cdd.attribute' },
    { kind: 'slug', value: 'function' },
    { kind: 'name', value: 'function' },
    { kind: 'type', value: 'cdd.definition' },
    { kind: 'cardinality', value: '0-1' },
  ],
  [
    { kind: 'identity', value: 'cdd.attribute:description' },
    { kind: 'concept', value: 'cdd.attribute' },
    { kind: 'slug', value: 'description' },
    { kind: 'name', value: 'description' },
    { kind: 'type', value: 'cdd.definition' },
    { kind: 'cardinality', value: '0-1' },
  ],
  [
    { kind: 'identity', value: 'cdd.attribute:examples' },
    { kind: 'concept', value: 'cdd.attribute' },
    { kind: 'slug', value: 'examples' },
    { kind: 'name', value: 'examples' },
    { kind: 'type', value: 'cdd.example' },
    { kind: 'cardinality', value: '0+' },
  ],
]
