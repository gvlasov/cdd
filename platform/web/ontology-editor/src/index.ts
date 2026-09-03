// Public entry point for the embeddable component.
export { default as OntologyEditor } from '@/concepts/ontology/OntologyEditor.vue'
export { default as ConceptView } from '@/concepts/concept-view/ConceptView.vue'

export type { Ontology } from '@/concepts/ontology/Ontology'
export {
  emptyOntology,
  conceptOf,
  rootConcept,
  parentIdentities,
  identityRepository,
  derivedIdentity,
  slugIdentityMismatches,
} from '@/concepts/ontology/Ontology'

export type { Identity } from '@/concepts/identity/Identity'
export { IdentityRepository } from '@/concepts/identity/IdentityRepository'
export type { Slug } from '@/concepts/identity/Slug'
export { SLUG_PATTERN, isSlug, identityFromSlugChain } from '@/concepts/identity/Slug'

export type { Concept } from '@/concepts/concepts/Concept'
export {
  conceptIdentity,
  conceptSlug,
  conceptName,
  conceptLabelOf,
  conceptRefs,
  conceptAttributes,
} from '@/concepts/concepts/Concept'

export type { Property, PropertyKindName } from '@/concepts/properties/Property'
export type { PropertyKind } from '@/concepts/properties/PropertyKind'
export { propertyKinds, propertyKind } from '@/concepts/properties/kinds/property-kinds'

export {
  ontologyColors,
  ontologyTheme,
  ontologyLightTheme,
  ontologyDarkTheme,
} from '@/concepts/ontology/theme'
export type { OntologyColor } from '@/concepts/ontology/theme'
