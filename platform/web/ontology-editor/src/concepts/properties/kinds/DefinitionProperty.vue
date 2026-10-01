<script setup lang="ts">
import { computed } from 'vue'
import type { Property } from '@/concepts/properties/Property'
import type { Instance } from '@/concepts/instances/Instance'
import { isConcept } from '@/concepts/concepts/Concept'
import ConceptText from '@/concepts/concept-links/ConceptText.vue'
import { firstOfKind } from '@/concepts/properties/Property'
import { nameSynonymTexts, textText } from '@/concepts/ontology/Ontology'
import { useOntology } from '@/concepts/ontology/useOntology'

const props = defineProps<{ property: Property; instance: Instance }>()
const { ontology, language } = useOntology()

const text = computed(() =>
  Array.isArray(props.property.value)
    ? props.property.value.join(' ')
    : textText(ontology(), props.property.value, language()) ?? props.property.value,
)

const synonyms = computed(() => {
  const name = firstOfKind(props.instance, 'name')
  if (!name || Array.isArray(name.value)) return []
  return nameSynonymTexts(ontology(), name.value, language())
})

function ucfirst(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1)
}
</script>

<template>
  <p class="text-body-1 text-medium-emphasis text-left">
    <ConceptText :text="text" :capitalize="isConcept(instance)" />
  </p>
  <p v-if="synonyms.length === 2" class="text-body-2 text-medium-emphasis text-left">
    Synonym: {{ ucfirst(synonyms[1]) }}
  </p>
  <p v-else-if="synonyms.length > 2" class="text-body-2 text-medium-emphasis text-left">
    Synonyms: {{ synonyms.map(ucfirst).join(', ') }}
  </p>
</template>
