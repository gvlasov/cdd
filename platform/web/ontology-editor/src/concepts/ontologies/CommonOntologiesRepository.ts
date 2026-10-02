import type { AvailableOntology, OntologyRepository } from './OntologyRepository'
/** The common repository is the one browse surface: it proxies every source. */
export class CommonOntologiesRepository { constructor(private readonly repositories: OntologyRepository[]) {} list(): AvailableOntology[] { return this.repositories.flatMap((repository) => repository.list()) } }
