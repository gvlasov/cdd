import type { PropertyKind } from '@/concepts/properties/PropertyKind'
import type { PropertyKindName } from '@/concepts/properties/Property'
import SlugProperty from './SlugProperty.vue'
import NameProperty from './NameProperty.vue'
import DefinitionProperty from './DefinitionProperty.vue'
import ExamplesProperty from './ExamplesProperty.vue'
import ConceptProperty from './ConceptProperty.vue'
import AttributesProperty from './AttributesProperty.vue'

// The predefined property kinds and their draw positions on the concept widget.
// Equal positions draw in renderer-defined order. A kind with no `render` is
// not drawn (e.g. `identity` — it is the concept's key, not something to show).
export const propertyKinds: Record<PropertyKindName, PropertyKind> = {
  name: { name: 'name', position: 0, render: NameProperty },
  definition: { name: 'definition', position: 1, render: DefinitionProperty },
  identity: { name: 'identity', position: 2 },
  slug: { name: 'slug', position: 2, render: SlugProperty },
  concept: { name: 'concept', position: 3, render: ConceptProperty },
  attributes: { name: 'attributes', position: 4, render: AttributesProperty },
  examples: { name: 'examples', position: 5, render: ExamplesProperty },
}

export function propertyKind(name: PropertyKindName): PropertyKind {
  return propertyKinds[name]
}
