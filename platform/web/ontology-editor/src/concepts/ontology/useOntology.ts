import { inject, provide, type InjectionKey } from 'vue'
import type { Identity } from '@/concepts/identity/Identity'
import type { Slug } from '@/concepts/identity/Slug'
import type { Ontology } from './Ontology'
import type { Reality } from '@/concepts/reality/Reality'
import { conceptOf, ontologyConcepts } from './Ontology'
import { conceptLabelOf } from '@/concepts/concepts/Concept'
import type { TransactionId } from '@/concepts/transactions/Transaction'

// Lightweight context so property-kind renderers, editors and transaction
// triggers deep in the tree can act without prop drilling.
export interface OntologyContext {
  ontology: () => Ontology
  reality: () => Reality
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
  /** Run a transaction's effect with `input`; emits the new reality. */
  runTransaction: (id: TransactionId, input: unknown) => void
}

const key: InjectionKey<OntologyContext> = Symbol('ontology')

export function provideOntology(ctx: {
  ontology: () => Ontology
  reality: () => Reality
  navigate: (identity: Identity) => void
  apply: (mutate: (ontology: Ontology) => Ontology) => void
  renameSlug: (instanceId: Identity, newSlug: Slug) => void
  createConcept: (slug: Slug) => void
  runTransaction: (id: TransactionId, input: unknown) => void
}): void {
  const label = (identity: Identity) => {
    const concept = conceptOf(ctx.ontology(), identity)
    return concept ? conceptLabelOf(concept) : undefined
  }
  provide(key, {
    ontology: ctx.ontology,
    reality: ctx.reality,
    navigate: ctx.navigate,
    apply: ctx.apply,
    renameSlug: ctx.renameSlug,
    createConcept: ctx.createConcept,
    runTransaction: ctx.runTransaction,
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
