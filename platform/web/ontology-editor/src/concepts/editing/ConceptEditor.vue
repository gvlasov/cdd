<script setup lang="ts">
import { computed } from 'vue'
import type { Identity } from '@/concepts/identity/Identity'
import type { PropertyKindName } from '@/concepts/properties/Property'
import type { Ontology } from '@/concepts/ontology/Ontology'
import { conceptOf } from '@/concepts/ontology/Ontology'
import { propertyKind } from '@/concepts/properties/kinds/property-kinds'
import { ALL_PROPERTY_KINDS } from './PropertyValueKind'
import { addProperty, removeProperty } from './editOntology'
import { useOntology } from '@/concepts/ontology/useOntology'
import PropertyEditor from './PropertyEditor.vue'

// Edits the currently open concept: one editor per existing property, ordered
// by property-kind position, each removable. A "+kind" button bar below adds
// any property kind the concept doesn't have yet.
const props = defineProps<{ ontology: Ontology; conceptId: Identity }>()

const { apply } = useOntology()

const concept = computed(() => conceptOf(props.ontology, props.conceptId))

const editable = computed(() =>
  [...(concept.value ?? [])]
    .map((property, i) => ({ property, i, position: propertyKind(property.kind)?.position ?? 99 }))
    .filter((x) => x.property.kind !== 'identity')
    .sort((a, b) => a.position - b.position || a.i - b.i),
)

const present = computed(() => new Set((concept.value ?? []).map((p) => p.kind)))
const addable = computed(() =>
  ALL_PROPERTY_KINDS.filter((k) => k !== 'identity' && !present.value.has(k)),
)

function add(kind: PropertyKindName) {
  apply((o) => addProperty(o, props.conceptId, kind))
}
function remove(kind: PropertyKindName) {
  apply((o) => removeProperty(o, props.conceptId, kind))
}
</script>

<template>
  <v-card variant="outlined" class="flex-grow-1 overflow-auto">
    <v-card-text v-if="concept" class="d-flex flex-column ga-4">
      <div v-for="entry in editable" :key="entry.property.kind" class="d-flex ga-2 align-start">
        <PropertyEditor
          class="flex-grow-1"
          :instance-id="conceptId"
          :property="entry.property"
        />
        <v-btn
          icon="mdi-close"
          variant="text"
          size="small"
          density="comfortable"
          :aria-label="`remove ${entry.property.kind}`"
          @click="remove(entry.property.kind)"
        />
      </div>

      <div v-if="addable.length" class="d-flex flex-wrap ga-2 pt-2">
        <v-btn
          v-for="kind in addable"
          :key="kind"
          prepend-icon="mdi-plus"
          variant="tonal"
          size="small"
          @click="add(kind)"
        >
          {{ kind }}
        </v-btn>
      </div>
    </v-card-text>
    <v-card-text v-else class="text-medium-emphasis">
      Unknown concept: {{ conceptId }}
    </v-card-text>
  </v-card>
</template>
