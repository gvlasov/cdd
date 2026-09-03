import type { Identity } from './Identity'

// A slug is a word matching [a-zA-Z0-9_-]+ that uniquely identifies an instance
// within its ontology. Any instance can carry one — the ontology and a concept
// are just instances that commonly do.
//
// When an instance has a slug and every entity above it in the metaentity chain
// (instance -> concept -> ontology) also has a slug, the instance's identity is
// those slugs joined by ".": `<ontologySlug>.<conceptSlug>.<instanceSlug>`.
export type Slug = string

export const SLUG_PATTERN = /^[a-zA-Z0-9_-]+$/

export function isSlug(value: string): value is Slug {
  return SLUG_PATTERN.test(value)
}

/** Build an identity from a metaentity chain of slugs, root first. */
export function identityFromSlugChain(slugs: Slug[]): Identity {
  return slugs.join('.')
}
