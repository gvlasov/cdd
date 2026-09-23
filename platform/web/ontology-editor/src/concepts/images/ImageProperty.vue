<script setup lang="ts">
import { computed } from 'vue'
import type { Instance } from '@/concepts/instances/Instance'
import type { Property } from '@/concepts/properties/Property'
import { useOntology } from '@/concepts/ontology/useOntology'
import { imageSource, imageAlt } from './Image'

// Draws a property whose value is one or more `cdd.image` instances — the
// predefined `prototypeImage`, or any attribute typed `cdd.image`.
const props = defineProps<{ property: Property; instance: Instance }>()
const { ontology } = useOntology()

const images = computed(() => {
  const ids = Array.isArray(props.property.value) ? props.property.value : [props.property.value]
  return ids
    .map((id) => ontology().instances[id])
    .filter((image): image is Instance => !!image && !!imageSource(image))
})
</script>

<template>
  <img
    v-for="(image, i) in images"
    :key="i"
    :src="imageSource(image)"
    :alt="imageAlt(image)"
    class="image-property"
  />
</template>

<style scoped>
.image-property {
  display: block;
  width: 100%;
  max-height: 32rem;
  object-fit: contain;
}
</style>
