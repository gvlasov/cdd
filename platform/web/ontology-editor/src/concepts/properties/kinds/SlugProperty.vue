<script setup lang="ts">
import { computed } from 'vue'
import type { Property } from '@/concepts/properties/Property'
import type { Instance } from '@/concepts/instances/Instance'
import { instanceName } from '@/concepts/instances/Instance'

// The slug draws only when the instance has no name — otherwise the name
// renderer shows the slug beside the title and this stays silent.
const props = defineProps<{ property: Property; instance: Instance }>()

const hasName = computed(() => instanceName(props.instance) !== undefined)
</script>

<template>
  <code v-if="!hasName" class="text-caption text-disabled">{{ property.value }}</code>
</template>
