import type { Ontology } from './Ontology'

// Every entry is an instance. Its `concept` property names its type. A concept
// is an instance typed `cdd.concept` that also carries an `attributes` list.
// The `cdd` instance is an ontology — the root concept of itself (slug `cdd`);
// its `concepts` property lists the concepts the ontology contains.
//
// An attribute concept with a truthy `required` property is rendered from the
// start in the instance editor; the rest appear behind a "+attribute" button.
export const sampleOntology: Ontology = {
  root: 'cdd',
  instances: {
    cdd: [
      { kind: 'identity', value: 'cdd' },
      { kind: 'concept', value: 'cdd.concept' },
      { kind: 'slug', value: 'cdd' },
      { kind: 'name', value: 'CDD' },
      { kind: 'definition', value: 'The ontology being viewed — the root concept of itself.' },
      { kind: 'attributes', value: ['cdd.name', 'cdd.definition', 'cdd.slug'] },
      {
        kind: 'concepts',
        value: [
          'cdd.concept',
          'cdd.instance',
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
      { kind: 'concept', value: 'cdd.concept' },
      { kind: 'slug', value: 'concept' },
      { kind: 'name', value: 'Concept' },
      {
        kind: 'definition',
        value:
          'A cohesion unit: the unifying principle of representations held together by meaning. A concept is a collection of [properties](.property), and its [attributes](.attribute) declare what properties its instances may have.',
      },
      {
        kind: 'attributes',
        value: ['cdd.name', 'cdd.slug', 'cdd.definition', 'cdd.attribute'],
      },
      { kind: 'transactions', value: ['cdd.concept:create'] },
    ],
    'cdd.concept:create': [
      { kind: 'identity', value: 'cdd.concept:create' },
      { kind: 'name', value: 'create' },
      { kind: 'definition', value: 'Constructor: spawn a new concept instance into the reality.' },
      { kind: 'params', value: ['name', 'definition'] },
      {
        kind: 'effect',
        value:
          "return reality.add('cdd.concept', { name: input.name, definition: input.definition })",
      },
    ],
    'cdd.instance': [
      { kind: 'identity', value: 'cdd.instance' },
      { kind: 'concept', value: 'cdd.concept' },
      { kind: 'slug', value: 'instance' },
      { kind: 'name', value: 'Instance' },
      {
        kind: 'definition',
        value:
          'Anything the ontology holds: a collection of [properties](.property) addressed by a unique identity, with a type named by its `concept` property. A [concept](.concept) is an instance that also declares [attributes](.attribute).',
      },
      { kind: 'attributes', value: ['cdd.name', 'cdd.slug', 'cdd.definition'] },
    ],
    'cdd.attribute': [
      { kind: 'identity', value: 'cdd.attribute' },
      { kind: 'concept', value: 'cdd.concept' },
      { kind: 'slug', value: 'attribute' },
      { kind: 'name', value: 'Attribute' },
      {
        kind: 'definition',
        value:
          'Belongs to a [concept](.concept). Defines what [property](.property) an [instance](.instance) of that concept may have.',
      },
      { kind: 'attributes', value: ['cdd.name', 'cdd.definition', 'cdd.slug'] },
    ],
    'cdd.property': [
      { kind: 'identity', value: 'cdd.property' },
      { kind: 'concept', value: 'cdd.concept' },
      { kind: 'slug', value: 'property' },
      { kind: 'name', value: 'Property' },
      {
        kind: 'definition',
        value:
          'Belongs to an [instance](.instance). A value the instance holds in a slot its [concept](.concept) defines via an [attribute](.attribute).',
      },
      { kind: 'attributes', value: ['cdd.name', 'cdd.definition', 'cdd.slug'] },
    ],
    'cdd.name': [
      { kind: 'identity', value: 'cdd.name' },
      { kind: 'concept', value: 'cdd.concept' },
      { kind: 'slug', value: 'name' },
      { kind: 'name', value: 'Name' },
      {
        kind: 'definition',
        value: 'A string of symbols that uniquely identifies a concept or a reflection.',
      },
      { kind: 'required', value: 'true' },
      { kind: 'attributes', value: ['cdd.name', 'cdd.definition', 'cdd.slug'] },
    ],
    'cdd.definition': [
      { kind: 'identity', value: 'cdd.definition' },
      { kind: 'concept', value: 'cdd.concept' },
      { kind: 'slug', value: 'definition' },
      { kind: 'name', value: 'Definition' },
      { kind: 'definition', value: 'The text that says what a concept is.' },
      { kind: 'attributes', value: ['cdd.name', 'cdd.definition', 'cdd.slug'] },
    ],
    'cdd.slug': [
      { kind: 'identity', value: 'cdd.slug' },
      { kind: 'concept', value: 'cdd.concept' },
      { kind: 'slug', value: 'slug' },
      { kind: 'name', value: 'Slug' },
      {
        kind: 'definition',
        value:
          'A [a-zA-Z0-9_-] word that uniquely identifies an [instance](.instance) within the ontology; the metaentity chain of slugs joined by "." builds an identity.',
      },
      { kind: 'required', value: 'true' },
      { kind: 'attributes', value: ['cdd.name', 'cdd.definition', 'cdd.slug'] },
    ],
  },
}
