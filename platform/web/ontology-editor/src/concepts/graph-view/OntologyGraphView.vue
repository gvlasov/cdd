<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Ontology } from '@/concepts/ontology/Ontology'
import { circularLayout } from './layout'

const props = defineProps<{
  ontology: Ontology
}>()

const emit = defineEmits<{
  (e: 'select-node', id: string): void
}>()

const selected = ref<string | null>(null)
const layout = computed(() => circularLayout(props.ontology))

function pos(id: string) {
  return layout.value.positions[id] ?? { x: 0, y: 0 }
}

function midpoint(fromId: string, toId: string) {
  const a = pos(fromId)
  const b = pos(toId)
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }
}

function onNodeClick(id: string) {
  selected.value = id
  emit('select-node', id)
}
</script>

<template>
  <svg
    class="ontology-graph-view"
    :viewBox="`0 0 ${layout.width} ${layout.height}`"
    role="img"
    aria-label="Ontology concept graph"
  >
    <defs>
      <marker
        id="oge-arrow"
        viewBox="0 0 10 10"
        refX="9"
        refY="5"
        markerWidth="7"
        markerHeight="7"
        orient="auto-start-reverse"
      >
        <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
      </marker>
    </defs>

    <g class="edges">
      <template v-for="edge in ontology.edges" :key="edge.id">
        <line
          :x1="pos(edge.from).x"
          :y1="pos(edge.from).y"
          :x2="pos(edge.to).x"
          :y2="pos(edge.to).y"
          stroke="currentColor"
          stroke-width="1.5"
          marker-end="url(#oge-arrow)"
          opacity="0.5"
        />
        <text
          :x="midpoint(edge.from, edge.to).x"
          :y="midpoint(edge.from, edge.to).y"
          text-anchor="middle"
          class="edge-label"
        >
          {{ edge.relation }}
        </text>
      </template>
    </g>

    <g class="nodes">
      <g
        v-for="node in ontology.nodes"
        :key="node.id"
        :transform="`translate(${pos(node.id).x}, ${pos(node.id).y})`"
        class="node"
        :class="{ 'is-selected': selected === node.id }"
        tabindex="0"
        role="button"
        :aria-label="`Concept ${node.name}`"
        @click="onNodeClick(node.id)"
        @keydown.enter="onNodeClick(node.id)"
        @keydown.space.prevent="onNodeClick(node.id)"
      >
        <circle r="34" />
        <text text-anchor="middle" dy="-2" class="node-name">{{ node.name }}</text>
        <text v-if="node.kind" text-anchor="middle" dy="14" class="node-kind">
          {{ node.kind }}
        </text>
      </g>
    </g>
  </svg>
</template>

<style scoped>
.ontology-graph-view {
  width: 100%;
  height: 100%;
  color: rgb(var(--v-theme-on-surface, 30 30 30));
  font-family: system-ui, sans-serif;
}
.edge-label {
  font-size: 11px;
  fill: currentColor;
  opacity: 0.7;
}
.node {
  cursor: pointer;
  outline: none;
}
.node circle {
  fill: rgb(var(--v-theme-surface, 255 255 255));
  stroke: currentColor;
  stroke-width: 1.5;
  transition: fill 0.15s ease;
}
.node:hover circle,
.node:focus circle {
  fill: rgb(var(--v-theme-primary, 25 118 210) / 0.12);
}
.node.is-selected circle {
  stroke-width: 3;
  fill: rgb(var(--v-theme-primary, 25 118 210) / 0.2);
}
.node-name {
  font-size: 12px;
  font-weight: 600;
  fill: currentColor;
}
.node-kind {
  font-size: 10px;
  fill: currentColor;
  opacity: 0.6;
}
</style>
