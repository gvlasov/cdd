<script setup lang="ts">
import type { Identity } from '@/concepts/identity/Identity'
import type { Property } from '@/concepts/properties/Property'
import { useOntology } from '@/concepts/ontology/useOntology'
import { setPropertyValue } from '@/concepts/editing/editOntology'

// `effect` is JavaScript source — edited as a monospace textarea.
const props = defineProps<{ instanceId: Identity; property: Property }>()

const { apply } = useOntology()
const text = Array.isArray(props.property.value)
  ? props.property.value.join('\n')
  : props.property.value

function commit(value: string) {
  apply((ontology) => setPropertyValue(ontology, props.instanceId, 'effect', value))
}
</script>

<template>
  <v-textarea
    :model-value="text"
    label="effect"
    variant="outlined"
    density="comfortable"
    rows="4"
    auto-grow
    hide-details
    class="effect-source"
    @update:model-value="commit($event)"
  />
</template>

<style scoped>
.effect-source :deep(textarea) {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.85rem;
}
</style>
