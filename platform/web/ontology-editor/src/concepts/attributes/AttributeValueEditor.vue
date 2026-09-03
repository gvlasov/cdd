<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Identity } from '@/concepts/identity/Identity'
import { conceptOf, ontologyConcepts } from '@/concepts/ontology/Ontology'
import { isSlug } from '@/concepts/identity/Slug'
import { useOntology } from '@/concepts/ontology/useOntology'
import { setPropertyValue, createConcept, newConceptIdentity } from '@/concepts/editing/editOntology'
import { spawnValue, removeValue } from './spawnValue'
import { isLeafConcept, isList, isRequired, CARDINALITIES, type AttributeSpec } from './Attribute'
import InstanceForm from '@/concepts/editing/InstanceForm.vue'

// Edits one attribute's value(s) on an owner instance.
//  - leaf type       → a plain text field (select for cardinality)
//  - `cdd.concept`   → the value IS a concept — a concept picker (+ create)
//  - other structured type → a nested InstanceForm per owned value instance
//  - list cardinality → repeat, with add / remove
const props = withDefaults(
  defineProps<{ ownerId: Identity; spec: AttributeSpec; ancestors?: Identity[] }>(),
  { ancestors: () => [] },
)

const { ontology, apply, conceptLabel } = useOntology()

const owner = computed(() => conceptOf(ontology(), props.ownerId))
const leaf = computed(() => isLeafConcept(ontology(), props.spec.type))
const reference = computed(() => props.spec.type === 'cdd.concept')
const list = computed(() => isList(props.spec.cardinality))
const cardinalityValued = computed(() => props.spec.type === 'cdd.cardinality')
const CARDS: string[] = [...CARDINALITIES]
const CREATE = ' create'

const raw = computed(() => {
  const p = (owner.value ?? []).find((x) => x.kind === props.spec.slug)
  return p?.value
})
const literalValue = computed(() => (Array.isArray(raw.value) ? '' : (raw.value ?? '')))
const valueIds = computed<Identity[]>(() =>
  Array.isArray(raw.value) ? raw.value : raw.value ? [raw.value] : [],
)

function commit(value: Identity | Identity[]) {
  apply((o) => setPropertyValue(o, props.ownerId, props.spec.slug as never, value))
}
function commitLiteral(value: string) {
  commit(value)
}
function addStructured() {
  if (!props.spec.type) return
  apply((o) => spawnValue(o, props.ownerId, props.spec.slug, props.spec.type!, list.value))
}
function removeStructured(id: Identity) {
  apply((o) => removeValue(o, props.ownerId, props.spec.slug, id))
}

const canAdd = computed(() => list.value || valueIds.value.length === 0)

// --- concept reference picker ---
const conceptItems = computed(() => [
  { value: CREATE, title: '+ Create new concept', props: { class: 'text-primary' } },
  ...ontologyConcepts(ontology())
    .filter((id) => id !== props.ownerId)
    .map((id) => ({ value: id, title: conceptLabel(id) ?? id })),
])
const creating = ref(false)
const newSlug = ref('')
const newError = computed(() => {
  const s = newSlug.value.trim()
  if (!s) return ''
  if (!isSlug(s)) return 'Slug must match [a-zA-Z0-9_-]'
  if (!newConceptIdentity(ontology(), s)) return 'That identity is taken'
  return ''
})
function onRefSelect(value: Identity | null) {
  if (value === CREATE) {
    creating.value = true
    return
  }
  if (list.value) {
    commit([...(value ? [value] : []), ...valueIds.value].filter((v, i, a) => a.indexOf(v) === i))
  } else {
    commit(value ?? '')
  }
}
function submitNew() {
  const s = newSlug.value.trim()
  if (!s || newError.value) return
  const id = newConceptIdentity(ontology(), s)
  apply((o) => createConcept(o, s))
  onRefSelect(id)
  creating.value = false
  newSlug.value = ''
}
</script>

<template>
  <div class="d-flex flex-column ga-2">
    <!-- leaf: single field (list of fields when 0+/1+) -->
    <template v-if="leaf">
      <div v-if="cardinalityValued">
        <div class="text-caption text-medium-emphasis mb-1">{{ spec.name }}</div>
        <v-btn-toggle
          :model-value="literalValue"
          variant="tonal"
          density="comfortable"
          divided
          mandatory
          @update:model-value="commitLiteral($event ?? '')"
        >
          <v-btn v-for="c in CARDS" :key="c" :value="c" size="small">{{ c }}</v-btn>
        </v-btn-toggle>
      </div>
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
        @update:model-value="commit($event)"
      />
    </template>

    <!-- reference: the value is a concept — pick it -->
    <template v-else-if="reference">
      <v-text-field
        v-if="creating"
        v-model="newSlug"
        label="new concept slug"
        :error-messages="newError"
        variant="outlined"
        density="comfortable"
        autofocus
        @keydown.enter="submitNew"
      >
        <template #append>
          <v-btn
            size="small"
            variant="tonal"
            color="primary"
            :disabled="!newSlug.trim() || !!newError"
            @click="submitNew"
          >
            Create
          </v-btn>
        </template>
      </v-text-field>
      <v-autocomplete
        v-else
        :model-value="list ? valueIds : literalValue"
        :items="conceptItems"
        :multiple="list"
        :chips="list"
        :closable-chips="list"
        variant="outlined"
        density="comfortable"
        hide-details
        @update:model-value="list ? commit($event as string[]) : onRefSelect($event as string | null)"
      />
    </template>

    <!-- structured: nested form per owned value instance -->
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

      <div v-if="canAdd" class="d-flex justify-center">
        <v-btn prepend-icon="mdi-plus" variant="tonal" size="small" @click="addStructured">
          {{ conceptLabel(spec.type ?? '') ?? spec.name }}
        </v-btn>
      </div>
    </template>

    <div
      v-if="isRequired(spec.cardinality) && !valueIds.length && !leaf"
      class="text-caption text-error text-center"
    >
      required
    </div>
  </div>
</template>
