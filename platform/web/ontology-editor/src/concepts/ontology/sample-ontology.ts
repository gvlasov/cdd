import type { Ontology } from './Ontology'

// Flat, rhizomatic: concepts keyed by identity, each a list of attributes.
// `concept` attributes reference other concepts by identity.
export const sampleOntology: Ontology = {
  concepts: {
    concept: [
      { kind: 'identity', value: 'concept' },
      { kind: 'name', value: 'Concept' },
      {
        kind: 'definition',
        value:
          'A cohesion unit: the unifying principle of representations held together by meaning. A concept is a collection of attributes.',
      },
      { kind: 'concept', value: 'name' },
      { kind: 'concept', value: 'definition' },
      { kind: 'concept', value: 'attribute' },
      { kind: 'examples', value: 'concept-examples' },
    ],
    attribute: [
      { kind: 'identity', value: 'attribute' },
      { kind: 'name', value: 'Attribute' },
      { kind: 'definition', value: 'Something that has an immediate relation to an instance.' },
      { kind: 'concept', value: 'name' },
    ],
    name: [
      { kind: 'identity', value: 'name' },
      { kind: 'name', value: 'Name' },
      {
        kind: 'definition',
        value: 'A string of symbols that uniquely identifies a concept or a reflection.',
      },
    ],
    definition: [
      { kind: 'identity', value: 'definition' },
      { kind: 'name', value: 'Definition' },
      { kind: 'definition', value: 'The text that says what a concept is.' },
    ],
    'concept-examples': [
      { kind: 'identity', value: 'concept-examples' },
      { kind: 'name', value: 'orders, users, invoices' },
    ],
  },
}
