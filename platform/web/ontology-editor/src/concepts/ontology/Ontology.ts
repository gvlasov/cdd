import type { Identity } from '@/concepts/identity/Identity'
import type { Concept } from '@/concepts/concepts/Concept'
import { conceptRefs } from '@/concepts/concepts/Concept'
import { IdentityRepository } from '@/concepts/identity/IdentityRepository'

// An ontology is a flat, rhizomatic collection of concepts keyed by identity —
// not a tree. Concepts reference each other by identity via `concept`
// attributes.
export interface Ontology {
  concepts: Record<Identity, Concept>
}

export const emptyOntology = (): Ontology => ({ concepts: {} })

export function identityRepository(ontology: Ontology): IdentityRepository {
  return new IdentityRepository(ontology.concepts)
}

export function conceptOf(ontology: Ontology, identity: Identity): Concept | undefined {
  return ontology.concepts[identity]
}

/** Identities of concepts that reference `identity` through a `concept` attribute. */
export function parentIdentities(ontology: Ontology, identity: Identity): Identity[] {
  const parents: Identity[] = []
  for (const [ownerId, concept] of Object.entries(ontology.concepts)) {
    if (conceptRefs(concept).includes(identity)) parents.push(ownerId)
  }
  return parents
}
