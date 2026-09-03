// Public entry point for the embeddable component.
export { default as OntologyEditor } from '@/concepts/ontology/OntologyEditor.vue'
export { default as ConceptView } from '@/concepts/concept-view/ConceptView.vue'
export type { Ontology, OntologyNode, OntologyEdge } from '@/concepts/ontology/Ontology'
export {
  emptyOntology,
  nodeById,
  attributesOf,
  parentsOf,
} from '@/concepts/ontology/Ontology'
