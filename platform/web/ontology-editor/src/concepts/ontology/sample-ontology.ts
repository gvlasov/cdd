import type { Ontology } from './Ontology'

// Flat and rhizomatic: concepts keyed by identity, each a list of properties.
// The `ontology` entry is the root concept of itself. Every other concept has a
// slug, so its key is the dotted metaentity chain `<rootSlug>.<conceptSlug>`.
// The root's `attributes` property declares the property kinds its instances
// (every concept below it) may have.
export const sampleOntology: Ontology = {
  root: 'ontology',
  concepts: {
    ontology: [
      { kind: 'identity', value: 'ontology' },
      { kind: 'slug', value: 'ontology' },
      { kind: 'name', value: 'CDD' },
      { kind: 'definition', value: 'The ontology being viewed — the root concept of itself.' },
      { kind: 'attributes', value: ['identity', 'slug', 'name', 'definition', 'concept', 'examples'] },
      { kind: 'concept', value: 'ontology.concept' },
      { kind: 'concept', value: 'ontology.attribute' },
      { kind: 'concept', value: 'ontology.property' },
    ],
    'ontology.concept': [
      { kind: 'identity', value: 'ontology.concept' },
      { kind: 'slug', value: 'concept' },
      { kind: 'name', value: 'Concept' },
      {
        kind: 'definition',
        value:
          'A cohesion unit: the unifying principle of representations held together by meaning. A concept is a collection of properties, and its attributes declare what properties its instances may have.',
      },
      { kind: 'concept', value: 'ontology.name' },
      { kind: 'concept', value: 'ontology.definition' },
      { kind: 'concept', value: 'ontology.attribute' },
      { kind: 'concept', value: 'ontology.slug' },
    ],
    'ontology.attribute': [
      { kind: 'identity', value: 'ontology.attribute' },
      { kind: 'slug', value: 'attribute' },
      { kind: 'name', value: 'Attribute' },
      {
        kind: 'definition',
        value:
          'Belongs to a concept. Defines what property an instance of that concept may have.',
      },
      { kind: 'concept', value: 'ontology.name' },
    ],
    'ontology.property': [
      { kind: 'identity', value: 'ontology.property' },
      { kind: 'slug', value: 'property' },
      { kind: 'name', value: 'Property' },
      {
        kind: 'definition',
        value:
          'Belongs to an instance. A value the instance holds in a slot its concept defines via an attribute.',
      },
    ],
    'ontology.name': [
      { kind: 'identity', value: 'ontology.name' },
      { kind: 'slug', value: 'name' },
      { kind: 'name', value: 'Name' },
      {
        kind: 'definition',
        value: 'A string of symbols that uniquely identifies a concept or a reflection.',
      },
    ],
    'ontology.definition': [
      { kind: 'identity', value: 'ontology.definition' },
      { kind: 'slug', value: 'definition' },
      { kind: 'name', value: 'Definition' },
      { kind: 'definition', value: 'The text that says what a concept is.' },
    ],
    'ontology.slug': [
      { kind: 'identity', value: 'ontology.slug' },
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
