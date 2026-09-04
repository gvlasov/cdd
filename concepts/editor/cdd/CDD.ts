// The ontology root — an instance of cdd.concept, so it gets name/slug/
// definition from cdd.concept's attributes; it declares none of its own.
// Glob-loaded by platform/web/ontology-editor's demo app; see that project's
// README for the file contract (one array of instances, each with its own
// `identity` property, exported as default).
export default [
  [
    { kind: 'identity', value: 'cdd' },
    { kind: 'concept', value: 'cdd.concept' },
    { kind: 'slug', value: 'cdd' },
    { kind: 'name', value: 'CDD' },
    { kind: 'definition', value: 'The ontology being viewed — the root concept of itself.' },
    {
      kind: 'concepts',
      value: [
        'cdd.concept',
        'cdd.instance',
        'cdd.attribute',
        'cdd.property',
        'cdd.name',
        'cdd.definition',
        'cdd.slug',
        'cdd.transaction',
      ],
    },
  ],
]
