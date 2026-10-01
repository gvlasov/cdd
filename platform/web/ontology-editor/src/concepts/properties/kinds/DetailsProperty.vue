<script setup lang="ts">
import { computed } from 'vue'
import type { Property } from '@/concepts/properties/Property'
import type { Instance } from '@/concepts/instances/Instance'
import ConceptText from '@/concepts/concept-links/ConceptText.vue'
import { textText } from '@/concepts/ontology/Ontology'
import { useOntology } from '@/concepts/ontology/useOntology'
import { propertyLabel } from '@/concepts/attributes/Attribute'

const props = defineProps<{ property: Property; instance: Instance }>()
const { ontology, language } = useOntology()
const title = computed(() => propertyLabel(ontology(), props.instance, props.property.kind, language()))

const text = computed(() =>
  Array.isArray(props.property.value)
    ? props.property.value.join('\n')
    : textText(ontology(), props.property.value, language()) ?? props.property.value,
)
</script>

<template>
  <section>
    <h3 class="text-left mb-1">{{ title }}</h3>
    <div class="text-body-1 text-medium-emphasis text-left details"><ConceptText :text="text" /></div>
  </section>
</template>

<style scoped>
.details {
  white-space: pre-wrap;
}
</style>
