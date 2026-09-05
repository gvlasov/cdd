<script setup lang="ts">
import { computed } from 'vue'
import type { Ontology } from '@/concepts/ontology/Ontology'
import type { Identity } from '@/concepts/identity/Identity'
import { conceptOf, parentIdentities } from '@/concepts/ontology/Ontology'
import { conceptRefs } from '@/concepts/concepts/Concept'
import { attributeTypeParents, attributeType, soleOwningAttribute } from '@/concepts/attributes/Attribute'
import { useOntology } from '@/concepts/ontology/useOntology'
import Instance from '@/concepts/instances/Instance.vue'
import TransactionBar from '@/concepts/transactions/TransactionBar.vue'
import RealityPanel from '@/concepts/reality/RealityPanel.vue'

const props = defineProps<{
  ontology: Ontology
  conceptId: Identity
}>()

const { conceptLabel, navigate } = useOntology()

const concept = computed(() => conceptOf(props.ontology, props.conceptId))
// Parents: concepts that reference this one directly (attributes/concepts
// lists), plus concepts whose declared attributes are typed by this one — a
// concept with an attribute of type Attribute makes Concept a parent of
// Attribute, for example.
const parents = computed(() => {
  const direct = parentIdentities(props.ontology, props.conceptId)
  const viaAttributeType = attributeTypeParents(props.ontology, props.conceptId)
  return [...new Set([...direct, ...viaAttributeType])]
})

// The concept this attribute's type merges into this page — a type that
// exists solely to shape this attribute has no page of its own (see
// `soleOwningAttribute`), so its own declared attributes are shown here too.
const mergedConcept = computed(() => {
  if (!concept.value) return undefined
  const type = attributeType(concept.value)
  if (!type) return undefined
  if (soleOwningAttribute(props.ontology, type) !== props.conceptId) return undefined
  return conceptOf(props.ontology, type)
})

// Attribute chips below the instance: the attributes it declares itself (as a
// concept), its merged type's attributes, if any, and — for an ontology —
// its `concepts` list. Not the type's attributes in general — only a merged
// type's, since those belong to this page now.
const refs = computed(() => [
  ...(concept.value ? conceptRefs(concept.value) : []),
  ...(mergedConcept.value ? conceptRefs(mergedConcept.value) : []),
])
</script>

<template>
  <div class="d-flex flex-column ga-4 concept-view">
    <nav aria-label="Parent concepts">
      <div class="d-flex flex-wrap ga-3 align-center justify-center">
        <v-chip
          v-for="pid in parents"
          :key="pid"
          prepend-icon="mdi-arrow-up"
          color="concept"
          variant="outlined"
          size="large"
          link
          @click="navigate(pid)"
        >
          {{ conceptLabel(pid) ?? pid }}
        </v-chip>
        <span v-if="!parents.length" class="text-medium-emphasis text-caption">&nbsp;</span>
      </div>
    </nav>

    <Instance v-if="concept" :instance="concept" />
    <v-card v-else variant="outlined" class="flex-grow-1 d-flex align-center">
      <v-card-text class="text-medium-emphasis">Unknown concept: {{ conceptId }}</v-card-text>
    </v-card>

    <nav v-if="concept" aria-label="Attributes">
      <div class="d-flex flex-wrap ga-3 align-center justify-center">
        <v-chip
          v-for="ref in refs"
          :key="ref"
          color="attribute"
          variant="outlined"
          size="large"
          link
          @click="navigate(ref)"
        >
          {{ conceptLabel(ref) ?? ref }}
        </v-chip>
      </div>
    </nav>

    <TransactionBar v-if="concept" :concept-id="conceptId" />
    <RealityPanel v-if="concept" :concept-id="conceptId" />
  </div>
</template>

<style scoped>
.concept-view {
  min-height: 0;
}
</style>
