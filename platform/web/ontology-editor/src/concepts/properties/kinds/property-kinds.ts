import type { PropertyKind } from '@/concepts/properties/PropertyKind'
import type { PropertyKindName } from '@/concepts/properties/Property'
import SlugProperty from './SlugProperty.vue'
import NameProperty from './NameProperty.vue'
import DefinitionProperty from './DefinitionProperty.vue'
import DefinitionEdit from './DefinitionEdit.vue'
import ExamplesProperty from './ExamplesProperty.vue'
import EffectProperty from './EffectProperty.vue'
import EffectEdit from './EffectEdit.vue'

// The predefined property kinds and their draw positions inside the instance
// renderer. Equal positions draw in renderer-defined order. A kind with no
// `render` is not drawn inside the instance:
//  - `identity` is the instance's key, not something to show
//  - `attributes` is a concept's schema for its instances; drawn below the
//    instance by ConceptView, not inside it
//  - `concept` references and the ontology's `concepts` list are likewise drawn
//    below the instance as navigable chips, not inside it
export const propertyKinds: Record<PropertyKindName, PropertyKind> = {
  name: { name: 'name', position: 0, render: NameProperty },
  slug: { name: 'slug', position: 1, render: SlugProperty },
  definition: {
    name: 'definition',
    position: 2,
    render: DefinitionProperty,
    edit: DefinitionEdit,
  },
  description: {
    name: 'description',
    position: 2,
    render: DefinitionProperty,
    edit: DefinitionEdit,
  },
  identity: { name: 'identity', position: 3 },
  concept: { name: 'concept', position: 4 },
  concepts: { name: 'concepts', position: 4 },
  attributes: { name: 'attributes', position: 5 },
  transactions: { name: 'transactions', position: 5 },
  required: { name: 'required', position: 5 },
  params: { name: 'params', position: 6 },
  examples: { name: 'examples', position: 7, render: ExamplesProperty },
  effect: { name: 'effect', position: 8, render: EffectProperty, edit: EffectEdit },
}

export function propertyKind(name: PropertyKindName): PropertyKind {
  return propertyKinds[name]
}
