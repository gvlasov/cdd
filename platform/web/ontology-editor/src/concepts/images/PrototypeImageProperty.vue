<script setup lang="ts">
import { computed } from 'vue'
import type { Instance } from '@/concepts/instances/Instance'
import type { Property } from '@/concepts/properties/Property'
import { firstOfKind } from '@/concepts/properties/Property'
import { instanceName } from '@/concepts/instances/Instance'
import { useOntology } from '@/concepts/ontology/useOntology'

const props = defineProps<{ property: Property; instance: Instance }>()
const { ontology } = useOntology()

function literal(property: Property | undefined): string | undefined {
  if (!property) return undefined
  return Array.isArray(property.value) ? property.value[0] : property.value
}

const image = computed(() => {
  const imageId = literal(props.property)
  return imageId ? ontology().instances[imageId] : undefined
})

// URL wins when both sources are supplied, so an embedded blob remains a
// portable fallback for an image whose remote URL cannot be reached.
const source = computed(() => literal(firstOfKind(image.value ?? [], 'url')) ?? literal(firstOfKind(image.value ?? [], 'blob')))
const alt = computed(() => (image.value ? instanceName(image.value) ?? 'Prototype image' : 'Prototype image'))
</script>

<template>
  <img
    v-if="source"
    :src="source"
    :alt="alt"
    class="prototype-image"
  />
</template>

<style scoped>
.prototype-image {
  display: block;
  width: 100%;
  max-height: 32rem;
  object-fit: contain;
}
</style>
