import { inject, provide, type InjectionKey } from 'vue'
import type { Identity } from '@/concepts/identity/Identity'
import type { Ontology } from './Ontology'
import { conceptOf } from './Ontology'
import { conceptLabelOf } from '@/concepts/concepts/Concept'

// Lightweight context so property-kind renderers deep in the tree can resolve
// labels and navigate without prop drilling.
export interface OntologyContext {
  ontology: () => Ontology
  conceptLabel: (identity: Identity) => string | undefined
  navigate: (identity: Identity) => void
}

const key: InjectionKey<OntologyContext> = Symbol('ontology')

export function provideOntology(ctx: {
  ontology: () => Ontology
  navigate: (identity: Identity) => void
}): void {
  provide(key, {
    ontology: ctx.ontology,
    navigate: ctx.navigate,
    conceptLabel: (identity) => {
      const concept = conceptOf(ctx.ontology(), identity)
      return concept ? conceptLabelOf(concept) : undefined
    },
  })
}

export function useOntology(): OntologyContext {
  const ctx = inject(key)
  if (!ctx) throw new Error('useOntology() must be used within <OntologyEditor>')
  return ctx
}
