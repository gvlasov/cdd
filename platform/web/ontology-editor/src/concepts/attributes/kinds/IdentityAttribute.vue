<script setup lang="ts">
import type { Attribute } from '@/concepts/attributes/Attribute'

// The identity is drawn small and unobtrusive — it is the concept's handle,
// not its headline.
defineProps<{ attribute: Attribute }>()
</script>

<template>
  <code class="text-caption text-disabled">{{ attribute.value }}</code>
</template>
