import type { Identity } from '@/concepts/identity/Identity'
import type { Instance } from '@/concepts/instances/Instance'
import type { Ontology } from '@/concepts/ontology/Ontology'
import { conceptOf, rootConcept } from '@/concepts/ontology/Ontology'
import { conceptSlug } from '@/concepts/concepts/Concept'
import { identityFromSlugChain, isSlug } from '@/concepts/identity/Slug'
import type { Cardinality } from './Attribute'

function cloneInstances(ontology: Ontology): Record<Identity, Instance> {
  const out: Record<Identity, Instance> = {}
  for (const [id, instance] of Object.entries(ontology.instances)) {
    out[id] = instance.map((p) => ({ ...p }))
  }
  return out
}

export interface NewAttribute {
  name: string
  slug: string
  type: Identity
  cardinality: Cardinality
}

/** Identity a new attribute of `owner` with `slug` would get. */
export function newAttributeIdentity(
  ontology: Ontology,
  ownerId: Identity,
  slug: string,
): Identity {
  if (!isSlug(slug)) return ''
  const owner = conceptOf(ontology, ownerId)
  const ownerSlug = owner ? conceptSlug(owner) : undefined
  const root = rootConcept(ontology)
  const rootSlug = root ? conceptSlug(root) : undefined
  const chain = [rootSlug, ownerSlug, slug].filter((s): s is string => !!s)
  const id = chain.length ? identityFromSlugChain(chain) : slug
  return id in ontology.instances ? '' : id
}

/**
 * Create an attribute instance (typed `cdd.attribute`) and append it to the
 * owner concept's `attributes` list.
 */
export function createAttribute(
  ontology: Ontology,
  ownerId: Identity,
  spec: NewAttribute,
): Ontology {
  const id = newAttributeIdentity(ontology, ownerId, spec.slug)
  if (!id) return ontology

  const instances = cloneInstances(ontology)
  instances[id] = [
    { kind: 'identity', value: id },
    { kind: 'concept', value: 'cdd.attribute' },
    { kind: 'slug', value: spec.slug },
    { kind: 'name', value: spec.name || spec.slug },
    { kind: 'type', value: spec.type },
    { kind: 'cardinality', value: spec.cardinality },
  ]

  const owner = instances[ownerId]
  if (owner) {
    const i = owner.findIndex((p) => p.kind === 'attributes')
    const current = i !== -1 && Array.isArray(owner[i].value) ? (owner[i].value as Identity[]) : []
    const value = [...current, id]
    if (i !== -1) owner[i] = { kind: 'attributes', value }
    else owner.push({ kind: 'attributes', value })
  }

  return { ...ontology, instances }
}
