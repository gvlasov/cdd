import type { AvailableOntology, OntologyRepository } from './OntologyRepository'
/** Ontologies authored in this project's JavaScript or TypeScript files. */
export class SourceCodeOntologiesRepository implements OntologyRepository { readonly source = 'source-code' as const; constructor(private readonly ontologies: AvailableOntology[]) {} list(): AvailableOntology[] { return this.ontologies } }
