// `definition` is an attribute of Concept — only concepts get one. `slug` is
// declared here too (identity derivation is concept-specific); `name` is
// declared on Instance instead, since any instance may have one. `examples`
// (0+, typed cdd.example) owns a list of Example instances — each pairs a
// linked concept instance with a description of it in this context. Also
// carries a constructor transaction, cdd.concept:create.
export default [
  [
    { kind: 'identity', value: 'cdd.concept' },
    { kind: 'concept', value: 'cdd.concept' },
    { kind: 'slug', value: 'concept' },
    { kind: 'name', value: 'Concept' },
    {
      kind: 'definition',
      value:
        'A cohesion unit. A concept is a collection of [properties](.property); its [attributes](.attribute) declare what its instances may hold.',
    },
    {
      kind: 'attributes',
      value: [
        'cdd.concept:slug',
        'cdd.concept:definition',
        'cdd.concept:attributes',
        'cdd.concept:transactions',
        'cdd.concept:examples',
      ],
    },
    { kind: 'transactions', value: ['cdd.concept:create'] },
    {
      kind: 'examples',
      value: ['cdd.concept:examples:attribute', 'cdd.concept:examples:instance', 'cdd.concept:examples:property'],
    },
  ],
  [
    { kind: 'identity', value: 'cdd.concept:examples:attribute' },
    { kind: 'concept', value: 'cdd.example' },
    { kind: 'instance', value: 'cdd.attribute' },
    {
      kind: 'description',
      value: 'a concept whose instances are themselves the attributes another concept declares.',
    },
  ],
  [
    { kind: 'identity', value: 'cdd.concept:examples:instance' },
    { kind: 'concept', value: 'cdd.example' },
    { kind: 'instance', value: 'cdd.instance' },
    {
      kind: 'description',
      value: 'the most general concept in the ontology — every other concept is a kind of instance.',
    },
  ],
  [
    { kind: 'identity', value: 'cdd.concept:examples:property' },
    { kind: 'concept', value: 'cdd.example' },
    { kind: 'instance', value: 'cdd.property' },
    {
      kind: 'description',
      value: 'a concept that, unusually, declares no attributes of its own for this ontology.',
    },
  ],
  [
    { kind: 'identity', value: 'cdd.concept:slug' },
    { kind: 'concept', value: 'cdd.attribute' },
    { kind: 'slug', value: 'slug' },
    { kind: 'name', value: 'slug' },
    { kind: 'type', value: 'cdd.slug' },
    { kind: 'cardinality', value: '1' },
  ],
  [
    { kind: 'identity', value: 'cdd.concept:definition' },
    { kind: 'concept', value: 'cdd.attribute' },
    { kind: 'slug', value: 'definition' },
    { kind: 'name', value: 'definition' },
    { kind: 'type', value: 'cdd.definition' },
    { kind: 'cardinality', value: '0-1' },
  ],
  [
    { kind: 'identity', value: 'cdd.concept:attributes' },
    { kind: 'concept', value: 'cdd.attribute' },
    { kind: 'slug', value: 'attributes' },
    { kind: 'name', value: 'attributes' },
    { kind: 'type', value: 'cdd.attribute' },
    { kind: 'cardinality', value: '0+' },
  ],
  [
    { kind: 'identity', value: 'cdd.concept:transactions' },
    { kind: 'concept', value: 'cdd.attribute' },
    { kind: 'slug', value: 'transactions' },
    { kind: 'name', value: 'transactions' },
    { kind: 'type', value: 'cdd.transaction' },
    { kind: 'cardinality', value: '0+' },
  ],
  [
    { kind: 'identity', value: 'cdd.concept:examples' },
    { kind: 'concept', value: 'cdd.attribute' },
    { kind: 'slug', value: 'examples' },
    { kind: 'name', value: 'examples' },
    { kind: 'type', value: 'cdd.example' },
    { kind: 'cardinality', value: '0+' },
  ],
  [
    { kind: 'identity', value: 'cdd.concept:create' },
    { kind: 'concept', value: 'cdd.transaction' },
    { kind: 'name', value: 'create' },
    { kind: 'definition', value: 'Constructor: spawn a new concept instance into the reality.' },
    { kind: 'params', value: ['name', 'definition'] },
    {
      kind: 'effect',
      value:
        "return reality.add('cdd.concept', { name: input.name, definition: input.definition })",
    },
  ],
]
