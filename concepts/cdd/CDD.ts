// The ontology root — an instance of the Ontology concept (cdd.ontology), not
// a concept itself. Its `concepts` property lists the concepts it contains.
// Glob-loaded by platform/web/ontology-editor's demo app; see that project's
// README for the file contract (one array of instances, each with its own
// `identity` property, exported as default).
//
// `cdd.project` is a separate, CDD-specific singleton concept (see
// concepts/singletons/Singleton.md), distinct from the ontology-viewer root
// above: it IS its own one instance — a singleton concept's instance and its
// concept are the same entry, not two separate identities — so its
// `inspirations` property (the outside ideas CDD's own design borrows from;
// see README.md's "Inspiration" section, which this mirrors) is set directly
// on the `cdd.project` entry below and renders on that same page.
export default [
  [
    { kind: 'identity', value: 'cdd' },
    { kind: 'concept', value: 'cdd.ontology' },
    { kind: 'slug', value: 'cdd' },
    { kind: 'name', value: 'CDD' },
    { kind: 'definition', value: 'the ontology being viewed.' },
    {
      kind: 'concepts',
      value: [
        'cdd.concept',
        'cdd.ontology',
        'cdd.instance',
        'cdd.attribute',
        'cdd.property',
        'cdd.name',
        'cdd.definition',
        'cdd.slug',
        'cdd.string',
        'cdd.transaction',
        'cdd.reflection',
        'cdd.project',
      ],
    },
  ],
  [
    { kind: 'identity', value: 'cdd.project' },
    { kind: 'concept', value: 'cdd.concept' },
    { kind: 'slug', value: 'project' },
    { kind: 'name', value: 'CDD' },
    {
      kind: 'definition',
      value: 'the {concept,cohesion,cli,convenience}-driven design methodology and its reference project — a singleton: the one instance is CDD itself.',
    },
    { kind: 'attributes', value: ['cdd.project:inspirations'] },
    {
      kind: 'inspirations',
      value: [
        'cdd.project:inspirations:screamingArchitecture',
        'cdd.project:inspirations:ontology',
        'cdd.project:inspirations:setTheory',
        'cdd.project:inspirations:oop',
        'cdd.project:inspirations:wikipedia',
        'cdd.project:inspirations:obsidian',
        'cdd.project:inspirations:featureSlicedDesign',
        'cdd.project:inspirations:ddd',
        'cdd.project:inspirations:rest',
      ],
    },
  ],
  [
    { kind: 'identity', value: 'cdd.project:inspirations' },
    { kind: 'concept', value: 'cdd.attribute' },
    { kind: 'slug', value: 'inspirations' },
    { kind: 'name', value: 'inspirations' },
    { kind: 'type', value: 'cdd.example' },
    { kind: 'cardinality', value: '0+' },
    { kind: 'description', value: 'outside ideas CDD’s own design borrows from.' },
  ],
  [
    { kind: 'identity', value: 'cdd.project:inspirations:screamingArchitecture' },
    { kind: 'concept', value: 'cdd.example' },
    {
      kind: 'description',
      value:
        'Screaming Architecture (Bob Martin) — CDD is a complete implementation of the idea: a project structure that screams its domain, not its framework.',
    },
  ],
  [
    { kind: 'identity', value: 'cdd.project:inspirations:ontology' },
    { kind: 'concept', value: 'cdd.example' },
    {
      kind: 'description',
      value: 'Ontology, the philosophical study of being.',
    },
  ],
  [
    { kind: 'identity', value: 'cdd.project:inspirations:setTheory' },
    { kind: 'concept', value: 'cdd.example' },
    {
      kind: 'description',
      value:
        'Set theory — concepts are classes, their instances comprise a volume, and a project’s modeled reality is that volume’s real subset.',
    },
  ],
  [
    { kind: 'identity', value: 'cdd.project:inspirations:oop' },
    { kind: 'concept', value: 'cdd.example' },
    { kind: 'description', value: 'Object-oriented programming — only the best parts.' },
  ],
  [
    { kind: 'identity', value: 'cdd.project:inspirations:wikipedia' },
    { kind: 'concept', value: 'cdd.example' },
    {
      kind: 'description',
      value: 'Wikipedia-style article organization — everything about a single concept lives in a single place.',
    },
  ],
  [
    { kind: 'identity', value: 'cdd.project:inspirations:obsidian' },
    { kind: 'concept', value: 'cdd.example' },
    { kind: 'description', value: 'Obsidian.' },
  ],
  [
    { kind: 'identity', value: 'cdd.project:inspirations:featureSlicedDesign' },
    { kind: 'concept', value: 'cdd.example' },
    { kind: 'description', value: 'Feature-sliced design, pushed to its logical end.' },
  ],
  [
    { kind: 'identity', value: 'cdd.project:inspirations:ddd' },
    { kind: 'concept', value: 'cdd.example' },
    {
      kind: 'description',
      value:
        'Domain-Driven Design, where problem domain concepts are first-class citizens. Organizes the whole codebase using ubiquitous language, makes heavy use of the Repository pattern.',
    },
  ],
  [
    { kind: 'identity', value: 'cdd.project:inspirations:rest' },
    { kind: 'concept', value: 'cdd.example' },
    {
      kind: 'description',
      value:
        'REST’s convention of organizing an API around nouns (resources) rather than actions — CDD generalizes this noun-first instinct from the network boundary to the whole repository.',
    },
  ],
]
