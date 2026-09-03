import type { PropertyKind } from '@/concepts/properties/PropertyKind'
import type { PropertyKindName } from '@/concepts/properties/Property'
import SlugProperty from './SlugProperty.vue'
import NameProperty from './NameProperty.vue'
import DefinitionProperty from './DefinitionProperty.vue'
import ExamplesProperty from './ExamplesProperty.vue'

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
  definition: { name: 'definition', position: 1, render: DefinitionProperty },
  identity: { name: 'identity', position: 2 },
  slug: { name: 'slug', position: 2, render: SlugProperty },
  concept: { name: 'concept', position: 3 },
  concepts: { name: 'concepts', position: 3 },
  attributes: { name: 'attributes', position: 4 },
  examples: { name: 'examples', position: 5, render: ExamplesProperty },
}

export function propertyKind(name: PropertyKindName): PropertyKind {
  return propertyKinds[name]
}
