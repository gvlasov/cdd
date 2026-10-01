export default [
  [
    { kind: 'identity', value: 'cdd.translation' },
    { kind: 'concept', value: 'cdd.concept' },
    { kind: 'slug', value: 'translation' },
    { kind: 'name', value: 'Translation' },
    { kind: 'definition', value: 'a word expressed in one language.' },
    { kind: 'attributes', value: ['cdd.translation:language', 'cdd.translation:value'] },
  ],
  [
    { kind: 'identity', value: 'cdd.translation:language' },
    { kind: 'concept', value: 'cdd.attribute' },
    { kind: 'slug', value: 'language' },
    { kind: 'name', value: 'language' },
    { kind: 'type', value: 'cdd.language' },
    { kind: 'cardinality', value: '1' },
  ],
  [
    { kind: 'identity', value: 'cdd.translation:value' },
    { kind: 'concept', value: 'cdd.attribute' },
    { kind: 'slug', value: 'value' },
    { kind: 'name', value: 'value' },
    { kind: 'type', value: 'cdd.string' },
    { kind: 'cardinality', value: '1' },
  ],
]
