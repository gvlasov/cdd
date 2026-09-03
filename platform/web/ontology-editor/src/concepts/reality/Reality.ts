import type { Identity } from '@/concepts/identity/Identity'
import type { Instance } from '@/concepts/instances/Instance'

// A reality is the collection of instances of an ontology's concepts — the
// state a transaction's effect manipulates. It is passed to <OntologyEditor>
// alongside the ontology (v-model:reality) and is never merged into it.
//
// Each reality instance carries a `concept` property naming its metaentity
// concept in the ontology.
export interface Reality {
  instances: Record<Identity, Instance>
}

export const emptyReality = (): Reality => ({ instances: {} })

export function realityInstance(reality: Reality, id: Identity): Instance | undefined {
  return reality.instances[id]
}

/** Instances in the reality whose metaentity is `conceptId`. */
export function instancesOfConcept(reality: Reality, conceptId: Identity): Instance[] {
  return Object.values(reality.instances).filter((instance) =>
    instance.some((p) => p.kind === 'concept' && p.value === conceptId),
  )
}
