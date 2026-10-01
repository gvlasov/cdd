import type { Identity } from '@/concepts/identity/Identity'
import type { Instance } from '@/concepts/instances/Instance'
import { instanceIdentity } from '@/concepts/instances/Instance'
import type { Property } from '@/concepts/properties/Property'
import type { Ontology } from './Ontology'

function propertyValue(instance: Instance, kind: string): string | undefined {
  const property = instance.find((candidate) => candidate.kind === kind)
  if (!property) return undefined
  return Array.isArray(property.value) ? property.value[0] : property.value
}

// CDD's authored ontology predates localized names. Keep authored concept
// files concise while loading them as the first-class Name → Word →
// Translation graph the editor now uses. A Cyrillic legacy name is retained
// as a Russian translation; all current CDD concept names are English.
function localizeNames(instances: Record<Identity, Instance>): void {
  for (const [identity, instance] of Object.entries(instances)) {
    const type = propertyValue(instance, 'concept')
    if (type === 'cdd.name' || type === 'cdd.word' || type === 'cdd.translation' || type === 'cdd.text') continue
    const name = instance.find((property) => property.kind === 'name')
    if (!name || Array.isArray(name.value) || name.value.startsWith('cdd.name:')) continue

    const source = name.value
    const language = /[\u0400-\u04ff]/.test(source) ? 'ru' : 'en'
    const nameId = `cdd.name:${identity}`
    const wordId = `${nameId}:word`
    const translationId = `${wordId}:translation:${language}`
    name.value = nameId
    instances[nameId] ??= [
      { kind: 'identity', value: nameId },
      { kind: 'concept', value: 'cdd.name' },
      { kind: 'synonyms', value: [wordId] },
    ]
    instances[wordId] ??= [
      { kind: 'identity', value: wordId },
      { kind: 'concept', value: 'cdd.word' },
      { kind: 'translations', value: [translationId] },
    ]
    instances[translationId] ??= [
      { kind: 'identity', value: translationId },
      { kind: 'concept', value: 'cdd.translation' },
      { kind: 'language', value: `cdd.language:${language}` },
      { kind: 'value', value: source },
    ]
  }
}

const TEXT_KINDS = new Set(['definition', 'description', 'details', 'purpose'])

// The authored ontology keeps prose literal for readability. In the editor it
// becomes Text with a translation in the source language, so a later edit is
// scoped to the selected language rather than overwriting another translation.
function localizeText(instances: Record<Identity, Instance>): void {
  for (const [identity, instance] of Object.entries(instances)) {
    for (const property of instance) {
      if (!TEXT_KINDS.has(property.kind) || Array.isArray(property.value) || property.value.startsWith('cdd.text:')) continue
      const source = property.value
      const language = /[\u0400-\u04ff]/.test(source) ? 'ru' : 'en'
      const textId = `cdd.text:${identity}:${property.kind}`
      const translationId = `${textId}:translation:${language}`
      property.value = textId
      instances[textId] ??= [
        { kind: 'identity', value: textId },
        { kind: 'concept', value: 'cdd.text' },
        { kind: 'translations', value: [translationId] },
      ]
      instances[translationId] ??= [
        { kind: 'identity', value: translationId },
        { kind: 'concept', value: 'cdd.translation' },
        { kind: 'language', value: `cdd.language:${language}` },
        { kind: 'value', value: source },
      ]
    }
  }
}

// A CDD-authored ontology file: one per concept, exporting that concept's own
// instance plus any instances it owns (attributes, transactions, ...) as a
// flat array. Each entry carries its own `identity` property, which becomes
// its key in the assembled Ontology.
export type OntologyModule = Instance[]

function mergeProperties(existing: Instance, incoming: Instance): Instance {
  const merged = [...existing]
  for (const property of incoming) {
    const index = merged.findIndex((candidate) => candidate.kind === property.kind)
    if (index < 0) {
      merged.push(property)
      continue
    }
    const previous = merged[index] as Property
    if (Array.isArray(previous.value) && Array.isArray(property.value)) {
      merged[index] = { ...property, value: [...new Set([...previous.value, ...property.value])] }
      continue
    }
    merged[index] = property
  }
  return merged
}

/**
 * Assemble an Ontology from a glob-imported module map (as produced by
 * `import.meta.glob('<dir>/**\/*.ts', { eager: true })`). Every module's
 * default export is expected to be an OntologyModule; entries missing an
 * `identity` property are skipped.
 */
export function loadOntology(
  modules: Record<string, { default: OntologyModule }>,
  root: Identity,
): Ontology {
  const instances: Record<Identity, Instance> = {}
  for (const mod of Object.values(modules)) {
    for (const instance of mod.default) {
      const id = instanceIdentity(instance)
      if (!id) continue
      instances[id] = instances[id] ? mergeProperties(instances[id], instance) : instance
    }
  }
  localizeNames(instances)
  localizeText(instances)
  return { root, instances }
}
