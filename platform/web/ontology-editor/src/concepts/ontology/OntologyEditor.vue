<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { Ontology } from './Ontology'
import type { Identity } from '@/concepts/identity/Identity'
import type { Slug } from '@/concepts/identity/Slug'
import { isSlug } from '@/concepts/identity/Slug'
import { provideOntology } from './useOntology'
import {
  renameSlug as renameSlugEdit,
  identityAfterSlug,
  createConcept as createConceptEdit,
  newConceptIdentity,
} from '@/concepts/editing/editOntology'
import ConceptView from '@/concepts/concept-view/ConceptView.vue'
import ConceptEditor from '@/concepts/editing/ConceptEditor.vue'

const props = defineProps<{
  /** The ontology to display. */
  modelValue: Ontology
  /** Identity of the concept to show first. Defaults to the root. */
  rootId?: Identity
  /** Allow entering edit mode and creating concepts. */
  editable?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: Ontology): void
}>()

const firstId = computed(
  () => props.rootId ?? props.modelValue.root ?? Object.keys(props.modelValue.instances)[0] ?? '',
)
const currentId = ref<Identity>(firstId.value)
const editing = ref(false)

const creating = ref(false)
const newSlug = ref('')
const newConceptError = computed(() => {
  const s = newSlug.value.trim()
  if (!s) return ''
  if (!isSlug(s)) return 'Slug must match [a-zA-Z0-9_-]'
  if (!newConceptIdentity(props.modelValue, s)) return 'That identity is already taken'
  return ''
})

watch(
  () => [props.rootId, props.modelValue] as const,
  () => {
    if (!(currentId.value in props.modelValue.instances)) {
      currentId.value = firstId.value
    }
  },
)

function navigate(identity: Identity) {
  currentId.value = identity
  editing.value = false
}

function apply(mutate: (ontology: Ontology) => Ontology) {
  emit('update:modelValue', mutate(props.modelValue))
}

function renameSlug(instanceId: Identity, slug: Slug) {
  const nextId = identityAfterSlug(props.modelValue, instanceId, slug)
  emit('update:modelValue', renameSlugEdit(props.modelValue, instanceId, slug))
  if (currentId.value === instanceId) currentId.value = nextId
}

function createConcept(slug: Slug) {
  const id = newConceptIdentity(props.modelValue, slug)
  if (!id) return
  emit('update:modelValue', createConceptEdit(props.modelValue, slug))
  currentId.value = id
  editing.value = true
}

function submitNewConcept() {
  const s = newSlug.value.trim()
  if (!s || newConceptError.value) return
  createConcept(s)
  creating.value = false
  newSlug.value = ''
}

provideOntology({
  ontology: () => props.modelValue,
  navigate,
  apply,
  renameSlug,
  createConcept,
})
</script>

<template>
  <div class="ontology-editor d-flex flex-column ga-2">
    <div v-if="editable" class="d-flex justify-end ga-2">
      <v-btn
        prepend-icon="mdi-plus"
        variant="tonal"
        size="small"
        @click="creating = true"
      >
        New concept
      </v-btn>
      <v-btn
        :prepend-icon="editing ? 'mdi-check' : 'mdi-pencil'"
        :color="editing ? 'primary' : undefined"
        variant="tonal"
        size="small"
        @click="editing = !editing"
      >
        {{ editing ? 'Done' : 'Edit' }}
      </v-btn>
    </div>

    <ConceptEditor v-if="editing" :ontology="modelValue" :concept-id="currentId" />
    <ConceptView v-else :ontology="modelValue" :concept-id="currentId" />

    <v-dialog v-model="creating" max-width="420">
      <v-card>
        <v-card-title>New concept</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="newSlug"
            label="slug"
            :error-messages="newConceptError"
            variant="outlined"
            autofocus
            @keydown.enter="submitNewConcept"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="creating = false">Cancel</v-btn>
          <v-btn
            color="primary"
            variant="tonal"
            :disabled="!newSlug.trim() || !!newConceptError"
            @click="submitNewConcept"
          >
            Create
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped>
.ontology-editor {
  width: 100%;
  height: 100%;
  min-height: 400px;
}
</style>
