import type { Ontology } from '@/concepts/ontology/Ontology'
import { SqliteOntology } from '@/concepts/ontology/SqliteOntology'
import type { AvailableOntology, OntologyRepository } from './OntologyRepository'

/** Ontologies held in SQLite databases, opened from `.sqlite` files for this browser session. */
export class DatabaseOntologiesRepository implements OntologyRepository {
  readonly source = 'database' as const
  private readonly ontologies: AvailableOntology[] = []

  list(): AvailableOntology[] {
    return this.ontologies
  }

  /** Opens a `.sqlite` file written by CDD and lists it. */
  async openFile(file: File): Promise<AvailableOntology> {
    return this.add(await SqliteOntology.open(new Uint8Array(await file.arrayBuffer())), file.name.replace(/\.(sqlite3?|db)$/i, ''), file.name)
  }

  /** Copies `ontology` into a new SQLite database and lists it. */
  async createFrom(ontology: Ontology, name: string): Promise<AvailableOntology> {
    return this.add(await SqliteOntology.create(ontology), name, 'SQLite database')
  }

  private add(store: SqliteOntology, name: string, description: string): AvailableOntology {
    const available: AvailableOntology = {
      id: `database:${name}:${Date.now()}`,
      name,
      source: 'database',
      description,
      ontology: store.ontology,
      editable: true,
      persist: (ontology) => store.update(ontology),
      exportSqlite: () => store.export(),
    }
    this.ontologies.unshift(available)
    return available
  }
}
