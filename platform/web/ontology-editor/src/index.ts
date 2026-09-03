// Public entry point for the embeddable component.
export { default as OntologyEditor } from '@/concepts/ontology/OntologyEditor.vue'
export { default as ConceptView } from '@/concepts/concept-view/ConceptView.vue'
export { default as InstanceRenderer } from '@/concepts/instances/InstanceRenderer.vue'

export type { Ontology } from '@/concepts/ontology/Ontology'
export {
  emptyOntology,
  conceptOf,
  rootConcept,
  ontologyConcepts,
  parentIdentities,
  identityRepository,
  derivedIdentity,
  slugIdentityMismatches,
} from '@/concepts/ontology/Ontology'

export type { Identity } from '@/concepts/identity/Identity'
export { IdentityRepository } from '@/concepts/identity/IdentityRepository'
export type { Slug } from '@/concepts/identity/Slug'
export { SLUG_PATTERN, isSlug, identityFromSlugChain } from '@/concepts/identity/Slug'

export type { Instance } from '@/concepts/instances/Instance'
export { instanceName, instanceSlug, instanceIdentity } from '@/concepts/instances/Instance'
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
// A PropertyKind may carry `render` (view) and `edit` (edit-mode) components.
export { propertyKinds, propertyKind } from '@/concepts/properties/kinds/property-kinds'

export { default as ConceptText } from '@/concepts/concept-links/ConceptText.vue'
export { parseConceptLinks } from '@/concepts/concept-links/parseConceptLinks'
export type { Segment } from '@/concepts/concept-links/parseConceptLinks'

export { default as ConceptEditor } from '@/concepts/editing/ConceptEditor.vue'
export {
  setPropertyValue,
  renameSlug,
  identityAfterSlug,
} from '@/concepts/editing/editOntology'
export type { PropertyValueKind } from '@/concepts/editing/PropertyValueKind'
export { propertyValueKind } from '@/concepts/editing/PropertyValueKind'

export {
  ontologyColors,
  ontologyTheme,
  ontologyLightTheme,
  ontologyDarkTheme,
} from '@/concepts/ontology/theme'
export type { OntologyColor } from '@/concepts/ontology/theme'
