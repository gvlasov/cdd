<script setup lang="ts">
import type { Property } from '@/concepts/properties/Property'
import type { Concept } from '@/concepts/concepts/Concept'

defineProps<{ property: Property; concept: Concept }>()
</script>

<template>
  <p class="text-body-1 text-medium-emphasis text-center mx-auto" style="max-width: 60ch">
    {{ property.value }}
  </p>
</template>
