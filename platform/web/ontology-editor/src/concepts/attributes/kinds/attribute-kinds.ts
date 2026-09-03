import type { AttributeKind } from '@/concepts/attributes/AttributeKind'
import type { AttributeKindName } from '@/concepts/attributes/Attribute'
import IdentityAttribute from './IdentityAttribute.vue'
import SlugAttribute from './SlugAttribute.vue'
import NameAttribute from './NameAttribute.vue'
import DefinitionAttribute from './DefinitionAttribute.vue'
import ExamplesAttribute from './ExamplesAttribute.vue'
import ConceptAttribute from './ConceptAttribute.vue'

// The predefined attribute kinds and their draw positions on the concept
// widget. Equal positions draw in renderer-defined order.
export const attributeKinds: Record<AttributeKindName, AttributeKind> = {
  name: { name: 'name', position: 0, render: NameAttribute },
  definition: { name: 'definition', position: 1, render: DefinitionAttribute },
  identity: { name: 'identity', position: 2, render: IdentityAttribute },
  slug: { name: 'slug', position: 2, render: SlugAttribute },
  concept: { name: 'concept', position: 3, render: ConceptAttribute },
  examples: { name: 'examples', position: 5, render: ExamplesAttribute },
}

export function attributeKind(name: AttributeKindName): AttributeKind {
  return attributeKinds[name]
}
