import type { Identity } from '@/concepts/identity/Identity'

// A concept is a collection of attributes. An attribute is itself conceptual:
// it has a kind and a value, and the value is another attribute of the
// attribute — referenced, like everything else, by identity.
//
// The recursion bottoms out at `identity`: an identity attribute's value is a
// literal string that is its own content, not a reference to unfold further.
export interface Attribute {
  /** Which kind of attribute this is — see attribute kinds. */
  kind: AttributeKindName
  /**
   * The attribute's value.
   *  - for `identity`: the literal identity string itself
   *  - for every other kind: the identity of the concept this attribute holds
   */
  value: Identity
}

export type AttributeKindName =
  | 'identity'
  | 'slug'
  | 'name'
  | 'definition'
  | 'examples'
  | 'concept'

export function attributesOfKind(
  attributes: Attribute[],
  kind: AttributeKindName,
): Attribute[] {
  return attributes.filter((a) => a.kind === kind)
}

export function firstOfKind(
  attributes: Attribute[],
  kind: AttributeKindName,
): Attribute | undefined {
  return attributes.find((a) => a.kind === kind)
}
