<script setup lang="ts">
import { computed } from 'vue'
import type { Attribute } from '@/concepts/attributes/Attribute'
import type { Concept } from '@/concepts/concepts/Concept'
import { conceptName } from '@/concepts/concepts/Concept'

// The slug draws only when the concept has no name — otherwise the name
// renderer shows the slug beside the title and this stays silent.
const props = defineProps<{ attribute: Attribute; concept: Concept }>()

const hasName = computed(() => conceptName(props.concept) !== undefined)
</script>

<template>
  <code v-if="!hasName" class="text-caption text-disabled">{{ attribute.value }}</code>
</template>
