<script setup lang="ts">
import { computed } from 'vue'
import type { Identity } from '@/concepts/identity/Identity'
import type { PropertyKindName, Property } from '@/concepts/properties/Property'
import type { Ontology } from '@/concepts/ontology/Ontology'
import { conceptOf } from '@/concepts/ontology/Ontology'
import { addProperty, removeProperty } from './editOntology'
import { typeAttributes } from './instanceForm'
import { useOntology } from '@/concepts/ontology/useOntology'
import PropertyEditor from './PropertyEditor.vue'

// Edits one instance, driven by its type's attributes:
//  - required attributes render as inputs from the start
//  - optional attributes appear via a centered "+attribute" button bar
//  - the instance's own extra properties (not in the type) are shown too, removable
const props = defineProps<{ ontology: Ontology; conceptId: Identity }>()

const { apply, conceptLabel } = useOntology()

const instance = computed(() => conceptOf(props.ontology, props.conceptId))
const attrs = computed(() => (instance.value ? typeAttributes(props.ontology, instance.value) : []))

const present = computed(() => new Set((instance.value ?? []).map((p) => p.kind)))

// Rows to render: required type attributes (always) + any present property
// except identity/concept. Ordered by the type's attribute order, extras last.
const rows = computed(() => {
  const order = attrs.value.map((a) => a.kind)
  const kinds = new Set<PropertyKindName>()
  for (const a of attrs.value) if (a.required || present.value.has(a.kind)) kinds.add(a.kind)
  for (const p of instance.value ?? []) {
    if (p.kind !== 'identity' && p.kind !== 'concept') kinds.add(p.kind)
  }
  return [...kinds].sort((a, b) => {
    const ia = order.indexOf(a)
    const ib = order.indexOf(b)
    return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib)
  })
})

function propertyFor(kind: PropertyKindName): Property {
  return (instance.value ?? []).find((p) => p.kind === kind) ?? { kind, value: '' }
}

// Optional type attributes not yet present.
const addable = computed(() =>
  attrs.value.filter((a) => !a.required && !present.value.has(a.kind)),
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
    <v-card-text v-if="instance" class="d-flex flex-column ga-4">
      <div v-for="kind in rows" :key="kind" class="d-flex ga-2 align-start">
        <PropertyEditor
          class="flex-grow-1"
          :instance-id="conceptId"
          :property="propertyFor(kind)"
        />
        <v-btn
          icon="mdi-close"
          variant="text"
          size="small"
          density="comfortable"
          :aria-label="`remove ${kind}`"
          @click="remove(kind)"
        />
      </div>

      <div v-if="addable.length" class="d-flex flex-wrap ga-2 pt-2 justify-center">
        <v-btn
          v-for="a in addable"
          :key="a.attribute"
          prepend-icon="mdi-plus"
          variant="tonal"
          size="small"
          @click="add(a.kind)"
        >
          {{ conceptLabel(a.attribute) ?? a.kind }}
        </v-btn>
      </div>
    </v-card-text>
    <v-card-text v-else class="text-medium-emphasis">
      Unknown concept: {{ conceptId }}
    </v-card-text>
  </v-card>
</template>
