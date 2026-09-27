<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import type { Identity } from '@/concepts/identity/Identity'
import { isSlug } from '@/concepts/identity/Slug'
import { conceptOf, ontologyConcepts } from '@/concepts/ontology/Ontology'
import { useOntology } from '@/concepts/ontology/useOntology'
import { CARDINALITIES, type Cardinality } from './Attribute'
import { createAttribute, newAttributeIdentity } from './editAttributes'
import { createConcept, newConceptIdentity } from '@/concepts/editing/editOntology'

const props = defineProps<{ ownerId: Identity }>()
const { ontology, apply, conceptLabel } = useOntology()
const CREATE = '\u0000create'
const adding = ref(false)
const creatingType = ref(false)
const newTypeSlug = ref('')
const form = reactive<{ name: string; slug: string; type: Identity | null; cardinality: Cardinality }>({
  name: '', slug: '', type: null, cardinality: '0-1',
})

const conceptItems = computed(() => [
  { value: CREATE, title: '+ Create new concept', props: { class: 'text-primary' } },
  ...ontologyConcepts(ontology())
    .filter((id) => id !== props.ownerId)
    .map((id) => ({ value: id, title: conceptLabel(id) ?? id })),
])
const formError = computed(() => {
  const slug = form.slug.trim()
  if (!slug) return ''
  if (!isSlug(slug)) return 'Slug must match [a-zA-Z0-9_-]'
  return newAttributeIdentity(ontology(), props.ownerId, slug) ? '' : 'That attribute identity is taken'
})
const newTypeError = computed(() => {
  const slug = newTypeSlug.value.trim()
  if (!slug) return ''
  if (!isSlug(slug)) return 'Slug must match [a-zA-Z0-9_-]'
  return newConceptIdentity(ontology(), slug) ? '' : 'That identity is taken'
})

function onTypeSelect(value: Identity | null) {
  if (value === CREATE) {
    form.type = null
    creatingType.value = true
  } else form.type = value
}
function submitNewType() {
  const slug = newTypeSlug.value.trim()
  if (!slug || newTypeError.value) return
  const id = newConceptIdentity(ontology(), slug)
  apply((o) => createConcept(o, slug))
  form.type = id
  creatingType.value = false
  newTypeSlug.value = ''
}
function close() {
  adding.value = false
  creatingType.value = false
  form.name = ''
  form.slug = ''
  form.type = null
  form.cardinality = '0-1'
}
function submit() {
  const slug = form.slug.trim()
  if (!slug || formError.value || !form.type || !conceptOf(ontology(), props.ownerId)) return
  apply((o) => createAttribute(o, props.ownerId, {
    name: form.name.trim() || slug,
    slug,
    type: form.type as Identity,
    cardinality: form.cardinality,
  }))
  close()
}
</script>

<template>
  <v-btn prepend-icon="mdi-plus" variant="tonal" size="small" @click="adding = true">
    Attribute
  </v-btn>
  <v-dialog v-model="adding" max-width="460">
    <v-card>
      <v-card-title>New attribute</v-card-title>
      <v-card-text class="d-flex flex-column ga-3">
        <v-text-field v-model="form.name" label="name" variant="outlined" density="comfortable" hide-details />
        <v-text-field v-model="form.slug" label="slug (property key)" :error-messages="formError" variant="outlined" density="comfortable" />
        <template v-if="creatingType">
          <v-text-field v-model="newTypeSlug" label="new concept slug" :error-messages="newTypeError" variant="outlined" density="comfortable" autofocus @keydown.enter="submitNewType">
            <template #append><v-btn size="small" variant="tonal" color="primary" :disabled="!newTypeSlug.trim() || !!newTypeError" @click="submitNewType">Create</v-btn></template>
          </v-text-field>
        </template>
        <v-autocomplete v-else :model-value="form.type" :items="conceptItems" label="type" variant="outlined" density="comfortable" hide-details @update:model-value="onTypeSelect" />
        <div>
          <div class="text-caption text-medium-emphasis mb-1">cardinality</div>
          <v-btn-toggle v-model="form.cardinality" variant="tonal" divided mandatory>
            <v-btn v-for="c in CARDINALITIES" :key="c" :value="c" size="small">{{ c }}</v-btn>
          </v-btn-toggle>
        </div>
      </v-card-text>
      <v-card-actions><v-spacer /><v-btn variant="text" @click="close">Cancel</v-btn><v-btn color="primary" variant="tonal" :disabled="!form.slug.trim() || !!formError || !form.type" @click="submit">Add</v-btn></v-card-actions>
    </v-card>
  </v-dialog>
</template>
