<script setup lang="ts">
import { computed } from 'vue'
import type { Ontology } from '@/concepts/ontology/Ontology'
import { nodeById, attributesOf, parentsOf } from '@/concepts/ontology/Ontology'

const props = defineProps<{
  ontology: Ontology
  conceptId: string
}>()

const emit = defineEmits<{
  (e: 'navigate', conceptId: string): void
}>()

const concept = computed(() => nodeById(props.ontology, props.conceptId))
const parents = computed(() => parentsOf(props.ontology, props.conceptId))
const attributes = computed(() => attributesOf(props.ontology, props.conceptId))

function label(id: string): string {
  return nodeById(props.ontology, id)?.name ?? id
}
</script>

<template>
  <div class="concept-view">
    <nav class="concept-view__parents" aria-label="Parent concepts">
      <button
        v-for="edge in parents"
        :key="edge.id"
        type="button"
        class="concept-view__chip"
        @click="emit('navigate', edge.from)"
      >
        ↑ {{ label(edge.from) }}
      </button>
      <span v-if="!parents.length" class="concept-view__empty">no parent concepts</span>
    </nav>

    <article class="concept-view__body">
      <template v-if="concept">
        <h1 v-if="concept.name" class="concept-view__name">{{ concept.name }}</h1>
        <p v-if="concept.description" class="concept-view__description">
          {{ concept.description }}
        </p>
      </template>
      <p v-else class="concept-view__missing">Unknown concept: {{ conceptId }}</p>
    </article>

    <nav class="concept-view__attributes" aria-label="Attributes">
      <button
        v-for="edge in attributes"
        :key="edge.id"
        type="button"
        class="concept-view__chip"
        @click="emit('navigate', edge.to)"
      >
        {{ label(edge.to) }}
        <small v-if="edge.relation">· {{ edge.relation }}</small>
      </button>
      <span v-if="!attributes.length" class="concept-view__empty">no attributes</span>
    </nav>
  </div>
</template>

<style scoped>
.concept-view {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  height: 100%;
  font-family: system-ui, sans-serif;
}
.concept-view__parents,
.concept-view__attributes {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}
.concept-view__body {
  flex: 1 1 auto;
  overflow: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 24px;
  border: 1px solid rgb(0 0 0 / 0.12);
  border-radius: 12px;
}
.concept-view__name {
  margin: 0 0 12px;
  font-size: 2rem;
  line-height: 1.2;
}
.concept-view__description {
  margin: 0;
  font-size: 1rem;
  max-width: 60ch;
  opacity: 0.85;
}
.concept-view__missing {
  margin: 0;
  opacity: 0.6;
}
.concept-view__chip {
  padding: 6px 12px;
  border: 1px solid rgb(0 0 0 / 0.2);
  border-radius: 999px;
  background: transparent;
  font: inherit;
  cursor: pointer;
}
.concept-view__chip:hover {
  background: rgb(0 0 0 / 0.06);
}
.concept-view__chip small {
  opacity: 0.6;
}
.concept-view__empty {
  font-size: 0.85rem;
  opacity: 0.5;
}
</style>
