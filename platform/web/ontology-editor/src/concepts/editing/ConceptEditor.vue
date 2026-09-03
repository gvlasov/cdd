<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import type { Identity } from '@/concepts/identity/Identity'
import type { Ontology } from '@/concepts/ontology/Ontology'
import { conceptOf, ontologyConcepts } from '@/concepts/ontology/Ontology'
import { isSlug } from '@/concepts/identity/Slug'
import { CARDINALITIES, type Cardinality } from '@/concepts/attributes/Attribute'
import { createAttribute, newAttributeIdentity } from '@/concepts/attributes/editAttributes'
import { useOntology } from '@/concepts/ontology/useOntology'
import InstanceForm from './InstanceForm.vue'

// The concept-editing surface: the instance's own form (driven by its type),
// plus — since this instance is a concept — a "+attribute" flow to declare a
// new attribute (name, type, cardinality) on it.
const props = defineProps<{ ontology: Ontology; conceptId: Identity }>()

const { apply, conceptLabel } = useOntology()

const concept = computed(() => conceptOf(props.ontology, props.conceptId))

const conceptItems = computed(() =>
  ontologyConcepts(props.ontology).map((id) => ({ value: id, title: conceptLabel(id) ?? id })),
)

const adding = ref(false)
const form = reactive<{ name: string; slug: string; type: Identity | null; cardinality: Cardinality }>({
  name: '',
  slug: '',
  type: null,
  cardinality: '0-1',
})

const formError = computed(() => {
  if (!form.slug.trim()) return ''
  if (!isSlug(form.slug.trim())) return 'Slug must match [a-zA-Z0-9_-]'
  if (!newAttributeIdentity(props.ontology, props.conceptId, form.slug.trim()))
    return 'That attribute identity is taken'
  return ''
})

function submit() {
  const slug = form.slug.trim()
  if (!slug || formError.value || !form.type) return
  apply((o) =>
    createAttribute(o, props.conceptId, {
      name: form.name.trim() || slug,
      slug,
      type: form.type as Identity,
      cardinality: form.cardinality,
    }),
  )
  adding.value = false
  form.name = ''
  form.slug = ''
  form.type = null
  form.cardinality = '0-1'
}
</script>

<template>
  <v-card variant="outlined" class="flex-grow-1 overflow-auto">
    <v-card-text v-if="concept" class="d-flex flex-column ga-4">
      <InstanceForm :concept-id="conceptId" />

      <div class="d-flex justify-center pt-2">
        <v-btn prepend-icon="mdi-cog-outline" variant="tonal" size="small" @click="adding = true">
          define attribute
        </v-btn>
      </div>
    </v-card-text>
    <v-card-text v-else class="text-medium-emphasis">
      Unknown concept: {{ conceptId }}
    </v-card-text>

    <v-dialog v-model="adding" max-width="460">
      <v-card>
        <v-card-title>New attribute</v-card-title>
        <v-card-text class="d-flex flex-column ga-3">
          <v-text-field
            v-model="form.name"
            label="name"
            variant="outlined"
            density="comfortable"
            hide-details
          />
          <v-text-field
            v-model="form.slug"
            label="slug (property key)"
            :error-messages="formError"
            variant="outlined"
            density="comfortable"
          />
          <v-autocomplete
            v-model="form.type"
            :items="conceptItems"
            label="type"
            variant="outlined"
            density="comfortable"
            hide-details
          />
          <v-select
            v-model="form.cardinality"
            :items="CARDINALITIES"
            label="cardinality"
            variant="outlined"
            density="comfortable"
            hide-details
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="adding = false">Cancel</v-btn>
          <v-btn
            color="primary"
            variant="tonal"
            :disabled="!form.slug.trim() || !!formError || !form.type"
            @click="submit"
          >
            Add
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>
