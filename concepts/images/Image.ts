// An Image provides visual content for another instance. Its source is either
// a URL or an embedded data URL kept in `blob`.
export default [
  [
    { kind: 'identity', value: 'cdd.image' },
    { kind: 'concept', value: 'cdd.concept' },
    { kind: 'slug', value: 'image' },
    { kind: 'name', value: 'Image' },
    {
      kind: 'definition',
      value: 'a visual representation supplied by a URL or an embedded data blob.',
    },
    { kind: 'attributes', value: ['cdd.image:url', 'cdd.image:blob'] },
  ],
  [
    { kind: 'identity', value: 'cdd.image:url' },
    { kind: 'concept', value: 'cdd.attribute' },
    { kind: 'slug', value: 'url' },
    { kind: 'name', value: 'url' },
    { kind: 'type', value: 'cdd.string' },
    { kind: 'cardinality', value: '0-1' },
  ],
  [
    { kind: 'identity', value: 'cdd.image:blob' },
    { kind: 'concept', value: 'cdd.attribute' },
    { kind: 'slug', value: 'blob' },
    { kind: 'name', value: 'blob' },
    { kind: 'type', value: 'cdd.string' },
    { kind: 'cardinality', value: '0-1' },
  ],
]
