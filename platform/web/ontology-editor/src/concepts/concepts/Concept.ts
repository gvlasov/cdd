import type { Attribute } from '@/concepts/attributes/Attribute'
import type { Identity } from '@/concepts/identity/Identity'
import { firstOfKind, attributesOfKind } from '@/concepts/attributes/Attribute'

// A concept IS its collection of attributes. It has no fields of its own —
// name, definition, examples, and identity are all just attributes.
export type Concept = Attribute[]

export function conceptIdentity(concept: Concept): Identity | undefined {
  return firstOfKind(concept, 'identity')?.value
}

export function conceptName(concept: Concept): string | undefined {
  return firstOfKind(concept, 'name')?.value
}

/** A short human label for a concept: its name, else its identity. */
export function conceptLabelOf(concept: Concept): string | undefined {
  return conceptName(concept) ?? conceptIdentity(concept)
}

/** The concepts this concept consists of, by referenced identity. */
export function conceptRefs(concept: Concept): Identity[] {
  return attributesOfKind(concept, 'concept').map((a) => a.value)
}
