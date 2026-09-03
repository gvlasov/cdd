<script setup lang="ts">
import { computed } from 'vue'
import type { Identity } from '@/concepts/identity/Identity'
import type { Property } from '@/concepts/properties/Property'
import { useOntology } from '@/concepts/ontology/useOntology'
import { setPropertyValue } from './editOntology'
import { propertyValueKind, ALL_PROPERTY_KINDS } from './PropertyValueKind'

const kindItems: string[] = [...ALL_PROPERTY_KINDS]

// Edits one property of the given instance. The value kind decides the input.
const props = defineProps<{ instanceId: Identity; property: Property }>()

const { apply, renameSlug, conceptOptions } = useOntology()

const valueKind = computed(() => propertyValueKind[props.property.kind])
const asString = computed(() => (Array.isArray(props.property.value) ? '' : props.property.value))
const asList = computed(() =>
  Array.isArray(props.property.value) ? props.property.value : [props.property.value],
)

function commit(value: Identity | Identity[]) {
  if (props.property.kind === 'slug' && typeof value === 'string') {
    renameSlug(props.instanceId, value)
    return
  }
  apply((ontology) => setPropertyValue(ontology, props.instanceId, props.property.kind, value))
}
</script>

<template>
  <v-text-field
    v-if="valueKind === 'literal'"
    :model-value="asString"
    :label="property.kind"
    variant="outlined"
    density="comfortable"
    hide-details
    @update:model-value="commit($event)"
  />

  <v-combobox
    v-else-if="valueKind === 'literal-list'"
    :model-value="asList"
    :label="property.kind"
    variant="outlined"
    density="comfortable"
    hide-details
    multiple
    chips
    closable-chips
    @update:model-value="commit($event)"
  />

  <v-autocomplete
    v-else-if="valueKind === 'concept-list'"
    :model-value="asList"
    :items="conceptOptions()"
    :label="property.kind"
    variant="outlined"
    density="comfortable"
    hide-details
    multiple
    chips
    closable-chips
    @update:model-value="commit($event)"
  />

  <v-select
    v-else-if="valueKind === 'kind-list'"
    :model-value="asList"
    :items="kindItems"
    :label="property.kind"
    variant="outlined"
    density="comfortable"
    hide-details
    multiple
    chips
    closable-chips
    @update:model-value="commit(($event ?? []) as string[])"
  />

  <v-text-field
    v-else
    :model-value="asString"
    :label="property.kind"
    variant="outlined"
    density="comfortable"
    hide-details
    readonly
    disabled
  />
</template>
