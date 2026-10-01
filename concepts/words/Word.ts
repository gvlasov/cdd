// A Word is a language-independent lexical unit represented by its
// translations. A Name may list several Words as synonyms.
export default [
  [
    { kind: 'identity', value: 'cdd.word' },
    { kind: 'concept', value: 'cdd.concept' },
    { kind: 'slug', value: 'word' },
    { kind: 'name', value: 'Word' },
    { kind: 'definition', value: 'a word expressed by one or more translations.' },
    { kind: 'attributes', value: ['cdd.word:translations'] },
    { kind: 'examples', value: ['cdd.word:examples:bottle'] },
  ],
  [
    { kind: 'identity', value: 'cdd.word:translations' },
    { kind: 'concept', value: 'cdd.attribute' },
    { kind: 'slug', value: 'translations' },
    { kind: 'name', value: 'translations' },
    { kind: 'type', value: 'cdd.translation' },
    { kind: 'cardinality', value: '1+' },
  ],
  [
    { kind: 'identity', value: 'cdd.word:examples:bottle' },
    { kind: 'concept', value: 'cdd.example' },
    { kind: 'instance', value: 'cdd.word:bottle' },
    { kind: 'description', value: 'English → Bottle; Russian → Бутылка.' },
  ],
  [
    { kind: 'identity', value: 'cdd.word:bottle' },
    { kind: 'concept', value: 'cdd.word' },
    {
      kind: 'translations',
      value: ['cdd.word:bottle:english', 'cdd.word:bottle:russian'],
    },
  ],
  [
    { kind: 'identity', value: 'cdd.word:bottle:english' },
    { kind: 'concept', value: 'cdd.translation' },
    { kind: 'language', value: 'cdd.language:en' },
    { kind: 'value', value: 'Bottle' },
  ],
  [
    { kind: 'identity', value: 'cdd.word:bottle:russian' },
    { kind: 'concept', value: 'cdd.translation' },
    { kind: 'language', value: 'cdd.language:ru' },
    { kind: 'value', value: 'Бутылка' },
  ],
]
