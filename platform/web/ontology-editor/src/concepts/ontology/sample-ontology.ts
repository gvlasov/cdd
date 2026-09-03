import type { Ontology } from './Ontology'

// Flat and rhizomatic: concepts keyed by identity, each a list of attributes.
// The `ontology` entry is the root concept of itself. Every other concept has a
// slug, so its key is the dotted metaentity chain `<rootSlug>.<conceptSlug>`.
export const sampleOntology: Ontology = {
  root: 'ontology',
  concepts: {
    ontology: [
      { kind: 'identity', value: 'ontology' },
      { kind: 'slug', value: 'ontology' },
      { kind: 'name', value: 'CDD' },
      { kind: 'definition', value: 'The ontology being viewed — the root concept of itself.' },
      { kind: 'concept', value: 'ontology.concept' },
      { kind: 'concept', value: 'ontology.attribute' },
    ],
    'ontology.concept': [
      { kind: 'identity', value: 'ontology.concept' },
      { kind: 'slug', value: 'concept' },
      { kind: 'name', value: 'Concept' },
      {
        kind: 'definition',
        value:
          'A cohesion unit: the unifying principle of representations held together by meaning. A concept is a collection of attributes.',
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
      { kind: 'definition', value: 'Something that has an immediate relation to an instance.' },
      { kind: 'concept', value: 'ontology.name' },
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
          'A [a-zA-Z0-9_-] word that uniquely identifies a concept within the ontology; the metaentity chain of slugs joined by "." builds an identity.',
      },
    ],
  },
}
