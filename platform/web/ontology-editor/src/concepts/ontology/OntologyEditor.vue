<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, ref, watch } from 'vue'
import type { Ontology } from './Ontology'
import type { Identity } from '@/concepts/identity/Identity'
import type { Slug } from '@/concepts/identity/Slug'
import { isSlug } from '@/concepts/identity/Slug'
import { provideOntology } from './useOntology'
import { ontologyConcepts, conceptOf } from './Ontology'
import { conceptLabelOf } from '@/concepts/concepts/Concept'
import {
  renameSlug as renameSlugEdit,
  identityAfterSlug,
  createConcept as createConceptEdit,
  newConceptIdentity,
} from '@/concepts/editing/editOntology'
import type { Reality } from '@/concepts/reality/Reality'
import { emptyReality } from '@/concepts/reality/Reality'
import type { TransactionId } from '@/concepts/transactions/Transaction'
import { transactionOf, transactionEffect } from '@/concepts/transactions/Transaction'
import { runEffect } from '@/concepts/transactions/runEffect'
import ConceptView from '@/concepts/concept-view/ConceptView.vue'
import ConceptEditor from '@/concepts/editing/ConceptEditor.vue'

const props = defineProps<{
  /** The ontology to display. */
  modelValue: Ontology
  /** The reality — instances of the ontology's concepts. Optional; defaults empty. */
  reality?: Reality
  /** Identity of the concept to show first. Defaults to the root. */
  rootId?: Identity
  /** Allow entering edit mode and creating concepts. */
  editable?: boolean
  /**
   * Sync the open concept to the URL hash (`#<identity>`) and honour the
   * browser's back / forward buttons. Off by default so an embedding host's
   * history is untouched.
   */
  history?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: Ontology): void
  (e: 'update:reality', value: Reality): void
}>()

const currentReality = computed(() => props.reality ?? emptyReality())

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

// --- URL-hash history (opt-in via `history`) ---
function hashIdentity(): Identity | '' {
  return decodeURIComponent(window.location.hash.replace(/^#/, ''))
}
function pushHash(identity: Identity) {
  const next = `#${encodeURIComponent(identity)}`
  if (window.location.hash !== next) window.history.pushState({ ontologyConcept: identity }, '', next)
}
function onPopState() {
  const id = hashIdentity()
  if (id && id in props.modelValue.instances) {
    currentId.value = id
    editing.value = false
  }
}

onMounted(() => {
  if (!props.history) return
  const id = hashIdentity()
  if (id && id in props.modelValue.instances) currentId.value = id
  else pushHash(currentId.value)
  window.addEventListener('popstate', onPopState)
})
onBeforeUnmount(() => {
  if (props.history) window.removeEventListener('popstate', onPopState)
})

function navigate(identity: Identity) {
  if (identity === currentId.value) return
  currentId.value = identity
  editing.value = false
  if (props.history) pushHash(identity)
}

function apply(mutate: (ontology: Ontology) => Ontology) {
  emit('update:modelValue', mutate(props.modelValue))
}

function renameSlug(instanceId: Identity, slug: Slug) {
  const nextId = identityAfterSlug(props.modelValue, instanceId, slug)
  emit('update:modelValue', renameSlugEdit(props.modelValue, instanceId, slug))
  if (currentId.value === instanceId && nextId !== instanceId) {
    currentId.value = nextId
    if (props.history) window.history.replaceState({ ontologyConcept: nextId }, '', `#${encodeURIComponent(nextId)}`)
  }
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

const runError = ref('')

function runTransaction(id: TransactionId, input: unknown) {
  runError.value = ''
  const transaction = transactionOf(props.modelValue, id)
  const effect = transaction ? transactionEffect(transaction) : ''
  if (!effect) {
    runError.value = `Transaction ${id} has no effect`
    return
  }
  try {
    const { reality } = runEffect(effect, input, currentReality.value, props.modelValue)
    emit('update:reality', reality)
  } catch (e) {
    runError.value = e instanceof Error ? e.message : String(e)
  }
}

// Concept search — options are every concept, filtered by name in the dropdown.
const conceptSearchItems = computed(() =>
  ontologyConcepts(props.modelValue).map((id) => {
    const c = conceptOf(props.modelValue, id)
    return { value: id, title: (c && conceptLabelOf(c)) || id }
  }),
)
const search = ref<Identity | null>(null)
function onSearchSelect(id: Identity | null) {
  if (id) navigate(id)
  search.value = null
}

provideOntology({
  ontology: () => props.modelValue,
  reality: () => currentReality.value,
  navigate,
  apply,
  renameSlug,
  createConcept,
  runTransaction,
})
</script>

<template>
  <div class="ontology-editor d-flex flex-column ga-2">
    <div class="d-flex align-center ga-2">
      <v-autocomplete
        :model-value="search"
        :items="conceptSearchItems"
        placeholder="Search concepts…"
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        density="compact"
        hide-details
        clearable
        auto-select-first
        menu-icon=""
        class="flex-grow-1"
        style="max-width: 320px"
        @update:model-value="onSearchSelect"
      />
      <v-spacer />
      <template v-if="editable">
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
      </template>
    </div>

    <v-alert
      v-if="runError"
      type="error"
      density="compact"
      closable
      @click:close="runError = ''"
    >
      {{ runError }}
    </v-alert>

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
