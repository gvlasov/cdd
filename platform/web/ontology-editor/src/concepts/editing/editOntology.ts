import type { Identity } from '@/concepts/identity/Identity'
import type { Slug } from '@/concepts/identity/Slug'
import { isSlug } from '@/concepts/identity/Slug'
import type { Instance } from '@/concepts/instances/Instance'
import type { Property, PropertyKindName } from '@/concepts/properties/Property'
import type { Ontology } from '@/concepts/ontology/Ontology'
import { derivedIdentity } from '@/concepts/ontology/Ontology'

// Pure, immutable edits to an ontology. Each returns a new Ontology; callers
// emit it via update:modelValue.

function cloneInstances(ontology: Ontology): Record<Identity, Instance> {
  const out: Record<Identity, Instance> = {}
  for (const [id, instance] of Object.entries(ontology.instances)) {
    out[id] = instance.map((p) => ({ ...p }))
  }
  return out
}

/**
 * Set the value of one existing property of an instance. Identity is not
 * editable; slug goes through `renameSlug` so the instance is re-keyed.
 */
export function setPropertyValue(
  ontology: Ontology,
  instanceId: Identity,
  kind: PropertyKindName,
  value: Identity | Identity[],
): Ontology {
  if (kind === 'identity') return ontology
  if (kind === 'slug' && typeof value === 'string') return renameSlug(ontology, instanceId, value)

  const instances = cloneInstances(ontology)
  const instance = instances[instanceId]
  if (!instance) return ontology

  const i = instance.findIndex((p) => p.kind === kind)
  if (i === -1) return ontology
  instance[i] = { kind, value }
  return { ...ontology, instances }
}

/** Rename an instance's slug: recompute its identity, move it, rewrite refs. */
export function renameSlug(
  ontology: Ontology,
  instanceId: Identity,
  newSlug: Slug,
): Ontology {
  if (!isSlug(newSlug)) return ontology
  const instances = cloneInstances(ontology)
  const instance = instances[instanceId]
  if (!instance) return ontology

  const i = instance.findIndex((p) => p.kind === 'slug')
  if (i === -1) return ontology
  instance[i] = { kind: 'slug', value: newSlug }

  return rekeyForSlug({ root: ontology.root, instances }, instanceId)
}

const REF_KINDS: PropertyKindName[] = ['attributes', 'concept', 'concepts']

function rekeyForSlug(ontology: Ontology, oldId: Identity): Ontology {
  const newId = derivedIdentity(ontology, oldId)
  if (!newId || newId === oldId || ontology.instances[newId]) {
    // No derivable identity, unchanged, or collision — keep the entry in place
    // but with its updated slug/identity property already set.
    const instances = { ...ontology.instances }
    const inst = instances[oldId]?.map((p) => (p.kind === 'identity' ? { ...p, value: oldId } : p))
    if (inst) instances[oldId] = inst
    return { ...ontology, instances }
  }

  const instances: Record<Identity, Instance> = {}
  for (const [id, instance] of Object.entries(ontology.instances)) {
    const key = id === oldId ? newId : id
    instances[key] = instance.map((p) => {
      if (id === oldId && p.kind === 'identity') return { kind: 'identity', value: newId }
      if (REF_KINDS.includes(p.kind)) {
        if (Array.isArray(p.value)) {
          return { ...p, value: p.value.map((v) => (v === oldId ? newId : v)) }
        }
        return { ...p, value: p.value === oldId ? newId : p.value }
      }
      return p
    })
  }

  return {
    root: ontology.root === oldId ? newId : ontology.root,
    instances,
  }
}

/**
 * The identity `instanceId` will have after its slug becomes `newSlug`, so a
 * caller can follow the re-key. Returns the current id when nothing moves.
 */
export function identityAfterSlug(
  ontology: Ontology,
  instanceId: Identity,
  newSlug: Slug,
): Identity {
  if (!isSlug(newSlug)) return instanceId
  const probe: Ontology = {
    root: ontology.root,
    instances: {
      ...ontology.instances,
      [instanceId]: (ontology.instances[instanceId] ?? []).map((p) =>
        p.kind === 'slug' ? { kind: 'slug', value: newSlug } : p,
      ),
    },
  }
  const derived = derivedIdentity(probe, instanceId)
  if (!derived || derived === instanceId || ontology.instances[derived]) return instanceId
  return derived
}

/** The remaining value after removing one entry from a list property. */
export function removeFromList(list: Identity[], value: Identity): Identity[] {
  return list.filter((v) => v !== value)
}

/** Add one entry to a list property if not already present. */
export function addToList(list: Identity[], value: Identity): Identity[] {
  return list.includes(value) ? list : [...list, value]
}

export type { Property }
