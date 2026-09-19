<script setup lang="ts">
import { computed } from 'vue'
import type { Property } from '@/concepts/properties/Property'
import ConceptText from '@/concepts/concept-links/ConceptText.vue'

const props = defineProps<{ property: Property }>()

const text = computed(() =>
  Array.isArray(props.property.value) ? props.property.value.join('\n') : props.property.value,
)
</script>

<template>
  <section>
    <h3 class="text-left mb-1">Details</h3>
    <div class="text-body-1 text-medium-emphasis text-left details"><ConceptText :text="text" /></div>
  </section>
</template>

<style scoped>
.details {
  white-space: pre-wrap;
}
</style>
