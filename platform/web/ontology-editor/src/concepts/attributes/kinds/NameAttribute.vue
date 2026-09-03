<script setup lang="ts">
import type { Attribute } from '@/concepts/attributes/Attribute'

// `name` renders as the concept's title. Its value identity is a literal string.
defineProps<{ attribute: Attribute }>()
</script>

<template>
  <h1 class="text-h3 text-center mb-2">{{ attribute.value }}</h1>
</template>
