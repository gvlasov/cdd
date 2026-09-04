// `concepts` (0+, typed cdd.concept) is the list of concepts an ontology
// contains — a reference list, not owned sub-instances (unlike Concept's
// `examples`), since each concept is a top-level entry in its own right.
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
    { kind: 'attributes', value: ['cdd.ontology:concepts'] },
  ],
  [
    { kind: 'identity', value: 'cdd.ontology:concepts' },
    { kind: 'concept', value: 'cdd.attribute' },
    { kind: 'slug', value: 'concepts' },
    { kind: 'name', value: 'concepts' },
    { kind: 'type', value: 'cdd.concept' },
    { kind: 'cardinality', value: '0+' },
  ],
]
