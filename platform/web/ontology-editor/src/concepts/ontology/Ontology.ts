// A generic concept graph: typed nodes connected by typed, directed edges.
// Format-agnostic — not tied to CDD's directory layout or any storage backend.

export interface OntologyNode {
  id: string
  /** Display name of the concept. */
  name: string
  /** Free-form category, e.g. "concept", "stakeholder", "process". Optional. */
  kind?: string
  /** Markdown or plain-text description of the concept. */
  description?: string
}

export interface OntologyEdge {
  id: string
  /** Source node id. */
  from: string
  /** Target node id. */
  to: string
  /** Relation label, e.g. "reflects", "depends on", "is a". */
  relation: string
}

export interface Ontology {
  nodes: OntologyNode[]
  edges: OntologyEdge[]
}

export const emptyOntology = (): Ontology => ({ nodes: [], edges: [] })

export function nodeById(ontology: Ontology, id: string): OntologyNode | undefined {
  return ontology.nodes.find((n) => n.id === id)
}

export function edgesOf(ontology: Ontology, nodeId: string): OntologyEdge[] {
  return ontology.edges.filter((e) => e.from === nodeId || e.to === nodeId)
}
