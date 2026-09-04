<script setup lang="ts">
import { computed } from 'vue'
import type { Property } from '@/concepts/properties/Property'
import type { Instance } from '@/concepts/instances/Instance'
import { instanceType } from '@/concepts/instances/Instance'
import { conceptOf } from '@/concepts/ontology/Ontology'
import { conceptAttributeSpecs, computeAttributeValue } from '@/concepts/attributes/Attribute'
import { useOntology } from '@/concepts/ontology/useOntology'

// `canonicalName` is a computed attribute — its value is never stored on the
// property itself, so it is derived here from the attribute's `function`
// rather than read off `property.value`.
const props = defineProps<{ property: Property; instance: Instance }>()
const { ontology } = useOntology()

const value = computed(() => {
  const typeId = instanceType(props.instance)
  const type = typeId ? conceptOf(ontology(), typeId) : undefined
  const spec = type
    ? conceptAttributeSpecs(ontology(), type).find((s) => s.slug === 'canonicalName')
    : undefined
  if (!spec?.function) return undefined
  return computeAttributeValue(spec.function, props.instance, ontology())
})
</script>

<template>
  <code v-if="value" class="text-caption text-disabled">{{ value }}</code>
</template>
