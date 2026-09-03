import type { PropertyKindName } from '@/concepts/properties/Property'

// How a property's value is edited:
//  - literal:       a single string (v-text-field)
//  - literal-list:  a list of free strings (v-combobox with chips)
//  - concept-list:  a list of concept identities picked from the ontology
//  - readonly:      not editable (identity)
export type PropertyValueKind = 'literal' | 'literal-list' | 'concept-list' | 'readonly'

export const propertyValueKind: Record<PropertyKindName, PropertyValueKind> = {
  identity: 'readonly',
  slug: 'literal',
  name: 'literal',
  definition: 'literal',
  description: 'literal',
  examples: 'literal-list',
  concept: 'concept-list',
  concepts: 'concept-list',
  attributes: 'concept-list',
  transactions: 'concept-list',
  effect: 'literal',
  params: 'literal-list',
  required: 'literal',
  type: 'concept-list',
  cardinality: 'literal',
}

export const ALL_PROPERTY_KINDS: PropertyKindName[] = [
  'identity',
  'slug',
  'name',
  'definition',
  'description',
  'examples',
  'concept',
  'concepts',
  'attributes',
  'transactions',
  'effect',
  'params',
  'required',
  'type',
  'cardinality',
]
