<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { Ontology } from './Ontology'
import type { Identity } from '@/concepts/identity/Identity'
import type { Slug } from '@/concepts/identity/Slug'
import { provideOntology } from './useOntology'
import { renameSlug as renameSlugEdit, identityAfterSlug } from '@/concepts/editing/editOntology'
import ConceptView from '@/concepts/concept-view/ConceptView.vue'
import ConceptEditor from '@/concepts/editing/ConceptEditor.vue'

const props = defineProps<{
  /** The ontology to display. */
  modelValue: Ontology
  /** Identity of the concept to show first. Defaults to the root. */
  rootId?: Identity
  /** Allow entering edit mode. */
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

function renameSlug(instanceId: Identity, newSlug: Slug) {
  const nextId = identityAfterSlug(props.modelValue, instanceId, newSlug)
  emit('update:modelValue', renameSlugEdit(props.modelValue, instanceId, newSlug))
  if (currentId.value === instanceId) currentId.value = nextId
}

provideOntology({ ontology: () => props.modelValue, navigate, apply, renameSlug })
</script>

<template>
  <div class="ontology-editor d-flex flex-column ga-2">
    <div v-if="editable" class="d-flex justify-end">
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
  </div>
</template>

<style scoped>
.ontology-editor {
  width: 100%;
  height: 100%;
  min-height: 400px;
}
</style>
