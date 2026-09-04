import type { Identity } from '@/concepts/identity/Identity'
import type { Instance } from '@/concepts/instances/Instance'
import { instanceIdentity } from '@/concepts/instances/Instance'
import type { Ontology } from './Ontology'

// A CDD-authored ontology file: one per concept, exporting that concept's own
// instance plus any instances it owns (attributes, transactions, ...) as a
// flat array. Each entry carries its own `identity` property, which becomes
// its key in the assembled Ontology.
export type OntologyModule = Instance[]

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
      instances[id] = instance
    }
  }
  return { root, instances }
}
