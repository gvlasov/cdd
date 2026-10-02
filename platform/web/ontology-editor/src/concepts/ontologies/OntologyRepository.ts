import type { Ontology } from '@/concepts/ontology/Ontology'

export type OntologySource = 'source-code' | 'file' | 'online' | 'database'
export interface AvailableOntology { id: string; name: string; source: OntologySource; ontology: Ontology; description?: string; editable?: boolean }
/** A named source of ontologies. Repositories may be populated asynchronously later. */
export interface OntologyRepository { readonly source: OntologySource; list(): AvailableOntology[] }
