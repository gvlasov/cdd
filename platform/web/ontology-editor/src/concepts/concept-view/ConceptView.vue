<script setup lang="ts">
import { computed } from 'vue'
import type { Ontology } from '@/concepts/ontology/Ontology'
import type { Identity } from '@/concepts/identity/Identity'
import { conceptOf, parentIdentities } from '@/concepts/ontology/Ontology'
import { conceptRefs } from '@/concepts/concepts/Concept'
import { useOntology } from '@/concepts/ontology/useOntology'
import InstanceRenderer from '@/concepts/instances/InstanceRenderer.vue'
import TransactionBar from '@/concepts/transactions/TransactionBar.vue'
import RealityPanel from '@/concepts/reality/RealityPanel.vue'

const props = defineProps<{
  ontology: Ontology
  conceptId: Identity
}>()

const { conceptLabel, navigate } = useOntology()

const concept = computed(() => conceptOf(props.ontology, props.conceptId))
const parents = computed(() => parentIdentities(props.ontology, props.conceptId))

// The concepts this one references — its attributes, `concept` parts, and (for
// an ontology) its `concepts` list — drawn below the instance as navigable chips.
const refs = computed(() => (concept.value ? conceptRefs(concept.value) : []))
</script>

<template>
  <div class="d-flex flex-column ga-4 fill-height">
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
        <span v-if="!parents.length" class="text-medium-emphasis text-caption">
          no parent concepts
        </span>
      </div>
    </nav>

    <InstanceRenderer v-if="concept" :instance="concept" />
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
