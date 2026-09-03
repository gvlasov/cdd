<script setup lang="ts">
import type { Identity } from '@/concepts/identity/Identity'
import type { Property } from '@/concepts/properties/Property'
import { useOntology } from '@/concepts/ontology/useOntology'
import { setPropertyValue } from '@/concepts/editing/editOntology'

// `definition` (and `description`) is prose — edited as a textarea, not a
// single-line field. The kind renders its own editor.
const props = defineProps<{ instanceId: Identity; property: Property }>()

const { apply } = useOntology()

const text = Array.isArray(props.property.value) ? '' : props.property.value

function commit(value: string) {
  apply((ontology) => setPropertyValue(ontology, props.instanceId, props.property.kind, value))
}
</script>

<template>
  <v-textarea
    :model-value="text"
    :label="property.kind"
    variant="outlined"
    density="comfortable"
    rows="3"
    auto-grow
    hide-details
    @update:model-value="commit($event)"
  />
</template>
