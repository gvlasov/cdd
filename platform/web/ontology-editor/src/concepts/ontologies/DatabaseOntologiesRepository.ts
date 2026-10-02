import type { AvailableOntology, OntologyRepository } from './OntologyRepository'
/** Boundary for persisted ontologies; the demo starts with no database connection. */
export class DatabaseOntologiesRepository implements OntologyRepository { readonly source = 'database' as const; list(): AvailableOntology[] { return [] } }
