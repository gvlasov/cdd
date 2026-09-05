<script setup lang="ts">
import { computed } from 'vue'
import type { Instance } from './Instance'
import { isConcept } from '@/concepts/concepts/Concept'
import { instanceType } from './Instance'
import { propertyKind } from '@/concepts/properties/kinds/property-kinds'
import { conceptOf } from '@/concepts/ontology/Ontology'
import {
  conceptAttributeSpecs,
  attributeType,
  attributeUsageIds,
  soleOwningAttribute,
} from '@/concepts/attributes/Attribute'
import { instanceIdentity, instanceSlug } from './Instance'
import { useOntology } from '@/concepts/ontology/useOntology'

// The central component: renders one instance as its properties, in
// kind-position order. Equal positions keep source order. A concept's
// `attributes` are NOT drawn here — they belong below the instance, not inside.
const props = defineProps<{ instance: Instance }>()

const { ontology } = useOntology()

// When this attribute is the sole reason its type-concept exists (see
// `soleOwningAttribute`), that concept has no page of its own — its content
// properties (definition, examples, transactions, ...) are drawn here too,
// alongside the attribute's own, so the merged page carries both. Identity,
// naming, and schema properties are skipped: the attribute's own name/type
// stand in for them, and `attributes` is drawn below by ConceptView.
const MERGED_CONCEPT_SKIP = new Set(['identity', 'concept', 'slug', 'name', 'attributes'])
const mergedConceptProperties = computed(() => {
  const type = attributeType(props.instance)
  const myId = instanceIdentity(props.instance)
  if (!type || !myId || soleOwningAttribute(ontology(), type) !== myId) return []
  const concept = conceptOf(ontology(), type) ?? []
  return concept.filter((property) => !MERGED_CONCEPT_SKIP.has(property.kind))
})

// An attribute instance's own page shows its schema (name, type, cardinality)
// but not its actual values — those live scattered across whichever
// instances declare them. When the attribute's type is `cdd.example` (a list
// of described things, like `examples` or `inspirations`), synthesize an
// entry — under the attribute's own slug/kind, so it renders with that
// kind's own title (e.g. "Inspirations", not "Examples") — listing every
// value found anywhere in the ontology under this attribute's slug.
const usageEntries = computed(() => {
  if (instanceType(props.instance) !== 'cdd.attribute') return []
  if (attributeType(props.instance) !== 'cdd.example') return []
  const myId = instanceIdentity(props.instance)
  const slug = myId ? instanceSlug(props.instance) : undefined
  if (!myId || !slug) return []
  const ids = attributeUsageIds(ontology(), myId)
  return ids.length ? [{ kind: slug as never, value: ids }] : []
})

// Ground color: `attribute` for an attribute instance, `concept` when it
// declares attributes, else `instance`.
const tone = computed(() => {
  if (instanceType(props.instance) === 'cdd.attribute') return 'attribute'
  return isConcept(props.instance) ? 'concept' : 'instance'
})

// Computed attributes (see cdd.attribute's `computed`/`function`) are never
// stored on the instance, so they don't appear among its own properties —
// synthesize a property entry per computed attribute the type declares.
const computedEntries = computed(() => {
  const typeId = instanceType(props.instance)
  const type = typeId ? conceptOf(ontology(), typeId) : undefined
  if (!type) return []
  return conceptAttributeSpecs(ontology(), type)
    .filter((spec) => spec.computed)
    .map((spec) => ({ kind: spec.slug as never, value: '' }))
})

const drawn = computed(() =>
  [...props.instance, ...computedEntries.value, ...mergedConceptProperties.value, ...usageEntries.value]
    .map((property, i) => ({ property, i, kind: propertyKind(property.kind) }))
    .filter((x) => x.kind?.render && x.property.kind !== 'attributes')
    .sort((a, b) => a.kind.position - b.kind.position || a.i - b.i),
)
</script>

<template>
  <v-card
    :color="tone"
    variant="tonal"
    class="flex-grow-1 d-flex overflow-auto"
  >
    <v-card-text class="d-flex justify-center content">
      <div class="d-flex flex-column ga-4 my-auto" style="max-width: 60ch; width: 100%">
        <component
          :is="entry.kind.render"
          v-for="entry in drawn"
          :key="entry.i"
          :property="entry.property"
          :instance="instance"
        />
      </div>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.content {
  color: rgb(var(--v-theme-on-surface));
}
</style>
