<script setup lang="ts">
import { computed, ref } from 'vue'
import type { AvailableOntology, OntologySource } from './OntologyRepository'
const props = defineProps<{ ontologies: AvailableOntology[] }>()
const emit = defineEmits<{
  (e: 'open', ontology: AvailableOntology): void
  (e: 'open-in-new-tab', ontology: AvailableOntology): void
  (e: 'select-file'): void
}>()
const source = ref<OntologySource | 'all'>('all')
const filters: Array<{ value: OntologySource | 'all'; title: string }> = [{ value: 'all', title: 'All' }, { value: 'source-code', title: 'Source code' }, { value: 'file', title: 'Files' }, { value: 'online', title: 'Online' }, { value: 'database', title: 'Database' }]
const filteredOntologies = computed(() => source.value === 'all' ? props.ontologies : props.ontologies.filter((ontology) => ontology.source === source.value))
const sourceLabel: Record<OntologySource, string> = { 'source-code': 'Source code', file: 'File', online: 'Online', database: 'Database' }
</script>
<template><section class="ontologies-page"><div class="page-heading"><div><h1>Ontologies</h1></div><v-btn prepend-icon="mdi-folder-open-outline" variant="tonal" @click="emit('select-file')">From file</v-btn></div><div class="filters" aria-label="Filter ontologies"><v-btn v-for="filter in filters" :key="filter.value" :variant="source === filter.value ? 'flat' : 'text'" size="small" @click="source = filter.value">{{ filter.title }}</v-btn></div><v-list lines="two" class="ontology-list"><v-list-item v-for="ontology in filteredOntologies" :key="ontology.id" :title="ontology.name" :subtitle="ontology.description ?? sourceLabel[ontology.source]" prepend-icon="mdi-vector-triangle" class="ontology-list-item" @click="emit('open', ontology)" @auxclick="($event.button === 1) && emit('open-in-new-tab', ontology)" /><v-list-item v-if="!filteredOntologies.length" title="No ontologies in this repository" /></v-list></section></template>
<style scoped>.ontologies-page { max-width: 70rem; margin: 0 auto; padding: clamp(2rem, 6vw, 5rem); }.page-heading { display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; }h1 { margin: 0; font-family: Georgia, 'Times New Roman', serif; font-size: clamp(2.5rem, 6vw, 4rem); }p { margin-top: .5rem; color: rgb(var(--v-theme-on-surface-variant)); }.filters { display: flex; flex-wrap: wrap; gap: .5rem; margin: 2rem 0 1rem; }.ontology-list { border: 1px solid rgb(var(--v-theme-outline-variant)); border-radius: .75rem; }.ontology-list-item { padding-inline-start: 1.25rem; }</style>
