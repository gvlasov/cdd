import type { AvailableOntology, OntologyRepository } from './OntologyRepository'
/** Ontologies fetched by URL. Entries are retained so they remain browseable. */
export class OnlineOntologiesRepository implements OntologyRepository { readonly source = 'online' as const; private readonly ontologies: AvailableOntology[] = []; add(ontology: AvailableOntology): void { this.ontologies.unshift(ontology) } list(): AvailableOntology[] { return this.ontologies } }
