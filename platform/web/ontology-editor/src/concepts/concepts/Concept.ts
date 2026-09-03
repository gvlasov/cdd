import type { Property, PropertyKindName } from '@/concepts/properties/Property'
import type { Identity } from '@/concepts/identity/Identity'
import { firstOfKind, propertiesOfKind } from '@/concepts/properties/Property'
import type { Instance } from '@/concepts/instances/Instance'
import { instanceName, instanceSlug, instanceIdentity } from '@/concepts/instances/Instance'

// A concept is an instance that also declares, via its `attributes` property,
// what properties its own instances may have.
export type Concept = Instance

export const conceptIdentity = instanceIdentity
export const conceptName = instanceName
export const conceptSlug = instanceSlug

/** A short human label for a concept: its name, else its identity. */
export function conceptLabelOf(concept: Concept): string | undefined {
  return conceptName(concept) ?? conceptIdentity(concept)
}

/**
 * The concepts this concept relates to, by referenced identity: its `concept`
 * properties, plus — for an ontology — its `concepts` list.
 */
export function conceptRefs(concept: Concept): Identity[] {
  return [
    ...propertiesOfKind(concept, 'concept'),
    ...propertiesOfKind(concept, 'concepts'),
  ]
    .map((p) => (Array.isArray(p.value) ? p.value : [p.value]))
    .flat()
}

/** The property kinds an instance of this concept may have. */
export function conceptAttributes(concept: Concept): PropertyKindName[] {
  const property = firstOfKind(concept, 'attributes')
  if (!property) return []
  const values = Array.isArray(property.value) ? property.value : [property.value]
  return values as PropertyKindName[]
}
