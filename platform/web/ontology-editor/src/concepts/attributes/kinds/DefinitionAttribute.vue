<script setup lang="ts">
import type { Attribute } from '@/concepts/attributes/Attribute'

defineProps<{ attribute: Attribute }>()
</script>

<template>
  <p class="text-body-1 text-medium-emphasis text-center mx-auto" style="max-width: 60ch">
    {{ attribute.value }}
  </p>
</template>
