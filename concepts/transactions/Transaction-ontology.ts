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
      value: [
        'cdd.transaction:slug',
        'cdd.transaction:parentConcept',
        'cdd.transaction:canonicalName',
        'cdd.transaction:params',
      ],
    },
    {
      kind: 'examples',
      value: [
        'cdd.transaction:examples:usersCreate',
        'cdd.transaction:examples:ordersSetDestination',
        'cdd.transaction:examples:packagesMark',
      ],
    },
    {
      kind: 'layers',
      value: [
        'user intent',
        'frontend code',
        'transport layer request',
        'route',
        'controller',
        'validation',
        'mutation',
        'persistence',
        'response',
        'UI display',
      ],
    },
    {
      kind: 'concerns',
      value: [
        'input constraints',
        'rate limiting',
        'transport',
        'database queries',
        'caching',
        'state manipulation',
      ],
    },
  ],
  [
    { kind: 'identity', value: 'cdd.transaction:examples:usersCreate' },
    { kind: 'concept', value: 'cdd.example' },
    { kind: 'description', value: 'users:create — registers a new user account.' },
  ],
  [
    { kind: 'identity', value: 'cdd.transaction:examples:ordersSetDestination' },
    { kind: 'concept', value: 'cdd.example' },
    { kind: 'description', value: 'orders:set-destination — changes where a placed order ships to.' },
  ],
  [
    { kind: 'identity', value: 'cdd.transaction:examples:packagesMark' },
    { kind: 'concept', value: 'cdd.example' },
    { kind: 'description', value: 'packages:mark — flags a package with a status, e.g. lost or delivered.' },
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
    { kind: 'computed', value: 'true' },
    {
      kind: 'function',
      value:
        "const parentId = (instance.find((p) => p.kind === 'parentConcept') || {}).value; const parent = parentId ? ontology.instances[parentId] : undefined; const parentSlug = parent ? (parent.find((p) => p.kind === 'slug') || {}).value : undefined; const slug = (instance.find((p) => p.kind === 'slug') || {}).value; return parentSlug && slug ? `${parentSlug}:${slug}` : ''",
    },
  ],
  [
    { kind: 'identity', value: 'cdd.transaction:params' },
    { kind: 'concept', value: 'cdd.attribute' },
    { kind: 'slug', value: 'params' },
    { kind: 'name', value: 'params' },
    { kind: 'type', value: 'cdd.string' },
    { kind: 'cardinality', value: '0+' },
    { kind: 'description', value: 'names of the inputs the transaction’s effect expects.' },
  ],
]
