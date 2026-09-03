import type { Component } from 'vue'
import type { AttributeKindName } from './Attribute'

// An attribute kind is a subconcept that partitions attributes. Each kind
// decides how its attributes draw on the concept widget and at what vertical
// position. Attributes sharing a position draw in renderer-defined order.
export interface AttributeKind {
  name: AttributeKindName
  /** Vertical draw order on the concept widget; lower is higher up. */
  position: number
  /** Component that renders one attribute of this kind. */
  render: Component
}
