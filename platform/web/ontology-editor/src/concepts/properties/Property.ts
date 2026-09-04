import type { Identity } from '@/concepts/identity/Identity'

// A concept is a collection of properties. A property belongs to the concept as
// an instance: it is a value the concept holds in a slot the ontology (or a
// higher concept) defines. The slot is an attribute; the property fills it.
//
// The `identity` property bottoms out the recursion: its value is a literal
// string that is its own content, not a reference to unfold further.
export interface Property {
  /** Which kind of property this is — see property kinds. */
  kind: PropertyKindName
  /**
   * The property's value.
   *  - `identity` / `slug` / `name` / `definition` / `effect`: a literal string
   *  - `concept` / `examples`: the identity of the concept this property holds
   *  - `concepts`: the identities of the concepts an ontology contains
   *  - `attributes`: the attribute concepts an instance of this concept may have
   *  - `transactions`: the transaction identities a concept exposes
   *  - `params`: names of the inputs a transaction's effect expects
   *  - `instance`: the identity an Example links to
   */
  value: Identity | Identity[]
}

export type PropertyKindName =
  | 'identity'
  | 'slug'
  | 'name'
  | 'definition'
  | 'description'
  | 'examples'
  | 'concept'
  | 'concepts'
  | 'attributes'
  | 'transactions'
  | 'effect'
  | 'params'
  | 'required'
  | 'type'
  | 'cardinality'
  | 'instance'

export function propertiesOfKind(
  properties: Property[],
  kind: PropertyKindName,
): Property[] {
  return properties.filter((p) => p.kind === kind)
}

export function firstOfKind(
  properties: Property[],
  kind: PropertyKindName,
): Property | undefined {
  return properties.find((p) => p.kind === kind)
}
