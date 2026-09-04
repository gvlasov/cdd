import type { PropertyKind } from '@/concepts/properties/PropertyKind'
import type { PropertyKindName } from '@/concepts/properties/Property'
import NameProperty from './NameProperty.vue'
import DefinitionProperty from './DefinitionProperty.vue'
import DefinitionEdit from './DefinitionEdit.vue'
import ExamplesProperty from './ExamplesProperty.vue'
import EffectProperty from './EffectProperty.vue'
import EffectEdit from './EffectEdit.vue'
import InstanceProperty from './InstanceProperty.vue'
import TransactionsProperty from './TransactionsProperty.vue'
import ConceptsProperty from './ConceptsProperty.vue'
import ParentConceptProperty from './ParentConceptProperty.vue'
import CanonicalNameProperty from './CanonicalNameProperty.vue'

// The predefined property kinds and their draw positions inside the instance
// renderer. Equal positions draw in renderer-defined order. A kind with no
// `render` is not drawn inside the instance:
//  - `identity` is the instance's key, not something to show
//  - `attributes` is a concept's schema for its instances; drawn below the
//    instance by ConceptView, not inside it
//  - `concept` (the type reference) is drawn below the instance as a navigable
//    chip, not inside it
//  - `transactions` and `concepts` are drawn inside the instance (like
//    `examples`); running a transaction is a separate action, handled by
//    TransactionBar below the instance
//  - `computed` and `function` describe a computed attribute's own
//    derivation (see cdd.attribute); they are not drawn on the instances
//    that attribute applies to — AttributeValueEditor reads them directly
//    to render and evaluate the derived value instead
//  - `slug` is not drawn — it is addressing, not something to show
//  - `type` and `cardinality` are drawn inline with the name for an attribute
//    instance — see NameProperty — not on their own line
export const propertyKinds: Record<PropertyKindName, PropertyKind> = {
  name: { name: 'name', position: 0, render: NameProperty },
  slug: { name: 'slug', position: 1 },
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
  concepts: { name: 'concepts', position: 7, render: ConceptsProperty },
  attributes: { name: 'attributes', position: 5 },
  transactions: { name: 'transactions', position: 7, render: TransactionsProperty },
  required: { name: 'required', position: 5 },
  type: { name: 'type', position: 5 },
  cardinality: { name: 'cardinality', position: 5 },
  params: { name: 'params', position: 6 },
  examples: { name: 'examples', position: 7, render: ExamplesProperty },
  instance: { name: 'instance', position: 3, render: InstanceProperty },
  effect: { name: 'effect', position: 8, render: EffectProperty, edit: EffectEdit },
  parentConcept: { name: 'parentConcept', position: 4, render: ParentConceptProperty },
  canonicalName: { name: 'canonicalName', position: 1, render: CanonicalNameProperty },
  computed: { name: 'computed', position: 5 },
  function: { name: 'function', position: 8 },
}

export function propertyKind(name: PropertyKindName): PropertyKind {
  return propertyKinds[name]
}
