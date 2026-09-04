// A leaf concept — declares no attributes.
export default [
  [
    { kind: 'identity', value: 'cdd.slug' },
    { kind: 'concept', value: 'cdd.concept' },
    { kind: 'slug', value: 'slug' },
    { kind: 'name', value: 'Slug' },
    {
      kind: 'definition',
      value:
        'A `[a-zA-Z0-9_-]` word, unique within the ontology. An [instance](.instance)’s identity is its metaentity chain of slugs joined by `.` — `<ontology>.<concept>.<instance>`.',
    },
  ],
]
