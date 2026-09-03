import type { Ontology } from './Ontology'

// Every entry is an instance; its `concept` property names its type.
//
//  - Leaf concepts (`cdd.name`, `cdd.slug`, `cdd.definition`) declare no
//    attributes — their values edit as plain fields.
//  - An attribute is an instance typed `cdd.attribute` with `slug` (the property
//    key), `type` (the value concept) and `cardinality` (0-1 | 1 | 0+ | 1+).
//  - A concept's `attributes` property lists attribute-instance identities.
//  - The `cdd` instance is an ontology — the root concept of itself.
export const sampleOntology: Ontology = {
  root: 'cdd',
  instances: {
    cdd: [
      { kind: 'identity', value: 'cdd' },
      { kind: 'concept', value: 'cdd.concept' },
      { kind: 'slug', value: 'cdd' },
      { kind: 'name', value: 'CDD' },
      { kind: 'definition', value: 'The ontology being viewed — the root concept of itself.' },
      { kind: 'attributes', value: ['cdd.concept.name', 'cdd.concept.slug', 'cdd.concept.definition'] },
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
          'cdd.cardinality',
        ],
      },
    ],

    // ---- the Concept concept and its attributes ----
    'cdd.concept': [
      { kind: 'identity', value: 'cdd.concept' },
      { kind: 'concept', value: 'cdd.concept' },
      { kind: 'slug', value: 'concept' },
      { kind: 'name', value: 'Concept' },
      {
        kind: 'definition',
        value:
          'A cohesion unit. A concept is a collection of [properties](.property); its [attributes](.attribute) declare what its instances may hold.',
      },
      {
        kind: 'attributes',
        value: [
          'cdd.concept.name',
          'cdd.concept.slug',
          'cdd.concept.definition',
          'cdd.concept.attribute',
        ],
      },
    ],
    'cdd.concept.name': [
      { kind: 'identity', value: 'cdd.concept.name' },
      { kind: 'concept', value: 'cdd.attribute' },
      { kind: 'slug', value: 'name' },
      { kind: 'name', value: 'name' },
      { kind: 'type', value: 'cdd.name' },
      { kind: 'cardinality', value: '1' },
    ],
    'cdd.concept.slug': [
      { kind: 'identity', value: 'cdd.concept.slug' },
      { kind: 'concept', value: 'cdd.attribute' },
      { kind: 'slug', value: 'slug' },
      { kind: 'name', value: 'slug' },
      { kind: 'type', value: 'cdd.slug' },
      { kind: 'cardinality', value: '1' },
    ],
    'cdd.concept.definition': [
      { kind: 'identity', value: 'cdd.concept.definition' },
      { kind: 'concept', value: 'cdd.attribute' },
      { kind: 'slug', value: 'definition' },
      { kind: 'name', value: 'definition' },
      { kind: 'type', value: 'cdd.definition' },
      { kind: 'cardinality', value: '0-1' },
    ],
    'cdd.concept.attribute': [
      { kind: 'identity', value: 'cdd.concept.attribute' },
      { kind: 'concept', value: 'cdd.attribute' },
      { kind: 'slug', value: 'attribute' },
      { kind: 'name', value: 'attribute' },
      { kind: 'type', value: 'cdd.attribute' },
      { kind: 'cardinality', value: '0+' },
    ],

    // ---- leaf concepts used as attribute types ----
    'cdd.name': [
      { kind: 'identity', value: 'cdd.name' },
      { kind: 'concept', value: 'cdd.concept' },
      { kind: 'slug', value: 'name' },
      { kind: 'name', value: 'Name' },
      { kind: 'definition', value: 'A string that identifies a concept or a reflection.' },
    ],
    'cdd.slug': [
      { kind: 'identity', value: 'cdd.slug' },
      { kind: 'concept', value: 'cdd.concept' },
      { kind: 'slug', value: 'slug' },
      { kind: 'name', value: 'Slug' },
      {
        kind: 'definition',
        value:
          'A [a-zA-Z0-9_-] word unique within the ontology; the metaentity chain of slugs joined by "." builds an identity.',
      },
    ],
    'cdd.definition': [
      { kind: 'identity', value: 'cdd.definition' },
      { kind: 'concept', value: 'cdd.concept' },
      { kind: 'slug', value: 'definition' },
      { kind: 'name', value: 'Definition' },
      { kind: 'definition', value: 'The text that says what a concept is.' },
    ],

    // ---- other concepts ----
    'cdd.instance': [
      { kind: 'identity', value: 'cdd.instance' },
      { kind: 'concept', value: 'cdd.concept' },
      { kind: 'slug', value: 'instance' },
      { kind: 'name', value: 'Instance' },
      {
        kind: 'definition',
        value:
          'Anything the ontology holds: a collection of [properties](.property) addressed by a unique identity, typed by its `concept` property. A [concept](.concept) is an instance that also declares [attributes](.attribute).',
      },
      {
        kind: 'attributes',
        value: ['cdd.concept.name', 'cdd.concept.slug', 'cdd.concept.definition'],
      },
    ],
    'cdd.attribute': [
      { kind: 'identity', value: 'cdd.attribute' },
      { kind: 'concept', value: 'cdd.concept' },
      { kind: 'slug', value: 'attribute' },
      { kind: 'name', value: 'Attribute' },
      {
        kind: 'definition',
        value:
          'Belongs to a [concept](.concept). Defines one slot — name, type and cardinality — on that concept’s instances.',
      },
      {
        kind: 'attributes',
        value: [
          'cdd.attribute.name',
          'cdd.attribute.slug',
          'cdd.attribute.type',
          'cdd.attribute.cardinality',
        ],
      },
    ],
    'cdd.attribute.name': [
      { kind: 'identity', value: 'cdd.attribute.name' },
      { kind: 'concept', value: 'cdd.attribute' },
      { kind: 'slug', value: 'name' },
      { kind: 'name', value: 'name' },
      { kind: 'type', value: 'cdd.name' },
      { kind: 'cardinality', value: '1' },
    ],
    'cdd.attribute.slug': [
      { kind: 'identity', value: 'cdd.attribute.slug' },
      { kind: 'concept', value: 'cdd.attribute' },
      { kind: 'slug', value: 'slug' },
      { kind: 'name', value: 'slug' },
      { kind: 'type', value: 'cdd.slug' },
      { kind: 'cardinality', value: '1' },
    ],
    'cdd.attribute.type': [
      { kind: 'identity', value: 'cdd.attribute.type' },
      { kind: 'concept', value: 'cdd.attribute' },
      { kind: 'slug', value: 'type' },
      { kind: 'name', value: 'type' },
      { kind: 'type', value: 'cdd.concept' },
      { kind: 'cardinality', value: '1' },
    ],
    'cdd.attribute.cardinality': [
      { kind: 'identity', value: 'cdd.attribute.cardinality' },
      { kind: 'concept', value: 'cdd.attribute' },
      { kind: 'slug', value: 'cardinality' },
      { kind: 'name', value: 'cardinality' },
      { kind: 'type', value: 'cdd.cardinality' },
      { kind: 'cardinality', value: '1' },
    ],
    'cdd.cardinality': [
      { kind: 'identity', value: 'cdd.cardinality' },
      { kind: 'concept', value: 'cdd.concept' },
      { kind: 'slug', value: 'cardinality' },
      { kind: 'name', value: 'Cardinality' },
      { kind: 'definition', value: 'How many values an attribute holds: 0-1, 1, 0+ or 1+.' },
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
      {
        kind: 'attributes',
        value: ['cdd.concept.name', 'cdd.concept.slug', 'cdd.concept.definition'],
      },
    ],
  },
}
