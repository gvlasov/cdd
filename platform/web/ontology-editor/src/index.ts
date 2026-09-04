// Public entry point for the embeddable component.
export { default as OntologyEditor } from '@/concepts/ontology/OntologyEditor.vue'
export { default as ConceptView } from '@/concepts/concept-view/ConceptView.vue'
export { default as InstanceView } from '@/concepts/instances/Instance.vue'

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
export {
  instanceName,
  instanceSlug,
  instanceIdentity,
  instanceType,
} from '@/concepts/instances/Instance'
export type { Concept } from '@/concepts/concepts/Concept'
export {
  isConcept,
  conceptIdentity,
  conceptSlug,
  conceptName,
  conceptLabelOf,
  conceptRefs,
  conceptAttributes,
  attributeRequired,
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
  addProperty,
  removeProperty,
  renameSlug,
  identityAfterSlug,
  createConcept,
  newConceptIdentity,
  addToList,
  removeFromList,
} from '@/concepts/editing/editOntology'
export type { PropertyValueKind } from '@/concepts/editing/PropertyValueKind'
export { propertyValueKind } from '@/concepts/editing/PropertyValueKind'
export { default as InstanceForm } from '@/concepts/editing/InstanceForm.vue'

export type { Cardinality, AttributeSpec } from '@/concepts/attributes/Attribute'
export {
  CARDINALITIES,
  attributeCardinality,
  attributeType,
  isRequired,
  isList,
  attributeSpec,
  conceptAttributeSpecs,
  isLeafConcept,
} from '@/concepts/attributes/Attribute'
export { createAttribute, newAttributeIdentity } from '@/concepts/attributes/editAttributes'
export { spawnValue, removeValue } from '@/concepts/attributes/spawnValue'

export type { Reality } from '@/concepts/reality/Reality'
export { emptyReality, realityInstance, instancesOfConcept } from '@/concepts/reality/Reality'

export type { TransactionId } from '@/concepts/transactions/Transaction'
export {
  transactionId,
  conceptOfTransaction,
  transactionName,
  conceptTransactions,
  transactionEffect,
  transactionParams,
} from '@/concepts/transactions/Transaction'
export { runEffect } from '@/concepts/transactions/runEffect'
export type { RealityApi } from '@/concepts/transactions/runEffect'

export {
  ontologyColors,
  ontologyTheme,
  ontologyLightTheme,
  ontologyDarkTheme,
} from '@/concepts/ontology/theme'
export type { OntologyColor } from '@/concepts/ontology/theme'
