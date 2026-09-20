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
import StringListProperty from './StringListProperty.vue'
import AttributesProperty from './AttributesProperty.vue'
import DetailsProperty from './DetailsProperty.vue'
import SchemeProperty from '@/concepts/schemes/SchemeProperty.vue'
import PrototypeImageProperty from '@/concepts/images/PrototypeImageProperty.vue'

// The predefined property kinds and their draw positions inside the instance
// renderer. Equal positions draw in renderer-defined order. A kind with no
// `render` is not drawn inside the instance:
//  - `identity` is the instance's key, not something to show
//  - `attributes` is a concept's schema for its instances; rendered as a
//    linked list inside its instance card
//  - `concept` (the type reference) is drawn below the instance as a navigable
//    chip, not inside it
//  - `transactions` and `concepts` are drawn inside the instance (like
//    `examples`); each transaction item includes its own run action
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
  prototypeImage: { name: 'prototypeImage', position: 2.5, render: PrototypeImageProperty },
  details: { name: 'details', position: 3, render: DetailsProperty },
  identity: { name: 'identity', position: 3 },
  concept: { name: 'concept', position: 4 },
  concepts: { name: 'concepts', position: 7, render: ConceptsProperty },
  inspirations: { name: 'inspirations', position: 7, render: ExamplesProperty },
  attributes: { name: 'attributes', position: 5, render: AttributesProperty },
  transactions: { name: 'transactions', position: 7, render: TransactionsProperty },
  required: { name: 'required', position: 5 },
  type: { name: 'type', position: 5 },
  cardinality: { name: 'cardinality', position: 5 },
  params: { name: 'params', position: 6 },
  layers: { name: 'layers', position: 7, render: StringListProperty },
  concerns: { name: 'concerns', position: 7, render: StringListProperty },
  examples: { name: 'examples', position: 7, render: ExamplesProperty },
  instance: { name: 'instance', position: 3, render: InstanceProperty },
  effect: { name: 'effect', position: 8, render: EffectProperty, edit: EffectEdit },
  parentConcept: { name: 'parentConcept', position: 4, render: ParentConceptProperty },
  canonicalName: { name: 'canonicalName', position: 1, render: CanonicalNameProperty },
  computed: { name: 'computed', position: 5 },
  function: { name: 'function', position: 8 },
  // A scheme is normally supplied through an attribute typed `cdd.scheme`.
  // The instance renderer also selects this kind by attribute type, so the
  // enclosing concept may name its slot something other than `scheme`.
  scheme: { name: 'scheme', position: 6, render: SchemeProperty },
  exampleDiagram: { name: 'exampleDiagram', position: 6, render: SchemeProperty },
  // An ontology overview is navigation, so show it before a concept's often
  // long documentation rather than hiding it at the end of the page.
  ontologyDiagram: { name: 'ontologyDiagram', position: 3, render: SchemeProperty },
  boxes: { name: 'boxes', position: 7 },
  edges: { name: 'edges', position: 7 },
  texts: { name: 'texts', position: 7 },
  content: { name: 'content', position: 7 },
  denotatum: { name: 'denotatum', position: 7 },
  color: { name: 'color', position: 7 },
  backgroundColor: { name: 'backgroundColor', position: 7 },
  borderColor: { name: 'borderColor', position: 7 },
  padding: { name: 'padding', position: 7 },
  source: { name: 'source', position: 7 },
  target: { name: 'target', position: 7 },
  lineStyle: { name: 'lineStyle', position: 7 },
  routing: { name: 'routing', position: 7 },
  boldness: { name: 'boldness', position: 7 },
  startHead: { name: 'startHead', position: 7 },
  endHead: { name: 'endHead', position: 7 },
  align: { name: 'align', position: 7 },
  url: { name: 'url', position: 7 },
  blob: { name: 'blob', position: 7 },
}

export function propertyKind(name: PropertyKindName): PropertyKind {
  return propertyKinds[name]
}
