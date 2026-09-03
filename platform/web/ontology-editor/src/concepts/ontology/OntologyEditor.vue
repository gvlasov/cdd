<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Ontology } from './Ontology'
import { nodeById, edgesOf } from './Ontology'
import OntologyGraphView from '@/concepts/graph-view/OntologyGraphView.vue'

const props = defineProps<{
  /** The concept graph to display. */
  modelValue: Ontology
  /** Reserved: when true, editing controls become available (next iteration). */
  editable?: boolean
}>()

// Declared now so embedders can wire two-way binding before edit lands.
defineEmits<{
  (e: 'update:modelValue', value: Ontology): void
}>()

const selectedId = ref<string | null>(null)
const selectedNode = computed(() =>
  selectedId.value ? nodeById(props.modelValue, selectedId.value) : undefined,
)
const selectedEdges = computed(() =>
  selectedId.value ? edgesOf(props.modelValue, selectedId.value) : [],
)

function relationText(edge: { from: string; to: string; relation: string }): string {
  const other = edge.from === selectedId.value ? edge.to : edge.from
  const dir = edge.from === selectedId.value ? '→' : '←'
  return `${dir} ${edge.relation} ${dir === '→' ? '' : 'from '}${nodeById(props.modelValue, other)?.name ?? other}`
}
</script>

<template>
  <div class="ontology-editor">
    <div class="ontology-editor__canvas">
      <OntologyGraphView :ontology="modelValue" @select-node="selectedId = $event" />
    </div>

    <aside class="ontology-editor__panel">
      <template v-if="selectedNode">
        <h3>{{ selectedNode.name }}</h3>
        <p v-if="selectedNode.kind" class="ontology-editor__kind">{{ selectedNode.kind }}</p>
        <p v-if="selectedNode.description">{{ selectedNode.description }}</p>
        <ul v-if="selectedEdges.length">
          <li v-for="edge in selectedEdges" :key="edge.id">{{ relationText(edge) }}</li>
        </ul>
      </template>
      <p v-else class="ontology-editor__hint">Select a concept to inspect it.</p>
    </aside>
  </div>
</template>

<style scoped>
.ontology-editor {
  display: flex;
  gap: 16px;
  width: 100%;
  height: 100%;
  min-height: 400px;
}
.ontology-editor__canvas {
  flex: 1 1 auto;
  min-width: 0;
  overflow: auto;
  border: 1px solid rgb(0 0 0 / 0.12);
  border-radius: 8px;
}
.ontology-editor__panel {
  flex: 0 0 260px;
  overflow: auto;
  padding: 12px 16px;
  border: 1px solid rgb(0 0 0 / 0.12);
  border-radius: 8px;
  font-family: system-ui, sans-serif;
  font-size: 14px;
}
.ontology-editor__panel h3 {
  margin: 0 0 4px;
}
.ontology-editor__kind {
  margin: 0 0 8px;
  opacity: 0.6;
  font-size: 12px;
}
.ontology-editor__hint {
  opacity: 0.6;
}
</style>
