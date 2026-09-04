// `parentConcept` (1) is the concept the transaction is about, e.g. `cdd.users`
// for `users:set-username` — distinct from `concept`, which names the
// instance's own type (always `cdd.transaction`). `canonicalName` is computed:
// `<parentConcept slug>:<transaction slug>`, e.g. `logs:view`.
export default [
  [
    { kind: 'identity', value: 'cdd.transaction' },
    { kind: 'concept', value: 'cdd.concept' },
    { kind: 'slug', value: 'transaction' },
    { kind: 'name', value: 'Transaction' },
    {
      kind: 'definition',
      value:
        'a write operation on a [concept](.concept) — how its instances come to be and change. identified `<conceptId>:<name>`.',
    },
    {
      kind: 'attributes',
      value: ['cdd.transaction:slug', 'cdd.transaction:parentConcept', 'cdd.transaction:canonicalName'],
    },
  ],
  [
    { kind: 'identity', value: 'cdd.transaction:slug' },
    { kind: 'concept', value: 'cdd.attribute' },
    { kind: 'slug', value: 'slug' },
    { kind: 'name', value: 'slug' },
    { kind: 'type', value: 'cdd.slug' },
    { kind: 'cardinality', value: '1' },
  ],
  [
    { kind: 'identity', value: 'cdd.transaction:parentConcept' },
    { kind: 'concept', value: 'cdd.attribute' },
    { kind: 'slug', value: 'parentConcept' },
    { kind: 'name', value: 'parent concept' },
    { kind: 'type', value: 'cdd.concept' },
    { kind: 'cardinality', value: '1' },
  ],
  [
    { kind: 'identity', value: 'cdd.transaction:canonicalName' },
    { kind: 'concept', value: 'cdd.attribute' },
    { kind: 'slug', value: 'canonicalName' },
    { kind: 'name', value: 'canonical name' },
    { kind: 'type', value: 'cdd.string' },
    { kind: 'cardinality', value: '1' },
    {
      kind: 'examples',
      value: [
        'cdd.transaction:canonicalName:examples:usersCreate',
        'cdd.transaction:canonicalName:examples:ordersSetDestination',
        'cdd.transaction:canonicalName:examples:packagesMark',
      ],
    },
    { kind: 'computed', value: 'true' },
    {
      kind: 'function',
      value:
        "const parentId = (instance.find((p) => p.kind === 'parentConcept') || {}).value; const parent = parentId ? ontology.instances[parentId] : undefined; const parentSlug = parent ? (parent.find((p) => p.kind === 'slug') || {}).value : undefined; const slug = (instance.find((p) => p.kind === 'slug') || {}).value; return parentSlug && slug ? `${parentSlug}:${slug}` : ''",
    },
  ],
  [
    { kind: 'identity', value: 'cdd.transaction:canonicalName:examples:usersCreate' },
    { kind: 'concept', value: 'cdd.example' },
    { kind: 'description', value: 'users:create' },
  ],
  [
    { kind: 'identity', value: 'cdd.transaction:canonicalName:examples:ordersSetDestination' },
    { kind: 'concept', value: 'cdd.example' },
    { kind: 'description', value: 'orders:set-destination' },
  ],
  [
    { kind: 'identity', value: 'cdd.transaction:canonicalName:examples:packagesMark' },
    { kind: 'concept', value: 'cdd.example' },
    { kind: 'description', value: 'packages:mark' },
  ],
]
