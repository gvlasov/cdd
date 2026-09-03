// Public entry point for the embeddable component.
export { default as OntologyEditor } from '@/concepts/ontology/OntologyEditor.vue'
export { default as OntologyGraphView } from '@/concepts/graph-view/OntologyGraphView.vue'
export type { Ontology, OntologyNode, OntologyEdge } from '@/concepts/ontology/Ontology'
export { emptyOntology, nodeById, edgesOf } from '@/concepts/ontology/Ontology'
