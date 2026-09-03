import type { Property, PropertyKindName } from '@/concepts/properties/Property'
import type { Identity } from '@/concepts/identity/Identity'
import { firstOfKind, propertiesOfKind } from '@/concepts/properties/Property'

// A concept IS its collection of properties. It has no fields of its own —
// name, definition, examples, identity, slug are all just properties. Its
// `attributes` property declares what properties its own instances may have.
export type Concept = Property[]

function literal(property: Property | undefined): string | undefined {
  if (!property) return undefined
  return Array.isArray(property.value) ? property.value[0] : property.value
}

export function conceptIdentity(concept: Concept): Identity | undefined {
  return literal(firstOfKind(concept, 'identity'))
}

export function conceptName(concept: Concept): string | undefined {
  return literal(firstOfKind(concept, 'name'))
}

export function conceptSlug(concept: Concept): Identity | undefined {
  return literal(firstOfKind(concept, 'slug'))
}

/** A short human label for a concept: its name, else its identity. */
export function conceptLabelOf(concept: Concept): string | undefined {
  return conceptName(concept) ?? conceptIdentity(concept)
}

/** The concepts this concept consists of, by referenced identity. */
export function conceptRefs(concept: Concept): Identity[] {
  return propertiesOfKind(concept, 'concept')
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
