// `name` is an attribute of Instance — any instance may have one, concepts
// included (concepts are instances too, just typed cdd.concept).
export default [
  [
    { kind: 'identity', value: 'cdd.instance' },
    { kind: 'concept', value: 'cdd.concept' },
    { kind: 'slug', value: 'instance' },
    { kind: 'name', value: 'Instance' },
    {
      kind: 'definition',
      value:
        'Anything the ontology holds: a collection of [properties](.property) addressed by a unique identity, typed by its `concept` property. A [concept](.concept) is an instance that also declares [attributes](.attribute).',
    },
    { kind: 'attributes', value: ['cdd.instance:name'] },
  ],
  [
    { kind: 'identity', value: 'cdd.instance:name' },
    { kind: 'concept', value: 'cdd.attribute' },
    { kind: 'slug', value: 'name' },
    { kind: 'name', value: 'name' },
    { kind: 'type', value: 'cdd.name' },
    { kind: 'cardinality', value: '1' },
  ],
]
