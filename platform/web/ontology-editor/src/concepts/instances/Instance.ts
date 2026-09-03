import type { Property } from '@/concepts/properties/Property'
import { firstOfKind } from '@/concepts/properties/Property'

// An instance is anything the ontology holds: a collection of properties
// addressed by a unique identity. Every instance has a type — a concept —
// named by its `concept` property. A concept is itself an instance (typically
// typed `cdd.concept`) that also declares, via its `attributes` property, what
// properties its own instances may have.
export type Instance = Property[]

function literal(property: Property | undefined): string | undefined {
  if (!property) return undefined
  return Array.isArray(property.value) ? property.value[0] : property.value
}

export function instanceName(instance: Instance): string | undefined {
  return literal(firstOfKind(instance, 'name'))
}

export function instanceSlug(instance: Instance): string | undefined {
  return literal(firstOfKind(instance, 'slug'))
}

export function instanceIdentity(instance: Instance): string | undefined {
  return literal(firstOfKind(instance, 'identity'))
}

/** The identity of the instance's type concept, from its `concept` property. */
export function instanceType(instance: Instance): string | undefined {
  return literal(firstOfKind(instance, 'concept'))
}
