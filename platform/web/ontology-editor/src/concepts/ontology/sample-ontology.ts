import type { Ontology } from './Ontology'

// The `cdd` instance is an ontology — the root concept of itself (slug `cdd`).
// Its `concepts` property lists the concepts the ontology contains; its
// `attributes` property lists the attribute concepts every concept may carry.
// Every concept has a slug, so its identity (its key in `instances`) is the
// dotted metaentity chain `<rootSlug>.<conceptSlug>`.
export const sampleOntology: Ontology = {
  root: 'cdd',
  instances: {
    cdd: [
      { kind: 'identity', value: 'cdd' },
      { kind: 'slug', value: 'cdd' },
      { kind: 'name', value: 'CDD' },
      { kind: 'definition', value: 'The ontology being viewed — the root concept of itself.' },
      {
        kind: 'attributes',
        value: ['cdd.name', 'cdd.definition', 'cdd.slug'],
      },
      {
        kind: 'concepts',
        value: [
          'cdd.concept',
          'cdd.attribute',
          'cdd.property',
          'cdd.name',
          'cdd.definition',
          'cdd.slug',
        ],
      },
    ],
    'cdd.concept': [
      { kind: 'identity', value: 'cdd.concept' },
      { kind: 'slug', value: 'concept' },
      { kind: 'name', value: 'Concept' },
      {
        kind: 'definition',
        value:
          'A cohesion unit: the unifying principle of representations held together by meaning. A concept is a collection of properties, and its attributes declare what properties its instances may have.',
      },
      {
        kind: 'attributes',
        value: ['cdd.name', 'cdd.definition', 'cdd.attribute', 'cdd.slug'],
      },
    ],
    'cdd.attribute': [
      { kind: 'identity', value: 'cdd.attribute' },
      { kind: 'slug', value: 'attribute' },
      { kind: 'name', value: 'Attribute' },
      {
        kind: 'definition',
        value:
          'Belongs to a concept. Defines what property an instance of that concept may have.',
      },
      { kind: 'attributes', value: ['cdd.name', 'cdd.definition'] },
    ],
    'cdd.property': [
      { kind: 'identity', value: 'cdd.property' },
      { kind: 'slug', value: 'property' },
      { kind: 'name', value: 'Property' },
      {
        kind: 'definition',
        value:
          'Belongs to an instance. A value the instance holds in a slot its concept defines via an attribute.',
      },
    ],
    'cdd.name': [
      { kind: 'identity', value: 'cdd.name' },
      { kind: 'slug', value: 'name' },
      { kind: 'name', value: 'Name' },
      {
        kind: 'definition',
        value: 'A string of symbols that uniquely identifies a concept or a reflection.',
      },
    ],
    'cdd.definition': [
      { kind: 'identity', value: 'cdd.definition' },
      { kind: 'slug', value: 'definition' },
      { kind: 'name', value: 'Definition' },
      { kind: 'definition', value: 'The text that says what a concept is.' },
    ],
    'cdd.slug': [
      { kind: 'identity', value: 'cdd.slug' },
      { kind: 'slug', value: 'slug' },
      { kind: 'name', value: 'Slug' },
      {
        kind: 'definition',
        value:
          'A [a-zA-Z0-9_-] word that uniquely identifies an instance within the ontology; the metaentity chain of slugs joined by "." builds an identity.',
      },
    ],
  },
}
