import type { Identity } from '@/concepts/identity/Identity'
import type { Slug } from '@/concepts/identity/Slug'
import { identityFromSlugChain } from '@/concepts/identity/Slug'
import type { Concept } from '@/concepts/concepts/Concept'
import { conceptRefs, conceptSlug } from '@/concepts/concepts/Concept'
import { IdentityRepository } from '@/concepts/identity/IdentityRepository'

// An ontology is a flat, rhizomatic collection of concepts keyed by identity —
// not a tree. Concepts reference each other by identity via `concept`
// attributes.
//
// The ontology is the root concept of itself: `root` names its own entry in
// `concepts`, and every other concept's metaentity chain ends there.
export interface Ontology {
  concepts: Record<Identity, Concept>
  root: Identity
}

export const emptyOntology = (root: Identity = 'ontology'): Ontology => ({
  concepts: {},
  root,
})

export function identityRepository(ontology: Ontology): IdentityRepository {
  return new IdentityRepository(ontology.concepts)
}

export function conceptOf(ontology: Ontology, identity: Identity): Concept | undefined {
  return ontology.concepts[identity]
}

export function rootConcept(ontology: Ontology): Concept | undefined {
  return ontology.concepts[ontology.root]
}

/** Identities of concepts that reference `identity` through a `concept` attribute. */
export function parentIdentities(ontology: Ontology, identity: Identity): Identity[] {
  const parents: Identity[] = []
  for (const [ownerId, concept] of Object.entries(ontology.concepts)) {
    if (conceptRefs(concept).includes(identity)) parents.push(ownerId)
  }
  return parents
}

/**
 * The identity an entry must have, derived from its metaentity chain of slugs
 * (root first). Returns undefined when the chain is not fully slugged, in which
 * case the entry's identity is whatever key it is stored under.
 *
 * Chain today: a concept's metaentity is the ontology root, so the chain is
 * `[rootSlug, conceptSlug]`; the root's own chain is `[rootSlug]`.
 */
export function derivedIdentity(
  ontology: Ontology,
  identity: Identity,
): Identity | undefined {
  const root = rootConcept(ontology)
  const rootSlug = root ? conceptSlug(root) : undefined
  if (!rootSlug) return undefined

  if (identity === ontology.root) return identityFromSlugChain([rootSlug])

  const concept = conceptOf(ontology, identity)
  const slug = concept ? conceptSlug(concept) : undefined
  if (!slug) return undefined

  const chain: Slug[] = [rootSlug, slug]
  return identityFromSlugChain(chain)
}

/** Entries whose stored key disagrees with the identity their slug chain implies. */
export function slugIdentityMismatches(
  ontology: Ontology,
): Array<{ key: Identity; derived: Identity }> {
  const out: Array<{ key: Identity; derived: Identity }> = []
  for (const key of Object.keys(ontology.concepts)) {
    const derived = derivedIdentity(ontology, key)
    if (derived && derived !== key) out.push({ key, derived })
  }
  return out
}
