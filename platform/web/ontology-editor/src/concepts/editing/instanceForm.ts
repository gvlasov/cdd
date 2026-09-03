import type { Identity } from '@/concepts/identity/Identity'
import type { Instance } from '@/concepts/instances/Instance'
import { instanceType } from '@/concepts/instances/Instance'
import type { Ontology } from '@/concepts/ontology/Ontology'
import { conceptOf } from '@/concepts/ontology/Ontology'
import {
  conceptAttributes,
  conceptSlug,
  attributeRequired,
} from '@/concepts/concepts/Concept'
import type { PropertyKindName } from '@/concepts/properties/Property'
import { propertyValueKind } from './PropertyValueKind'

export interface FormAttribute {
  /** The attribute concept's identity. */
  attribute: Identity
  /** The property kind it maps to (the attribute concept's slug). */
  kind: PropertyKindName
  required: boolean
}

/**
 * The attributes an instance's type declares, each mapped to a property kind
 * (the attribute concept's slug). A required attribute is one that is neither a
 * list nor nullable — declared via a truthy `required` property on the
 * attribute concept.
 */
export function typeAttributes(ontology: Ontology, instance: Instance): FormAttribute[] {
  const typeId = instanceType(instance)
  const type = typeId ? conceptOf(ontology, typeId) : undefined
  if (!type) return []

  const out: FormAttribute[] = []
  for (const attrId of conceptAttributes(type)) {
    const attr = conceptOf(ontology, attrId)
    const slug = attr ? conceptSlug(attr) : undefined
    if (!slug) continue
    const kind = slug as PropertyKindName
    const vk = propertyValueKind[kind]
    const listOrNull = vk === 'literal-list' || vk === 'concept-list'
    out.push({
      attribute: attrId,
      kind,
      required: !!attr && attributeRequired(attr) && !listOrNull,
    })
  }
  return out
}
