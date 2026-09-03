<script setup lang="ts">
import { computed } from 'vue'
import type { Property } from '@/concepts/properties/Property'
import type { Concept } from '@/concepts/concepts/Concept'
import { useOntology } from '@/concepts/ontology/useOntology'

// A `concept` property references another concept by identity — this is what
// the concept "consists of". Rendered as a navigable chip.
const props = defineProps<{ property: Property; concept: Concept }>()
const { conceptLabel, navigate } = useOntology()

const target = computed(() => String(props.property.value))
const label = computed(() => conceptLabel(target.value) ?? target.value)
</script>

<template>
  <v-chip
    color="attribute"
    variant="outlined"
    size="large"
    link
    @click="navigate(target)"
  >
    {{ label }}
  </v-chip>
</template>
