// A leaf concept — declares no attributes.
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
  ],
]
