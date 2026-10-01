export default [
  [
    { kind: 'identity', value: 'cdd.language' },
    { kind: 'concept', value: 'cdd.concept' },
    { kind: 'slug', value: 'language' },
    { kind: 'name', value: 'Language' },
    { kind: 'definition', value: 'a natural language, identified by its ISO name.' },
    { kind: 'attributes', value: ['cdd.language:isoName'] },
  ],
  [
    { kind: 'identity', value: 'cdd.language:isoName' },
    { kind: 'concept', value: 'cdd.attribute' },
    { kind: 'slug', value: 'isoName' },
    { kind: 'name', value: 'ISO name' },
    { kind: 'type', value: 'cdd.string' },
    { kind: 'cardinality', value: '1' },
  ],
  [
    { kind: 'identity', value: 'cdd.language:en' },
    { kind: 'concept', value: 'cdd.language' },
    { kind: 'isoName', value: 'en' },
    { kind: 'name', value: 'English' },
  ],
  [
    { kind: 'identity', value: 'cdd.language:ru' },
    { kind: 'concept', value: 'cdd.language' },
    { kind: 'isoName', value: 'ru' },
    { kind: 'name', value: 'Russian' },
  ],
]
