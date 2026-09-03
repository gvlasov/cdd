<script setup lang="ts">
import type { Property } from '@/concepts/properties/Property'
import type { Instance } from '@/concepts/instances/Instance'

defineProps<{ property: Property; instance: Instance }>()
</script>

<template>
  <p class="text-body-1 text-medium-emphasis text-left mx-auto" style="max-width: 60ch">
    {{ property.value }}
  </p>
</template>
