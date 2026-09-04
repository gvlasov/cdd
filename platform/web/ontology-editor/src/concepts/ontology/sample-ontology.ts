import type { Ontology } from './Ontology'
import type { Instance } from '@/concepts/instances/Instance'
import type { Identity } from '@/concepts/identity/Identity'
import type { Cardinality } from '@/concepts/attributes/Attribute'

// Fallback ontology for the demo app, used only if concepts/editor (this
// repo's real, CDD-authored ontology — see loadOntology.ts) is empty. Also
// doubles as a worked example of the model for anyone reading this file.
//
// Every entry is an instance; its `concept` property names its type.
//
//  - Leaf concepts (`cdd.name`, `cdd.slug`, `cdd.definition`) declare no
//    attributes — their values edit as plain fields.
//  - An attribute is an instance typed `cdd.attribute` with `slug` (the property
//    key), `type` (the value concept) and `cardinality` (0-1 | 1 | 0+ | 1+).
//    Each attribute belongs to exactly one concept — its identity is
//    `<ownerId>.<slug>`. `cardinality` is not itself a concept — it's a
//    built-in attribute of `cdd.attribute`, recognized by the literal type id
//    `cdd.cardinality`, and edits as a 0-1/1/0+/1+ toggle.
//  - A concept's `attributes` property lists its own attribute-instance ids.
//  - `definition` is declared on Concept (only concepts have one); `name` is
//    declared on Instance (any instance may have one). There's no attribute
//    inheritance yet, so this only governs each concept's own edit form — the
//    `name`/`definition` properties still render wherever they're set.
//  - The `cdd` instance is the ontology root — an instance of the leaf concept
//    Ontology, not a concept itself.

const instances: Record<Identity, Instance> = {}

// Declare an attribute belonging to `ownerId`, returning its identity.
// Attributes are keyed `<ownerId>:<slug>` — a `:` so they never collide with a
// concept id (which is a dotted slug chain).
function attr(
  ownerId: Identity,
  slug: string,
  type: Identity,
  cardinality: Cardinality,
): Identity {
  const id = `${ownerId}:${slug}`
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

// A concept: an instance of `cdd.concept`. It gets its own name/slug/definition
// properties (from cdd.concept's attributes). `attrs` are the attributes IT
// declares for ITS instances — most concepts declare none.
function concept(
  id: Identity,
  slug: string,
  name: string,
  definition: string,
  attrs: Identity[] = [],
) {
  instances[id] = [
    { kind: 'identity', value: id },
    { kind: 'concept', value: 'cdd.concept' },
    { kind: 'slug', value: slug },
    { kind: 'name', value: name },
    { kind: 'definition', value: definition },
    ...(attrs.length ? [{ kind: 'attributes' as const, value: attrs }] : []),
  ]
}

const leaf = concept // a concept that declares no attributes for its instances

leaf('cdd.name', 'name', 'Name', 'A string that identifies a concept or a reflection.')
leaf(
  'cdd.slug',
  'slug',
  'Slug',
  'A `[a-zA-Z0-9_-]` word, unique within the ontology. An [instance](.instance)’s identity is its metaentity chain of slugs joined by `.` — `<ontology>.<concept>.<instance>`.',
)
leaf('cdd.definition', 'definition', 'Definition', 'The text that says what a concept is.')

leaf(
  'cdd.transaction',
  'transaction',
  'Transaction',
  'A write operation on a [concept](.concept) — how its instances come to be and change. Identified `<conceptId>:<name>`.',
)
leaf(
  'cdd.ontology',
  'ontology',
  'Ontology',
  'A flat, rhizomatic collection of [concepts](.concept).',
)

// `definition` is an attribute of Concept — only concepts get one. `slug` is
// declared here too (identity derivation is concept-specific); `name` is
// declared on Instance instead, since any instance may have one.
concept(
  'cdd.concept',
  'concept',
  'Concept',
  'A cohesion unit. A concept is a collection of [properties](.property); its [attributes](.attribute) declare what its instances may hold.',
  [
    attr('cdd.concept', 'slug', 'cdd.slug', '1'),
    attr('cdd.concept', 'definition', 'cdd.definition', '0-1'),
    attr('cdd.concept', 'attributes', 'cdd.attribute', '0+'),
    attr('cdd.concept', 'transactions', 'cdd.transaction', '0+'),
  ],
)
// A constructor transaction on cdd.concept: spawns a concept instance.
instances['cdd.concept'].push({ kind: 'transactions', value: ['cdd.concept:create'] })
instances['cdd.concept:create'] = [
  { kind: 'identity', value: 'cdd.concept:create' },
  { kind: 'concept', value: 'cdd.transaction' },
  { kind: 'name', value: 'create' },
  { kind: 'definition', value: 'Constructor: spawn a new concept instance into the reality.' },
  { kind: 'params', value: ['name', 'definition'] },
  {
    kind: 'effect',
    value:
      "return reality.add('cdd.concept', { name: input.name, definition: input.definition })",
  },
]
// `name` is an attribute of Instance — any instance may have one, concepts
// included (concepts are instances too, just typed cdd.concept).
concept(
  'cdd.instance',
  'instance',
  'Instance',
  'Anything the ontology holds: a collection of [properties](.property) addressed by a unique identity, typed by its `concept` property. A [concept](.concept) is an instance that also declares [attributes](.attribute).',
  [attr('cdd.instance', 'name', 'cdd.name', '1')],
)
concept(
  'cdd.attribute',
  'attribute',
  'Attribute',
  'Belongs to a [concept](.concept). Defines one slot — name, `type` and `cardinality` — on that concept’s instances.',
  [
    attr('cdd.attribute', 'name', 'cdd.name', '1'),
    attr('cdd.attribute', 'slug', 'cdd.slug', '1'),
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

// The ontology root — an instance of the leaf concept Ontology, not a concept
// itself: CDD is an ontology, not a concept.
instances['cdd'] = [
  { kind: 'identity', value: 'cdd' },
  { kind: 'concept', value: 'cdd.ontology' },
  { kind: 'slug', value: 'cdd' },
  { kind: 'name', value: 'CDD' },
  { kind: 'definition', value: 'The ontology being viewed.' },
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
      'cdd.transaction',
    ],
  },
]

export const sampleOntology: Ontology = { root: 'cdd', instances }
