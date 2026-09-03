<script setup lang="ts">
import { computed } from 'vue'
import type { Attribute } from '@/concepts/attributes/Attribute'
import type { Concept } from '@/concepts/concepts/Concept'
import { useOntology } from '@/concepts/ontology/useOntology'

// A `concept` attribute references another concept by identity — this is what
// the concept "consists of". Rendered as a navigable chip.
const props = defineProps<{ attribute: Attribute; concept: Concept }>()
const { conceptLabel, navigate } = useOntology()

const label = computed(() => conceptLabel(props.attribute.value) ?? props.attribute.value)
</script>

<template>
  <v-chip
    color="attribute"
    variant="outlined"
    size="large"
    link
    @click="navigate(attribute.value)"
  >
    {{ label }}
  </v-chip>
</template>
