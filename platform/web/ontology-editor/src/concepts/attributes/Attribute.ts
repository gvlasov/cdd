import type { Identity } from '@/concepts/identity/Identity'
import type { Instance } from '@/concepts/instances/Instance'
import type { Ontology } from '@/concepts/ontology/Ontology'
import { conceptOf } from '@/concepts/ontology/Ontology'
import { firstOfKind } from '@/concepts/properties/Property'
import { instanceName, instanceSlug } from '@/concepts/instances/Instance'
import { conceptAttributes } from '@/concepts/concepts/Concept'

// An attribute is an instance typed `cdd.attribute`. It defines one slot on
// instances of the concept that owns it:
//  - `name`        human label
//  - `slug`        the property key on the owning concept's instances
//  - `type`        the concept an attribute value is an instance of
//  - `cardinality` how many values: '0-1' | '1' | '0+' | '1+'
export type Cardinality = '0-1' | '1' | '0+' | '1+'

export const CARDINALITIES: Cardinality[] = ['0-1', '1', '0+', '1+']

export interface AttributeSpec {
  /** The attribute instance's identity. */
  attribute: Identity
  name: string
  /** The property key on owning-concept instances. */
  slug: string
  /** Concept identity the value is an instance of. */
  type: Identity | undefined
  cardinality: Cardinality
  /** Whether this attribute's value is derived, not stored — see `computeAttributeValue`. */
  computed: boolean
  /** JS source deriving the value, when `computed` is true. */
  function: string | undefined
}

export function attributeCardinality(attribute: Instance): Cardinality {
  const p = firstOfKind(attribute, 'cardinality')
  const v = p ? (Array.isArray(p.value) ? p.value[0] : p.value) : undefined
  return (CARDINALITIES as string[]).includes(v ?? '') ? (v as Cardinality) : '0-1'
}

export function attributeType(attribute: Instance): Identity | undefined {
  const p = firstOfKind(attribute, 'type')
  if (!p) return undefined
  return Array.isArray(p.value) ? p.value[0] : p.value
}

export function isRequired(cardinality: Cardinality): boolean {
  return cardinality === '1' || cardinality === '1+'
}

export function isList(cardinality: Cardinality): boolean {
  return cardinality === '0+' || cardinality === '1+'
}

function literal(property: { value: Identity | Identity[] } | undefined): string | undefined {
  if (!property) return undefined
  return Array.isArray(property.value) ? property.value[0] : property.value
}

export function attributeComputed(attribute: Instance): boolean {
  return literal(firstOfKind(attribute, 'computed')) === 'true'
}

export function attributeFunction(attribute: Instance): string | undefined {
  const p = firstOfKind(attribute, 'function')
  if (!p) return undefined
  return Array.isArray(p.value) ? p.value.join('\n') : p.value
}

/**
 * Derive a computed attribute's value for `instance`. `fn` is a JS function
 * body with `instance` (the owner) and `ontology` in scope, mirroring
 * `runEffect`'s transaction-effect evaluation but read-only.
 */
export function computeAttributeValue(
  fn: string,
  instance: Instance,
  ontology: Ontology,
): string {
  // eslint-disable-next-line @typescript-eslint/no-implied-eval
  const compute = new Function('instance', 'ontology', fn) as (
    instance: Instance,
    ontology: Ontology,
  ) => unknown
  return String(compute(instance, ontology) ?? '')
}

/** Resolve one attribute instance to a spec. */
export function attributeSpec(
  ontology: Ontology,
  attributeId: Identity,
): AttributeSpec | undefined {
  const attribute = conceptOf(ontology, attributeId)
  if (!attribute) return undefined
  return {
    attribute: attributeId,
    name: instanceName(attribute) ?? attributeId,
    slug: instanceSlug(attribute) ?? attributeId,
    type: attributeType(attribute),
    cardinality: attributeCardinality(attribute),
    computed: attributeComputed(attribute),
    function: attributeFunction(attribute),
  }
}

/** The attribute specs a concept declares, in order. */
export function conceptAttributeSpecs(
  ontology: Ontology,
  concept: Instance,
): AttributeSpec[] {
  return conceptAttributes(concept)
    .map((id) => attributeSpec(ontology, id))
    .filter((s): s is AttributeSpec => s !== undefined)
}

/** A concept with no attributes of its own is a leaf — its value edits as a plain input. */
export function isLeafConcept(ontology: Ontology, conceptId: Identity | undefined): boolean {
  if (!conceptId) return true
  const concept = conceptOf(ontology, conceptId)
  if (!concept) return true
  return conceptAttributes(concept).length === 0
}

/**
 * Identities of concepts that reference `identity` as the `type` of one of
 * their declared attributes — e.g. Concept is a parent of Attribute, because
 * Concept's `attributes` attribute is typed Attribute. This is a separate
 * relation from `parentIdentities` (which only follows a concept's own
 * `attributes`/`concepts` properties): it looks one level deeper, through each
 * declared attribute's `type`, to find what concept it makes instances of.
 */
export function attributeTypeParents(ontology: Ontology, identity: Identity): Identity[] {
  const parents: Identity[] = []
  for (const [ownerId, instance] of Object.entries(ontology.instances)) {
    const specs = conceptAttributeSpecs(ontology, instance)
    if (specs.some((spec) => spec.type === identity)) parents.push(ownerId)
  }
  return parents
}
