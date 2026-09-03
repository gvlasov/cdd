<script setup lang="ts">
import { computed } from 'vue'
import type { Property } from '@/concepts/properties/Property'
import type { Concept } from '@/concepts/concepts/Concept'
import { conceptName } from '@/concepts/concepts/Concept'

// The slug draws only when the concept has no name — otherwise the name
// renderer shows the slug beside the title and this stays silent.
const props = defineProps<{ property: Property; concept: Concept }>()

const hasName = computed(() => conceptName(props.concept) !== undefined)
</script>

<template>
  <code v-if="!hasName" class="text-caption text-disabled">{{ property.value }}</code>
</template>
