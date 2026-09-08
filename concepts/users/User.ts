// A User is modeled as a first-class concept so systems can make the people
// they serve explicit in their ontology.
export default [
  [
    { kind: 'identity', value: 'cdd.user' },
    { kind: 'concept', value: 'cdd.concept' },
    { kind: 'slug', value: 'user' },
    { kind: 'name', value: 'User' },
    {
      kind: 'definition',
      value:
        'a [subject](.subject) that has beliefs about how concepts can be represented and about the outcomes of processes it can run.',
    },
  ],
]
