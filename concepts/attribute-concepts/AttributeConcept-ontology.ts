// A concept that exists only to shape one attribute's values — the `type` of
// exactly one attribute across the whole ontology, and not itself referenced
// as a `concepts` member or any other attribute's type. See
// concepts/attribute-concepts/AttributeConcept.md for the full writeup. The
// ontology editor already merges such a concept's page into its one owning
// attribute's page — see `soleOwningAttribute` in Attribute.ts.
export default [
  [
    { kind: 'identity', value: 'cdd.attributeConcept' },
    { kind: 'concept', value: 'cdd.concept' },
    { kind: 'slug', value: 'attributeConcept' },
    { kind: 'name', value: 'Attribute-concept' },
    {
      kind: 'definition',
      value:
        'a [concept](.concept) that exists only to shape a single [attribute](.attribute)’s values — the `type` of exactly one attribute across the whole ontology.',
    },
    {
      kind: 'examples',
      value: ['cdd.attributeConcept:examples:name', 'cdd.attributeConcept:examples:slug'],
    },
  ],
  [
    { kind: 'identity', value: 'cdd.attributeConcept:examples:name' },
    { kind: 'concept', value: 'cdd.example' },
    { kind: 'instance', value: 'cdd.name' },
    {
      kind: 'description',
      value: 'the type of exactly one attribute in this ontology: Instance.name.',
    },
  ],
  [
    { kind: 'identity', value: 'cdd.attributeConcept:examples:slug' },
    { kind: 'concept', value: 'cdd.example' },
    { kind: 'instance', value: 'cdd.slug' },
    {
      kind: 'description',
      value: 'shapes only Concept.slug and Transaction.slug in this ontology — not (yet) a sole owner, but the same kind of narrow, single-purpose type.',
    },
  ],
]
