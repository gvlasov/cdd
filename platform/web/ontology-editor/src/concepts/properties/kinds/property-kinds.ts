import type { PropertyKind } from '@/concepts/properties/PropertyKind'
import type { PropertyKindName } from '@/concepts/properties/Property'
import SlugProperty from './SlugProperty.vue'
import NameProperty from './NameProperty.vue'
import DefinitionProperty from './DefinitionProperty.vue'
import DefinitionEdit from './DefinitionEdit.vue'
import ExamplesProperty from './ExamplesProperty.vue'
import EffectProperty from './EffectProperty.vue'
import EffectEdit from './EffectEdit.vue'
import TypeProperty from './TypeProperty.vue'
import InstanceProperty from './InstanceProperty.vue'
import TransactionsProperty from './TransactionsProperty.vue'

// The predefined property kinds and their draw positions inside the instance
// renderer. Equal positions draw in renderer-defined order. A kind with no
// `render` is not drawn inside the instance:
//  - `identity` is the instance's key, not something to show
//  - `attributes` is a concept's schema for its instances; drawn below the
//    instance by ConceptView, not inside it
//  - `concept` references and the ontology's `concepts` list are likewise drawn
//    below the instance as navigable chips, not inside it
//  - `transactions` is drawn inside the instance (like `examples`); running one
//    is a separate action, handled by TransactionBar below the instance
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
  transactions: { name: 'transactions', position: 7, render: TransactionsProperty },
  required: { name: 'required', position: 5 },
  // `type` renders with the cardinality as a superscript; `cardinality` alone
  // is not drawn.
  type: { name: 'type', position: 5, render: TypeProperty },
  cardinality: { name: 'cardinality', position: 5 },
  params: { name: 'params', position: 6 },
  examples: { name: 'examples', position: 7, render: ExamplesProperty },
  instance: { name: 'instance', position: 3, render: InstanceProperty },
  effect: { name: 'effect', position: 8, render: EffectProperty, edit: EffectEdit },
}

export function propertyKind(name: PropertyKindName): PropertyKind {
  return propertyKinds[name]
}
