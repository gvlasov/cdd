<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { Ontology } from './Ontology'
import type { Identity } from '@/concepts/identity/Identity'
import { provideOntology } from './useOntology'
import ConceptView from '@/concepts/concept-view/ConceptView.vue'

const props = defineProps<{
  /** The ontology to display. */
  modelValue: Ontology
  /** Identity of the concept to show first. Defaults to the first concept. */
  rootId?: Identity
  /** Reserved: when true, editing controls become available (next iteration). */
  editable?: boolean
}>()

// Declared now so embedders can wire two-way binding before edit lands.
defineEmits<{
  (e: 'update:modelValue', value: Ontology): void
}>()

const firstId = computed(
  () => props.rootId ?? props.modelValue.root ?? Object.keys(props.modelValue.instances)[0] ?? '',
)
const currentId = ref<Identity>(firstId.value)

watch(
  () => [props.rootId, props.modelValue] as const,
  () => {
    if (!(currentId.value in props.modelValue.instances)) {
      currentId.value = firstId.value
    }
  },
)

function navigate(identity: Identity) {
  currentId.value = identity
}

provideOntology({ ontology: () => props.modelValue, navigate })
</script>

<template>
  <div class="ontology-editor">
    <ConceptView :ontology="modelValue" :concept-id="currentId" />
  </div>
</template>

<style scoped>
.ontology-editor {
  width: 100%;
  height: 100%;
  min-height: 400px;
}
</style>
