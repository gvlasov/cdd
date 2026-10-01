// A Name is expressed through one or more synonymous Words. Each Word carries
// its translations, so a name remains language-neutral while a reader can
// choose a translation in a particular Language.
export default [
  [
    { kind: 'identity', value: 'cdd.name' },
    { kind: 'concept', value: 'cdd.concept' },
    { kind: 'slug', value: 'name' },
    { kind: 'name', value: 'Name' },
    { kind: 'definition', value: 'a set of synonymous words that identifies an instance within its concept.' },
    { kind: 'attributes', value: ['cdd.name:synonyms'] },
  ],
  [
    { kind: 'identity', value: 'cdd.name:synonyms' },
    { kind: 'concept', value: 'cdd.attribute' },
    { kind: 'slug', value: 'synonyms' },
    { kind: 'name', value: 'synonyms' },
    { kind: 'type', value: 'cdd.word' },
    { kind: 'cardinality', value: '1+' },
  ],
]
