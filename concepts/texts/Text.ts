// Text is localized content. Its translations are edited in the language the
// ontology editor currently displays.
export default [
  [
    { kind: 'identity', value: 'cdd.text' },
    { kind: 'concept', value: 'cdd.concept' },
    { kind: 'slug', value: 'text' },
    { kind: 'name', value: 'Text' },
    { kind: 'definition', value: 'content expressed through translations.' },
    { kind: 'attributes', value: ['cdd.text:translations'] },
  ],
  [
    { kind: 'identity', value: 'cdd.text:translations' },
    { kind: 'concept', value: 'cdd.attribute' },
    { kind: 'slug', value: 'translations' },
    { kind: 'name', value: 'translations' },
    { kind: 'type', value: 'cdd.translation' },
    { kind: 'cardinality', value: '1+' },
  ],
]
