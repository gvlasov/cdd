import type { Identity } from '@/concepts/identity/Identity'
import type { Instance } from '@/concepts/instances/Instance'
import type { Ontology } from '@/concepts/ontology/Ontology'

function cloneInstances(ontology: Ontology): Record<Identity, Instance> {
  const out: Record<Identity, Instance> = {}
  for (const [id, instance] of Object.entries(ontology.instances)) {
    out[id] = instance.map((p) => ({ ...p }))
  }
  return out
}

let n = 0
function valueId(ownerId: Identity, slug: string): Identity {
  n += 1
  return `${ownerId}.${slug}#${n}`
}

/**
 * Create a blank value instance of `typeId` under an owner attribute slot, and
 * point the owner's `slug` property at it. For list cardinality the property
 * accumulates identities; for single it is replaced.
 */
export function spawnValue(
  ontology: Ontology,
  ownerId: Identity,
  slug: string,
  typeId: Identity,
  list: boolean,
): Ontology {
  const instances = cloneInstances(ontology)
  const owner = instances[ownerId]
  if (!owner) return ontology

  const id = valueId(ownerId, slug)
  instances[id] = [
    { kind: 'identity', value: id },
    { kind: 'concept', value: typeId },
  ]

  const i = owner.findIndex((p) => p.kind === (slug as Instance[number]['kind']))
  const kind = slug as Instance[number]['kind']
  if (list) {
    const current = i !== -1 && Array.isArray(owner[i].value) ? (owner[i].value as Identity[]) : []
    const value = [...current, id]
    if (i !== -1) owner[i] = { kind, value }
    else owner.push({ kind, value })
  } else if (i !== -1) owner[i] = { kind, value: id }
  else owner.push({ kind, value: id })

  return { ...ontology, instances }
}

/** Remove a value instance and drop it from the owner's `slug` property. */
export function removeValue(
  ontology: Ontology,
  ownerId: Identity,
  slug: string,
  valueId: Identity,
): Ontology {
  const instances = cloneInstances(ontology)
  const owner = instances[ownerId]
  if (!owner) return ontology

  delete instances[valueId]
  const kind = slug as Instance[number]['kind']
  const i = owner.findIndex((p) => p.kind === kind)
  if (i !== -1) {
    const v = owner[i].value
    if (Array.isArray(v)) owner[i] = { kind, value: v.filter((x) => x !== valueId) }
    else if (v === valueId) owner.splice(i, 1)
  }

  return { ...ontology, instances }
}
