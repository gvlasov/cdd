import type { Identity } from './Identity'
import type { Concept } from '@/concepts/concepts/Concept'

// Maps every identity string in an ontology to the instance it represents.
// Built by scanning the ontology's concepts at load; every identity is unique
// within the ontology, so the map is 1:1.
export class IdentityRepository {
  private readonly byIdentity: Map<Identity, Concept>

  constructor(concepts: Record<Identity, Concept>) {
    this.byIdentity = new Map(Object.entries(concepts))
  }

  has(identity: Identity): boolean {
    return this.byIdentity.has(identity)
  }

  /** The concept an identity represents, if the identity names a concept. */
  concept(identity: Identity): Concept | undefined {
    return this.byIdentity.get(identity)
  }

  identities(): Identity[] {
    return [...this.byIdentity.keys()]
  }
}
