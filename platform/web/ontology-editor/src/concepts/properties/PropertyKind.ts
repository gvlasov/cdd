import type { Component } from 'vue'
import type { PropertyKindName } from './Property'

// A property kind is a subconcept that partitions properties. Each kind decides
// how its properties draw on the concept widget and at what vertical position.
// Properties sharing a position draw in renderer-defined order.
export interface PropertyKind {
  name: PropertyKindName
  /** Vertical draw order on the concept widget; lower is higher up. */
  position: number
  /**
   * Component that renders one property of this kind, given props
   * `{ property, instance }`. Omitted for kinds that are not drawn.
   */
  render?: Component
  /**
   * Component that edits one property of this kind, given props
   * `{ instanceId, property }`. Omitted kinds fall back to the generic editor
   * driven by their value kind; `identity` is never editable.
   */
  edit?: Component
}
