<script setup lang="ts">
import { computed } from 'vue'
import type { Property } from '@/concepts/properties/Property'
import type { Instance } from '@/concepts/instances/Instance'
import ConceptText from '@/concepts/concept-links/ConceptText.vue'

const props = defineProps<{ property: Property; instance: Instance }>()

const text = computed(() =>
  Array.isArray(props.property.value) ? props.property.value.join(' ') : props.property.value,
)
</script>

<template>
  <p class="text-body-1 text-medium-emphasis text-left mx-auto" style="max-width: 60ch">
    <ConceptText :text="text" />
  </p>
</template>
