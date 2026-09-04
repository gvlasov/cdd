// A leaf concept — declares no attributes. An ontology instance (like `cdd`)
// carries whatever properties it needs (name, definition, slug, concepts, ...)
// without Ontology prescribing a schema for them.
export default [
  [
    { kind: 'identity', value: 'cdd.ontology' },
    { kind: 'concept', value: 'cdd.concept' },
    { kind: 'slug', value: 'ontology' },
    { kind: 'name', value: 'Ontology' },
    {
      kind: 'definition',
      value: 'A flat, rhizomatic collection of [concepts](.concept).',
    },
  ],
]
