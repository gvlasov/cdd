<script setup lang="ts">
import { computed } from 'vue'
import type { Identity } from '@/concepts/identity/Identity'
import type { Property } from '@/concepts/properties/Property'
import { useOntology } from '@/concepts/ontology/useOntology'
import { propertyKind } from '@/concepts/properties/kinds/property-kinds'
import { setPropertyValue } from './editOntology'
import { propertyValueKind } from './PropertyValueKind'

// Edits one property of the given instance. If the property kind ships its own
// `edit` component, that is used; otherwise the value kind picks a generic input.
const props = defineProps<{ instanceId: Identity; property: Property }>()

const { apply, renameSlug, conceptOptions } = useOntology()

const kindEditor = computed(() => propertyKind(props.property.kind)?.edit)
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
  <component
    :is="kindEditor"
    v-if="kindEditor"
    :instance-id="instanceId"
    :property="property"
  />

  <v-text-field
    v-else-if="valueKind === 'literal'"
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
