// A generic concept graph.
//
// Every node is a concept. The one relation the editor navigates is
// "has attribute": a concept has other concepts as its attributes, and is in
// turn an attribute of its parent concepts. An attribute edge points from the
// owning concept to the attribute concept.
//
// Format-agnostic — not tied to CDD's directory layout or any storage backend.

export interface OntologyNode {
  id: string
  /** Display name of the concept. Optional — a concept need not be named. */
  name?: string
  /** Markdown or plain-text description of the concept. Optional. */
  description?: string
}

export interface OntologyEdge {
  id: string
  /** The concept that has the attribute. */
  from: string
  /** The attribute concept. */
  to: string
  /** Optional label for how `to` relates to `from`, e.g. "has", "is measured in". */
  relation?: string
}

export interface Ontology {
  nodes: OntologyNode[]
  edges: OntologyEdge[]
}

export const emptyOntology = (): Ontology => ({ nodes: [], edges: [] })

export function nodeById(ontology: Ontology, id: string): OntologyNode | undefined {
  return ontology.nodes.find((n) => n.id === id)
}

/** Concepts that `conceptId` has as attributes. */
export function attributesOf(ontology: Ontology, conceptId: string): OntologyEdge[] {
  return ontology.edges.filter((e) => e.from === conceptId)
}

/** Concepts that have `conceptId` as one of their attributes. */
export function parentsOf(ontology: Ontology, conceptId: string): OntologyEdge[] {
  return ontology.edges.filter((e) => e.to === conceptId)
}
