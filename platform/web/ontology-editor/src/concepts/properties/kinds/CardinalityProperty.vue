<script setup lang="ts">
import { computed } from 'vue'
import type { Property } from '@/concepts/properties/Property'
import type { Instance } from '@/concepts/instances/Instance'

const props = defineProps<{ property: Property; instance: Instance }>()
const value = computed(() =>
  Array.isArray(props.property.value) ? props.property.value.join(', ') : props.property.value,
)
</script>

<template>
  <div class="text-caption text-medium-emphasis">cardinality · {{ value }}</div>
</template>
