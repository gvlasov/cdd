<script setup lang="ts">
import { computed } from 'vue'
import type { Property } from '@/concepts/properties/Property'
import type { Instance } from '@/concepts/instances/Instance'
import { isConcept } from '@/concepts/concepts/Concept'
import ConceptText from '@/concepts/concept-links/ConceptText.vue'
import { textText } from '@/concepts/ontology/Ontology'
import { useOntology } from '@/concepts/ontology/useOntology'

const props = defineProps<{ property: Property; instance: Instance }>()
const { ontology, language } = useOntology()

const text = computed(() =>
  Array.isArray(props.property.value)
    ? props.property.value.join(' ')
    : textText(ontology(), props.property.value, language()) ?? props.property.value,
)
</script>

<template>
  <p class="text-body-1 text-medium-emphasis text-left">
    <ConceptText :text="text" :capitalize="isConcept(instance)" />
  </p>
</template>
