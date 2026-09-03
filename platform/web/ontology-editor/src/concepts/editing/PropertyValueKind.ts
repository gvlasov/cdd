import type { PropertyKindName } from '@/concepts/properties/Property'

// How a property's value is edited:
//  - literal:       a single string (v-text-field)
//  - literal-list:  a list of free strings (v-combobox with chips)
//  - concept-list:  a list of concept identities picked from the ontology
//  - kind-list:     a list of property-kind names picked from the known kinds
//  - readonly:      not editable (identity)
export type PropertyValueKind =
  | 'literal'
  | 'literal-list'
  | 'concept-list'
  | 'kind-list'
  | 'readonly'

export const propertyValueKind: Record<PropertyKindName, PropertyValueKind> = {
  identity: 'readonly',
  slug: 'literal',
  name: 'literal',
  definition: 'literal',
  examples: 'literal-list',
  concept: 'concept-list',
  concepts: 'concept-list',
  attributes: 'kind-list',
}

export const ALL_PROPERTY_KINDS: PropertyKindName[] = [
  'identity',
  'slug',
  'name',
  'definition',
  'examples',
  'concept',
  'concepts',
  'attributes',
]
