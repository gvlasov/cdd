import type { Ontology } from '@/concepts/ontology/Ontology'

export type OntologySource = 'source-code' | 'file' | 'online' | 'database'
export interface AvailableOntology { id: string; name: string; source: OntologySource; ontology: Ontology; description?: string; editable?: boolean
  /** Stores an edited ontology; present for sources that persist edits themselves. */
  persist?: (ontology: Ontology) => void
  /** The ontology as a standalone `.sqlite` file; present for SQLite-backed sources. */
  exportSqlite?: () => Uint8Array<ArrayBuffer>
}
/** A named source of ontologies. Repositories may be populated asynchronously later. */
export interface OntologyRepository { readonly source: OntologySource; list(): AvailableOntology[] }
