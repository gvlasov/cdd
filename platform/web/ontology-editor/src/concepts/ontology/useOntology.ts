import { inject, provide, type InjectionKey } from 'vue'
import type { Identity } from '@/concepts/identity/Identity'
import type { Slug } from '@/concepts/identity/Slug'
import type { Ontology } from './Ontology'
import { conceptOf, ontologyConcepts } from './Ontology'
import { conceptLabelOf } from '@/concepts/concepts/Concept'

// Lightweight context so property-kind renderers and editors deep in the tree
// can resolve labels, navigate, and apply edits without prop drilling.
export interface OntologyContext {
  ontology: () => Ontology
  conceptLabel: (identity: Identity) => string | undefined
  /** { value, title } options for picking a concept in an editor. */
  conceptOptions: () => Array<{ value: Identity; title: string }>
  navigate: (identity: Identity) => void
  /** Apply an immutable edit and emit the new ontology. */
  apply: (mutate: (ontology: Ontology) => Ontology) => void
  /** Rename an instance's slug: re-key, rewrite references, follow the move. */
  renameSlug: (instanceId: Identity, newSlug: Slug) => void
  /** Create a concept from a slug, then open it in edit mode. */
  createConcept: (slug: Slug) => void
}

const key: InjectionKey<OntologyContext> = Symbol('ontology')

export function provideOntology(ctx: {
  ontology: () => Ontology
  navigate: (identity: Identity) => void
  apply: (mutate: (ontology: Ontology) => Ontology) => void
  renameSlug: (instanceId: Identity, newSlug: Slug) => void
  createConcept: (slug: Slug) => void
}): void {
  const label = (identity: Identity) => {
    const concept = conceptOf(ctx.ontology(), identity)
    return concept ? conceptLabelOf(concept) : undefined
  }
  provide(key, {
    ontology: ctx.ontology,
    navigate: ctx.navigate,
    apply: ctx.apply,
    renameSlug: ctx.renameSlug,
    createConcept: ctx.createConcept,
    conceptLabel: label,
    conceptOptions: () =>
      ontologyConcepts(ctx.ontology()).map((id) => ({ value: id, title: label(id) ?? id })),
  })
}

export function useOntology(): OntologyContext {
  const ctx = inject(key)
  if (!ctx) throw new Error('useOntology() must be used within <OntologyEditor>')
  return ctx
}
