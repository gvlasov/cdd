<script setup lang="ts">
import type { Attribute } from '@/concepts/attributes/Attribute'
import type { Concept } from '@/concepts/concepts/Concept'

defineProps<{ attribute: Attribute; concept: Concept }>()
</script>

<template>
  <p class="text-body-1 text-medium-emphasis text-center mx-auto" style="max-width: 60ch">
    {{ attribute.value }}
  </p>
</template>
