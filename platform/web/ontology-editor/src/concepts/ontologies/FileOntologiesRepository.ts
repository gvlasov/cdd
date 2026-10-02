import type { AvailableOntology, OntologyRepository } from './OntologyRepository'
/** Ontologies selected from the user's filesystem during this browser session. */
export class FileOntologiesRepository implements OntologyRepository { readonly source = 'file' as const; private readonly ontologies: AvailableOntology[] = []; add(ontology: AvailableOntology): void { this.ontologies.unshift(ontology) } list(): AvailableOntology[] { return this.ontologies } }
