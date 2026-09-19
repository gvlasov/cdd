import type { Identity } from '@/concepts/identity/Identity'
import type { Instance } from '@/concepts/instances/Instance'
import { instanceIdentity } from '@/concepts/instances/Instance'
import type { Property } from '@/concepts/properties/Property'
import type { Ontology } from './Ontology'

// A CDD-authored ontology file: one per concept, exporting that concept's own
// instance plus any instances it owns (attributes, transactions, ...) as a
// flat array. Each entry carries its own `identity` property, which becomes
// its key in the assembled Ontology.
export type OntologyModule = Instance[]

function mergeProperties(existing: Instance, incoming: Instance): Instance {
  const merged = [...existing]
  for (const property of incoming) {
    const index = merged.findIndex((candidate) => candidate.kind === property.kind)
    if (index < 0) {
      merged.push(property)
      continue
    }
    const previous = merged[index] as Property
    if (Array.isArray(previous.value) && Array.isArray(property.value)) {
      merged[index] = { ...property, value: [...new Set([...previous.value, ...property.value])] }
      continue
    }
    merged[index] = property
  }
  return merged
}

/**
 * Assemble an Ontology from a glob-imported module map (as produced by
 * `import.meta.glob('<dir>/**\/*.ts', { eager: true })`). Every module's
 * default export is expected to be an OntologyModule; entries missing an
 * `identity` property are skipped.
 */
export function loadOntology(
  modules: Record<string, { default: OntologyModule }>,
  root: Identity,
): Ontology {
  const instances: Record<Identity, Instance> = {}
  for (const mod of Object.values(modules)) {
    for (const instance of mod.default) {
      const id = instanceIdentity(instance)
      if (!id) continue
      instances[id] = instances[id] ? mergeProperties(instances[id], instance) : instance
    }
  }
  return { root, instances }
}
