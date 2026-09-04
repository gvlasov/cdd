import type { Identity } from '@/concepts/identity/Identity'
import type { Slug } from '@/concepts/identity/Slug'
import { identityFromSlugChain } from '@/concepts/identity/Slug'
import type { Instance } from '@/concepts/instances/Instance'
import type { Concept } from '@/concepts/concepts/Concept'
import { conceptRefs, conceptSlug } from '@/concepts/concepts/Concept'
import { firstOfKind } from '@/concepts/properties/Property'
import { IdentityRepository } from '@/concepts/identity/IdentityRepository'

// An ontology has a root instance — not itself a concept, just an instance of
// whatever concept models an ontology (e.g. an `Ontology` concept). Its
// `concepts` property is the list of concept identities the ontology contains.
// `instances` is the flat store that makes every instance addressable by
// identity for O(1) lookup.
export interface Ontology {
  root: Identity
  instances: Record<Identity, Instance>
}

export const emptyOntology = (root: Identity = 'ontology'): Ontology => ({
  root,
  instances: {},
})

export function identityRepository(ontology: Ontology): IdentityRepository {
  return new IdentityRepository(ontology.instances)
}

export function conceptOf(ontology: Ontology, identity: Identity): Instance | undefined {
  return ontology.instances[identity]
}

/** The ontology's root instance — not necessarily a concept itself. */
export function rootConcept(ontology: Ontology): Instance | undefined {
  return ontology.instances[ontology.root]
}

/** The concept identities the ontology contains — the root's `concepts` property. */
export function ontologyConcepts(ontology: Ontology): Identity[] {
  const root = rootConcept(ontology)
  const property = root ? firstOfKind(root, 'concepts') : undefined
  if (!property) return []
  return Array.isArray(property.value) ? property.value : [property.value]
}

/** Identities of concepts that reference `identity` through a `concept` property. */
export function parentIdentities(ontology: Ontology, identity: Identity): Identity[] {
  const parents: Identity[] = []
  for (const [ownerId, concept] of Object.entries(ontology.instances)) {
    if (conceptRefs(concept as Concept).includes(identity)) parents.push(ownerId)
  }
  return parents
}

/**
 * The identity an entry must have, derived from its metaentity chain of slugs
 * (root first). Returns undefined when the chain is not fully slugged, in which
 * case the entry's identity is whatever key it is stored under.
 *
 * Chain today: a top-level concept's metaentity is the ontology root, so the
 * chain is `[rootSlug, conceptSlug]`; the root's own chain is `[rootSlug]`
 * regardless of what concept the root is an instance of.
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
  if (!concept) return undefined
  // Only top-level concepts (typed cdd.concept) are keyed by the rootSlug.slug
  // chain. Attributes, transactions and value instances keep their stored keys.
  const type = concept.find((p) => p.kind === 'concept')?.value
  if (type !== 'cdd.concept') return undefined
  const slug = conceptSlug(concept)
  if (!slug) return undefined

  const chain: Slug[] = [rootSlug, slug]
  return identityFromSlugChain(chain)
}

/** Entries whose stored key disagrees with the identity their slug chain implies. */
export function slugIdentityMismatches(
  ontology: Ontology,
): Array<{ key: Identity; derived: Identity }> {
  const out: Array<{ key: Identity; derived: Identity }> = []
  for (const key of Object.keys(ontology.instances)) {
    const derived = derivedIdentity(ontology, key)
    if (derived && derived !== key) out.push({ key, derived })
  }
  return out
}
