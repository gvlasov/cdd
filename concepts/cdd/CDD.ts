// The ontology root — an instance of the Ontology concept (cdd.ontology), not
// a concept itself. Its `concepts` property lists the concepts it contains.
// Glob-loaded by platform/web/ontology-editor's demo app; see that project's
// README for the file contract (one array of instances, each with its own
// `identity` property, exported as default).
export default [
  [
    { kind: 'identity', value: 'cdd' },
    { kind: 'concept', value: 'cdd.ontology' },
    { kind: 'slug', value: 'cdd' },
    { kind: 'name', value: 'CDD' },
    { kind: 'definition', value: 'the ontology being viewed.' },
    {
      kind: 'concepts',
      value: [
        'cdd.concept',
        'cdd.ontology',
        'cdd.instance',
        'cdd.attribute',
        'cdd.property',
        'cdd.name',
        'cdd.definition',
        'cdd.slug',
        'cdd.string',
        'cdd.transaction',
        'cdd.reflection',
      ],
    },
  ],
]
