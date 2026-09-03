<script setup lang="ts">
import { computed } from 'vue'
import type { Identity } from '@/concepts/identity/Identity'
import type { Instance } from '@/concepts/instances/Instance'
import { conceptOf } from '@/concepts/ontology/Ontology'
import { useOntology } from '@/concepts/ontology/useOntology'
import { setPropertyValue } from '@/concepts/editing/editOntology'
import { spawnValue, removeValue } from './spawnValue'
import { isLeafConcept, isList, isRequired, CARDINALITIES, type AttributeSpec } from './Attribute'
import InstanceForm from '@/concepts/editing/InstanceForm.vue'

// Edits one attribute's value(s) on an owner instance.
//  - leaf type            → a plain text field on the owner's `slug` property
//  - structured type      → a nested InstanceForm per value instance
//  - list cardinality     → repeat, with add / remove
const props = withDefaults(
  defineProps<{ ownerId: Identity; spec: AttributeSpec; ancestors?: Identity[] }>(),
  { ancestors: () => [] },
)

const { ontology, apply, conceptLabel } = useOntology()

const owner = computed(() => conceptOf(ontology(), props.ownerId))
const leaf = computed(() => isLeafConcept(ontology(), props.spec.type))
const list = computed(() => isList(props.spec.cardinality))
const cardinalityValued = computed(() => props.spec.type === 'cdd.cardinality')
const CARDS: string[] = [...CARDINALITIES]

const raw = computed(() => {
  const p = (owner.value ?? []).find((x) => x.kind === props.spec.slug)
  return p?.value
})
const literalValue = computed(() => (Array.isArray(raw.value) ? '' : (raw.value ?? '')))
const valueIds = computed<Identity[]>(() =>
  Array.isArray(raw.value) ? raw.value : raw.value ? [raw.value] : [],
)

function commitLiteral(value: string) {
  apply((o) => setPropertyValue(o, props.ownerId, props.spec.slug as never, value))
}
function addStructured() {
  if (!props.spec.type) return
  apply((o) => spawnValue(o, props.ownerId, props.spec.slug, props.spec.type!, list.value))
}
function removeStructured(id: Identity) {
  apply((o) => removeValue(o, props.ownerId, props.spec.slug, id))
}

const canAdd = computed(() => list.value || valueIds.value.length === 0)
</script>

<template>
  <div class="d-flex flex-column ga-2">
    <div class="text-caption text-medium-emphasis">
      {{ spec.name }}
      <span class="ms-1">· {{ conceptLabel(spec.type ?? '') ?? spec.type ?? 'any' }}</span>
      <span class="ms-1">· {{ spec.cardinality }}</span>
    </div>

    <!-- leaf: single field (list of fields when 0+/1+) -->
    <template v-if="leaf">
      <v-select
        v-if="cardinalityValued"
        :model-value="literalValue"
        :items="CARDS"
        :label="spec.name"
        variant="outlined"
        density="comfortable"
        hide-details
        @update:model-value="commitLiteral($event ?? '')"
      />
      <v-text-field
        v-else-if="!list"
        :model-value="literalValue"
        :label="spec.name"
        variant="outlined"
        density="comfortable"
        hide-details
        @update:model-value="commitLiteral($event)"
      />
      <v-combobox
        v-else
        :model-value="valueIds"
        :label="spec.name"
        variant="outlined"
        density="comfortable"
        hide-details
        multiple
        chips
        closable-chips
        @update:model-value="apply((o) => setPropertyValue(o, ownerId, spec.slug as never, $event))"
      />
    </template>

    <!-- structured: nested form per value instance -->
    <template v-else>
      <v-card
        v-for="id in valueIds"
        :key="id"
        variant="tonal"
        color="instance"
        class="pa-2"
      >
        <div class="d-flex justify-end">
          <v-btn
            icon="mdi-close"
            variant="text"
            size="x-small"
            density="comfortable"
            @click="removeStructured(id)"
          />
        </div>
        <InstanceForm :concept-id="id" :ancestors="[...ancestors, ownerId]" />
      </v-card>
    </template>

    <div v-if="canAdd && !leaf" class="d-flex justify-center">
      <v-btn prepend-icon="mdi-plus" variant="tonal" size="small" @click="addStructured">
        {{ conceptLabel(spec.type ?? '') ?? spec.name }}
      </v-btn>
    </div>

    <div
      v-if="isRequired(spec.cardinality) && !valueIds.length && !leaf"
      class="text-caption text-error text-center"
    >
      required
    </div>
  </div>
</template>
