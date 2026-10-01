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
  // The concept's own name has two synonymous Words. Keeping the lexical
  // instances here, rather than hard-coding an editor label, makes `Noun`
  // available wherever a Name is presented.
  [
    { kind: 'identity', value: 'cdd.name:cdd.name' },
    { kind: 'concept', value: 'cdd.name' },
    { kind: 'synonyms', value: ['cdd.name:cdd.name:name', 'cdd.name:cdd.name:noun'] },
  ],
  [
    { kind: 'identity', value: 'cdd.name:cdd.name:name' },
    { kind: 'concept', value: 'cdd.word' },
    { kind: 'translations', value: ['cdd.name:cdd.name:name:translation:en'] },
  ],
  [
    { kind: 'identity', value: 'cdd.name:cdd.name:name:translation:en' },
    { kind: 'concept', value: 'cdd.translation' },
    { kind: 'language', value: 'cdd.language:en' },
    { kind: 'value', value: 'Name' },
  ],
  [
    { kind: 'identity', value: 'cdd.name:cdd.name:noun' },
    { kind: 'concept', value: 'cdd.word' },
    { kind: 'translations', value: ['cdd.name:cdd.name:noun:translation:en'] },
  ],
  [
    { kind: 'identity', value: 'cdd.name:cdd.name:noun:translation:en' },
    { kind: 'concept', value: 'cdd.translation' },
    { kind: 'language', value: 'cdd.language:en' },
    { kind: 'value', value: 'Noun' },
  ],
]
