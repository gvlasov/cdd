import type { Identity } from './Identity'
import type { Instance } from '@/concepts/instances/Instance'

// Maps every identity string in an ontology to the instance it represents.
// Built by scanning the ontology's instance store at load; every identity is
// unique within the ontology, so the map is 1:1.
export class IdentityRepository {
  private readonly byIdentity: Map<Identity, Instance>

  constructor(instances: Record<Identity, Instance>) {
    this.byIdentity = new Map(Object.entries(instances))
  }

  has(identity: Identity): boolean {
    return this.byIdentity.has(identity)
  }

  /** The instance an identity represents. */
  instance(identity: Identity): Instance | undefined {
    return this.byIdentity.get(identity)
  }

  identities(): Identity[] {
    return [...this.byIdentity.keys()]
  }
}
