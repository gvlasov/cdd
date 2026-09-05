// `concepts` (0+, typed cdd.concept) is the list of concepts an ontology
// contains — a reference list, not owned sub-instances (unlike Concept's
// `examples`), since each concept is a top-level entry in its own right.
// `inspirations` (0+, typed cdd.example) owns a list of plain-text Example
// instances — outside ideas the ontology's own design borrows from.
export default [
  [
    { kind: 'identity', value: 'cdd.ontology' },
    { kind: 'concept', value: 'cdd.concept' },
    { kind: 'slug', value: 'ontology' },
    { kind: 'name', value: 'Ontology' },
    {
      kind: 'definition',
      value: 'a flat, rhizomatic collection of [concepts](.concept).',
    },
    { kind: 'attributes', value: ['cdd.ontology:concepts', 'cdd.ontology:inspirations'] },
  ],
  [
    { kind: 'identity', value: 'cdd.ontology:concepts' },
    { kind: 'concept', value: 'cdd.attribute' },
    { kind: 'slug', value: 'concepts' },
    { kind: 'name', value: 'concepts' },
    { kind: 'type', value: 'cdd.concept' },
    { kind: 'cardinality', value: '0+' },
    { kind: 'description', value: 'all concepts of an ontology.' },
  ],
  [
    { kind: 'identity', value: 'cdd.ontology:inspirations' },
    { kind: 'concept', value: 'cdd.attribute' },
    { kind: 'slug', value: 'inspirations' },
    { kind: 'name', value: 'inspirations' },
    { kind: 'type', value: 'cdd.example' },
    { kind: 'cardinality', value: '0+' },
    { kind: 'description', value: 'outside ideas an ontology’s design borrows from.' },
  ],
]
