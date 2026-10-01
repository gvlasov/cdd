import type { Identity } from '@/concepts/identity/Identity'
import type { Ontology } from '@/concepts/ontology/Ontology'
import type { Instance } from '@/concepts/instances/Instance'

function withProperty(instance: Instance, kind: 'translations' | 'value', value: string | string[]): Instance {
  const index = instance.findIndex((property) => property.kind === kind)
  if (index < 0) return [...instance, { kind, value }]
  return instance.map((property, propertyIndex) => propertyIndex === index ? { ...property, value } : property)
}

/** Set Text's translation in one language, creating that translation when needed. */
export function setTextTranslation(
  ontology: Ontology,
  textId: Identity,
  languageId: Identity,
  value: string,
): Ontology {
  const text = ontology.instances[textId]
  if (!text) return ontology
  const translations = text.find((property) => property.kind === 'translations')?.value
  const translationIds = translations ? (Array.isArray(translations) ? translations : [translations]) : []
  const translationId = translationIds.find((id) =>
    ontology.instances[id]?.some((property) => property.kind === 'language' && property.value === languageId),
  ) ?? `${textId}:translation:${languageId}`
  const translation = ontology.instances[translationId] ?? [
    { kind: 'identity', value: translationId },
    { kind: 'concept', value: 'cdd.translation' },
    { kind: 'language', value: languageId },
  ]
  return {
    ...ontology,
    instances: {
      ...ontology.instances,
      [textId]: withProperty(text, 'translations', [...new Set([...translationIds, translationId])]),
      [translationId]: withProperty(translation, 'value', value),
    },
  }
}
