<script setup lang="ts">
import type { Attribute } from '@/concepts/attributes/Attribute'

// A slug is a compact handle. Drawn like the identity, next to it.
defineProps<{ attribute: Attribute }>()
</script>

<template>
  <code class="text-caption text-disabled">{{ attribute.value }}</code>
</template>
