<script setup lang="ts">
import { computed } from 'vue'
import type { Property } from '@/concepts/properties/Property'
import type { Concept } from '@/concepts/concepts/Concept'

// The `attributes` property lists the property kinds an instance of this
// concept may have — the concept's schema for its instances.
const props = defineProps<{ property: Property; concept: Concept }>()

const attributes = computed(() =>
  Array.isArray(props.property.value) ? props.property.value : [props.property.value],
)
</script>

<template>
  <div class="text-center">
    <div class="text-overline text-medium-emphasis">attributes</div>
    <div class="d-flex flex-wrap ga-2 justify-center">
      <v-chip v-for="a in attributes" :key="a" size="small" variant="tonal">{{ a }}</v-chip>
    </div>
  </div>
</template>
