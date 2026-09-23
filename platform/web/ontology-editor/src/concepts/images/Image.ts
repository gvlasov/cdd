import type { Instance } from '@/concepts/instances/Instance'
import type { Property } from '@/concepts/properties/Property'
import { firstOfKind } from '@/concepts/properties/Property'
import { instanceName } from '@/concepts/instances/Instance'

// A `cdd.image` instance (concepts/images/Image.ts): visual content from a
// `url` or an embedded data-URL `blob`.
export const IMAGE_CONCEPT = 'cdd.image'

function literal(property: Property | undefined): string | undefined {
  if (!property) return undefined
  return Array.isArray(property.value) ? property.value[0] : property.value
}

/**
 * URL wins when both sources are supplied, so an embedded blob remains a
 * portable fallback for an image whose remote URL cannot be reached.
 */
export function imageSource(image: Instance): string | undefined {
  return literal(firstOfKind(image, 'url')) || literal(firstOfKind(image, 'blob')) || undefined
}

export function imageAlt(image: Instance): string {
  return instanceName(image) ?? literal(firstOfKind(image, 'originalName')) ?? 'Image'
}
