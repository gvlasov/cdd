import type { Identity } from '@/concepts/identity/Identity'
import { firstOfKind, propertiesOfKind } from '@/concepts/properties/Property'
import type { Instance } from '@/concepts/instances/Instance'
import { instanceName, instanceSlug, instanceIdentity } from '@/concepts/instances/Instance'

// A concept is an instance that also declares, via its `attributes` property,
// what properties its own instances may have.
export type Concept = Instance

/** Whether an instance is a concept — i.e. it declares `attributes`. */
export function isConcept(instance: Instance): boolean {
  return firstOfKind(instance, 'attributes') !== undefined
}

export const conceptIdentity = instanceIdentity
export const conceptName = instanceName
export const conceptSlug = instanceSlug

/** A short human label for a concept: its name, else its identity. */
export function conceptLabelOf(concept: Concept): string | undefined {
  return conceptName(concept) ?? conceptIdentity(concept)
}

/**
 * The concepts this one relates to, by referenced identity: its `attributes`
 * list plus — for an ontology — its `concepts` list. (`concept` is the
 * instance's type, shown separately.)
 */
export function conceptRefs(concept: Concept): Identity[] {
  return [
    ...propertiesOfKind(concept, 'attributes'),
    ...propertiesOfKind(concept, 'concepts'),
  ]
    .map((p) => (Array.isArray(p.value) ? p.value : [p.value]))
    .flat()
}

/**
 * The attribute concepts this concept declares for its instances — the
 * identities in its `attributes` property.
 */
export function conceptAttributes(concept: Concept): Identity[] {
  const property = firstOfKind(concept, 'attributes')
  if (!property) return []
  return Array.isArray(property.value) ? property.value : [property.value]
}

/** Whether an attribute concept marks itself required (has a truthy `required`). */
export function attributeRequired(attribute: Concept): boolean {
  const p = firstOfKind(attribute, 'required')
  if (!p) return false
  const v = Array.isArray(p.value) ? p.value[0] : p.value
  return v === 'true' || v === '1' || v === 'yes'
}
