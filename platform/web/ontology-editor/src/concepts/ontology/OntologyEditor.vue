<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Ontology } from './Ontology'
import ConceptView from '@/concepts/concept-view/ConceptView.vue'

const props = defineProps<{
  /** The concept graph to display. */
  modelValue: Ontology
  /** Concept to show first. Defaults to the first node. */
  rootId?: string
  /** Reserved: when true, editing controls become available (next iteration). */
  editable?: boolean
}>()

// Declared now so embedders can wire two-way binding before edit lands.
defineEmits<{
  (e: 'update:modelValue', value: Ontology): void
}>()

const currentId = ref(props.rootId ?? props.modelValue.nodes[0]?.id ?? '')

watch(
  () => [props.rootId, props.modelValue] as const,
  () => {
    const stillExists = props.modelValue.nodes.some((n) => n.id === currentId.value)
    if (!stillExists) {
      currentId.value = props.rootId ?? props.modelValue.nodes[0]?.id ?? ''
    }
  },
)

function navigate(conceptId: string) {
  currentId.value = conceptId
}
</script>

<template>
  <div class="ontology-editor">
    <ConceptView
      :ontology="modelValue"
      :concept-id="currentId"
      @navigate="navigate"
    />
  </div>
</template>

<style scoped>
.ontology-editor {
  width: 100%;
  height: 100%;
  min-height: 400px;
}
</style>
