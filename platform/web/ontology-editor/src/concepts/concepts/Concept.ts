import type { Identity } from '@/concepts/identity/Identity'
import { firstOfKind, propertiesOfKind } from '@/concepts/properties/Property'
import type { Instance } from '@/concepts/instances/Instance'
import {
  instanceName,
  instanceSlug,
  instanceIdentity,
  instanceType,
} from '@/concepts/instances/Instance'

// A concept is an instance typed `cdd.concept`. It may declare, via its
// `attributes` property, what properties its own instances hold.
export type Concept = Instance

/** Whether an instance is a concept — its type is `cdd.concept` (or it is that). */
export function isConcept(instance: Instance): boolean {
  const t = instanceType(instance)
  return t === 'cdd.concept' || instanceIdentity(instance) === 'cdd.concept'
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
 * list. (`concept` is the instance's type; `transactions` and `concepts` are
 * drawn inside the instance card — all shown separately, not here.)
 */
export function conceptRefs(concept: Concept): Identity[] {
  return propertiesOfKind(concept, 'attributes')
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
