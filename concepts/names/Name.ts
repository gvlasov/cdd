// A leaf concept — declares no attributes. An attribute-concept (see
// concepts/attribute-concepts/AttributeConcept.md): the only attribute typed
// `cdd.name` is `cdd.instance:name`, so it merges into that attribute's own
// page instead of getting one of its own — see `soleOwningAttribute`.
export default [
  [
    { kind: 'identity', value: 'cdd.name' },
    { kind: 'concept', value: 'cdd.concept' },
    { kind: 'slug', value: 'name' },
    { kind: 'name', value: 'Name' },
    { kind: 'definition', value: 'a string that identifies a concept or a reflection.' },
  ],
]
