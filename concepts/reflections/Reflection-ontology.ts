// A reflection is how a concept exists in a project: any file — code, view,
// test, doc, asset — that represents the concept. `parentConcept` (1) links to
// the concept it reflects, displayed as "concept" since the concept's own
// `concept` property already means something else (its type); placement
// follows that link, not the runtime mechanism. See
// concepts/reflections/Reflection.md for the full writeup.
export default [
  [
    { kind: 'identity', value: 'cdd.reflection' },
    { kind: 'concept', value: 'cdd.concept' },
    { kind: 'slug', value: 'reflection' },
    { kind: 'name', value: 'Reflection' },
    {
      kind: 'definition',
      value:
        'a way for a [concept](.concept) to exist. a concept is represented by its reflections — code, views, tests, docs, assets — not by any single one of them.',
    },
    { kind: 'attributes', value: ['cdd.reflection:parentConcept'] },
    {
      kind: 'examples',
      value: [
        'cdd.reflection:examples:productDto',
        'cdd.reflection:examples:orderReceipt',
        'cdd.reflection:examples:readme',
      ],
    },
  ],
  [
    { kind: 'identity', value: 'cdd.reflection:examples:productDto' },
    { kind: 'concept', value: 'cdd.example' },
    { kind: 'description', value: 'ProductDTO is a reflection of the Product concept.' },
  ],
  [
    { kind: 'identity', value: 'cdd.reflection:examples:orderReceipt' },
    { kind: 'concept', value: 'cdd.example' },
    { kind: 'description', value: 'OrderReceipt reflects Order for the customer stakeholder.' },
  ],
  [
    { kind: 'identity', value: 'cdd.reflection:examples:readme' },
    { kind: 'concept', value: 'cdd.example' },
    { kind: 'description', value: '/concepts/products/README.md, explaining the Product concept, is itself a reflection.' },
  ],
  [
    { kind: 'identity', value: 'cdd.reflection:parentConcept' },
    { kind: 'concept', value: 'cdd.attribute' },
    { kind: 'slug', value: 'parentConcept' },
    { kind: 'name', value: 'concept' },
    { kind: 'type', value: 'cdd.concept' },
    { kind: 'cardinality', value: '1' },
    { kind: 'description', value: 'the concept this reflection represents.' },
  ],
]
