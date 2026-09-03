import type { Ontology } from './Ontology'
import type { Instance } from '@/concepts/instances/Instance'
import type { Identity } from '@/concepts/identity/Identity'
import type { Cardinality } from '@/concepts/attributes/Attribute'

// Every entry is an instance; its `concept` property names its type.
//
//  - Leaf concepts (`cdd.name`, `cdd.slug`, `cdd.definition`, `cdd.cardinality`)
//    declare no attributes — their values edit as plain fields.
//  - An attribute is an instance typed `cdd.attribute` with `slug` (the property
//    key), `type` (the value concept) and `cardinality` (0-1 | 1 | 0+ | 1+).
//    Each attribute belongs to exactly one concept — its identity is
//    `<ownerId>.<slug>`.
//  - A concept's `attributes` property lists its own attribute-instance ids.
//  - The `cdd` instance is an ontology — the root concept of itself.

const instances: Record<Identity, Instance> = {}

// Declare an attribute belonging to `ownerId`, returning its identity.
function attr(
  ownerId: Identity,
  slug: string,
  type: Identity,
  cardinality: Cardinality,
): Identity {
  const id = `${ownerId}.${slug}`
  instances[id] = [
    { kind: 'identity', value: id },
    { kind: 'concept', value: 'cdd.attribute' },
    { kind: 'slug', value: slug },
    { kind: 'name', value: slug },
    { kind: 'type', value: type },
    { kind: 'cardinality', value: cardinality },
  ]
  return id
}

// A concept with name/slug/definition attributes plus any extras.
function concept(
  id: Identity,
  slug: string,
  name: string,
  definition: string,
  extras: Identity[] = [],
) {
  instances[id] = [
    { kind: 'identity', value: id },
    { kind: 'concept', value: 'cdd.concept' },
    { kind: 'slug', value: slug },
    { kind: 'name', value: name },
    { kind: 'definition', value: definition },
    {
      kind: 'attributes',
      value: [
        attr(id, 'name', 'cdd.name', '1'),
        attr(id, 'slug', 'cdd.slug', '1'),
        attr(id, 'definition', 'cdd.definition', '0-1'),
        ...extras,
      ],
    },
  ]
}

// A leaf concept — no attributes.
function leaf(id: Identity, slug: string, name: string, definition: string) {
  instances[id] = [
    { kind: 'identity', value: id },
    { kind: 'concept', value: 'cdd.concept' },
    { kind: 'slug', value: slug },
    { kind: 'name', value: name },
    { kind: 'definition', value: definition },
  ]
}

leaf('cdd.name', 'name', 'Name', 'A string that identifies a concept or a reflection.')
leaf(
  'cdd.slug',
  'slug',
  'Slug',
  'A `[a-zA-Z0-9_-]` word, unique within the ontology. An [instance](.instance)’s identity is its metaentity chain of slugs joined by `.` — `<ontology>.<concept>.<instance>`.',
)
leaf('cdd.definition', 'definition', 'Definition', 'The text that says what a concept is.')
leaf(
  'cdd.cardinality',
  'cardinality',
  'Cardinality',
  'How many values an attribute holds: `0-1`, `1`, `0+` or `1+`.',
)

concept(
  'cdd.concept',
  'concept',
  'Concept',
  'A cohesion unit. A concept is a collection of [properties](.property); its [attributes](.attribute) declare what its instances may hold.',
  [attr('cdd.concept', 'attribute', 'cdd.attribute', '0+')],
)
concept(
  'cdd.instance',
  'instance',
  'Instance',
  'Anything the ontology holds: a collection of [properties](.property) addressed by a unique identity, typed by its `concept` property. A [concept](.concept) is an instance that also declares [attributes](.attribute).',
)
concept(
  'cdd.attribute',
  'attribute',
  'Attribute',
  'Belongs to a [concept](.concept). Defines one slot — name, `type` and `cardinality` — on that concept’s instances.',
  [
    attr('cdd.attribute', 'type', 'cdd.concept', '1'),
    attr('cdd.attribute', 'cardinality', 'cdd.cardinality', '1'),
  ],
)
concept(
  'cdd.property',
  'property',
  'Property',
  'Belongs to an [instance](.instance). A value the instance holds in a slot its [concept](.concept) defines via an [attribute](.attribute).',
)

// The ontology root.
instances['cdd'] = [
  { kind: 'identity', value: 'cdd' },
  { kind: 'concept', value: 'cdd.concept' },
  { kind: 'slug', value: 'cdd' },
  { kind: 'name', value: 'CDD' },
  { kind: 'definition', value: 'The ontology being viewed — the root concept of itself.' },
  {
    kind: 'attributes',
    value: [
      attr('cdd', 'name', 'cdd.name', '1'),
      attr('cdd', 'slug', 'cdd.slug', '1'),
      attr('cdd', 'definition', 'cdd.definition', '0-1'),
    ],
  },
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
]

export const sampleOntology: Ontology = { root: 'cdd', instances }
