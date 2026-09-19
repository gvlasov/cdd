<script setup lang="ts">
import { computed } from 'vue'
import type { Identity } from '@/concepts/identity/Identity'
import { conceptOf } from '@/concepts/ontology/Ontology'
import { useOntology } from '@/concepts/ontology/useOntology'
import { setPropertyValue } from '@/concepts/editing/editOntology'
import { spawnValue, removeValue } from '@/concepts/attributes/spawnValue'
import SchemeProperty from './SchemeProperty.vue'

// The compact editor for a Scheme value. It deliberately exposes only the
// three semantic element kinds rather than a free-form canvas tool palette.
const props = defineProps<{ ownerId: Identity; slug: string; schemeId?: Identity }>()
const { ontology, apply, instanceOptions } = useOntology()

const scheme = computed(() => props.schemeId ? conceptOf(ontology(), props.schemeId) : undefined)
function values(kind: string): Identity[] {
  const value = scheme.value?.find((property) => property.kind === kind)?.value
  return Array.isArray(value) ? value : value ? [value] : []
}
const boxes = computed(() => values('boxes'))
const edges = computed(() => values('edges'))
const texts = computed(() => values('texts'))
const endpoints = computed(() => [...boxes.value, ...texts.value].map((id) => ({ value: id, title: id })))

function text(id: Identity, kind: string): string {
  const value = conceptOf(ontology(), id)?.find((property) => property.kind === kind)?.value
  return Array.isArray(value) ? value[0] ?? '' : value ?? ''
}
function set(id: Identity, kind: string, value: string | null) {
  apply((current) => setPropertyValue(current, id, kind as never, value ?? ''))
}
function createScheme() {
  apply((current) => spawnValue(current, props.ownerId, props.slug, 'cdd.scheme', false))
}
function add(kind: 'boxes' | 'edges' | 'texts', type: Identity) {
  if (!props.schemeId) return
  apply((current) => spawnValue(current, props.schemeId!, kind, type, true))
}
function remove(kind: 'boxes' | 'edges' | 'texts', id: Identity) {
  if (!props.schemeId) return
  apply((current) => removeValue(current, props.schemeId!, kind, id))
}
</script>

<template>
  <section class="scheme-editor">
    <div class="text-caption text-medium-emphasis mb-1">{{ slug }}</div>
    <v-btn v-if="!schemeId" prepend-icon="mdi-vector-square" variant="tonal" size="small" @click="createScheme">
      Create scheme
    </v-btn>

    <template v-else>
      <SchemeProperty :property="{ kind: 'scheme', value: schemeId }" :instance="[]" />
      <div class="d-flex flex-wrap ga-2 mt-3">
        <v-btn size="small" variant="tonal" prepend-icon="mdi-card-outline" @click="add('boxes', 'cdd.schemeBox')">Box</v-btn>
        <v-btn size="small" variant="tonal" prepend-icon="mdi-arrow-right" @click="add('edges', 'cdd.schemeEdge')">Edge</v-btn>
        <v-btn size="small" variant="tonal" prepend-icon="mdi-format-text" @click="add('texts', 'cdd.schemeText')">Text</v-btn>
      </div>

      <v-expansion-panels class="mt-3" variant="accordion">
        <v-expansion-panel v-for="id in boxes" :key="id" :title="text(id, 'content') || 'Box'">
          <v-expansion-panel-text class="d-flex flex-column ga-2">
            <v-textarea :model-value="text(id, 'content')" label="content" rows="2" auto-grow density="comfortable" hide-details @update:model-value="set(id, 'content', $event)" />
            <v-autocomplete :model-value="text(id, 'denotatum')" :items="instanceOptions()" label="denotatum" clearable density="comfortable" hide-details @update:model-value="set(id, 'denotatum', $event)" />
            <div class="d-flex ga-2"><v-text-field :model-value="text(id, 'backgroundColor')" label="background" density="comfortable" hide-details @update:model-value="set(id, 'backgroundColor', $event)" /><v-text-field :model-value="text(id, 'borderColor')" label="border" density="comfortable" hide-details @update:model-value="set(id, 'borderColor', $event)" /></div>
            <v-btn class="align-self-end" color="error" variant="text" size="small" @click="remove('boxes', id)">Remove box</v-btn>
          </v-expansion-panel-text>
        </v-expansion-panel>
        <v-expansion-panel v-for="id in edges" :key="id" :title="text(id, 'content') || 'Edge'">
          <v-expansion-panel-text class="d-flex flex-column ga-2">
            <v-autocomplete :model-value="text(id, 'source')" :items="endpoints" label="source" density="comfortable" hide-details @update:model-value="set(id, 'source', $event)" />
            <v-autocomplete :model-value="text(id, 'target')" :items="endpoints" label="target" density="comfortable" hide-details @update:model-value="set(id, 'target', $event)" />
            <v-text-field :model-value="text(id, 'content')" label="label" density="comfortable" hide-details @update:model-value="set(id, 'content', $event)" />
            <v-autocomplete :model-value="text(id, 'denotatum')" :items="instanceOptions()" label="denotatum" clearable density="comfortable" hide-details @update:model-value="set(id, 'denotatum', $event)" />
            <div class="d-flex ga-2"><v-select :model-value="text(id, 'routing') || 'straight'" :items="['straight', 'orthogonal']" label="route" density="comfortable" hide-details @update:model-value="set(id, 'routing', $event)" /><v-select :model-value="text(id, 'lineStyle') || 'solid'" :items="['solid', 'dashed', 'dotted']" label="line" density="comfortable" hide-details @update:model-value="set(id, 'lineStyle', $event)" /><v-select :model-value="text(id, 'boldness') || 'normal'" :items="['thin', 'normal', 'bold']" label="boldness" density="comfortable" hide-details @update:model-value="set(id, 'boldness', $event)" /><v-select :model-value="text(id, 'startHead') || 'none'" :items="['none', 'arrow', 'circle', 'diamond']" label="start" density="comfortable" hide-details @update:model-value="set(id, 'startHead', $event)" /><v-select :model-value="text(id, 'endHead') || 'arrow'" :items="['none', 'arrow', 'circle', 'diamond']" label="end" density="comfortable" hide-details @update:model-value="set(id, 'endHead', $event)" /></div>
            <v-btn class="align-self-end" color="error" variant="text" size="small" @click="remove('edges', id)">Remove edge</v-btn>
          </v-expansion-panel-text>
        </v-expansion-panel>
        <v-expansion-panel v-for="id in texts" :key="id" :title="text(id, 'content') || 'Text'">
          <v-expansion-panel-text class="d-flex flex-column ga-2">
            <v-text-field :model-value="text(id, 'content')" label="content" density="comfortable" hide-details @update:model-value="set(id, 'content', $event)" />
            <v-autocomplete :model-value="text(id, 'denotatum')" :items="instanceOptions()" label="denotatum" clearable density="comfortable" hide-details @update:model-value="set(id, 'denotatum', $event)" />
            <v-select :model-value="text(id, 'align') || 'center'" :items="['left', 'center', 'right']" label="alignment" density="comfortable" hide-details @update:model-value="set(id, 'align', $event)" />
            <v-btn class="align-self-end" color="error" variant="text" size="small" @click="remove('texts', id)">Remove text</v-btn>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </template>
  </section>
</template>

<style scoped>
.scheme-editor { width: 100%; }
</style>
