<script setup lang="ts">
import { computed } from 'vue'
import type { Ontology } from '@/concepts/ontology/Ontology'
import type { Identity } from '@/concepts/identity/Identity'
import { conceptOf, parentIdentities } from '@/concepts/ontology/Ontology'
import { useOntology } from '@/concepts/ontology/useOntology'
import { propertyKind } from '@/concepts/properties/kinds/property-kinds'

const props = defineProps<{
  ontology: Ontology
  conceptId: Identity
}>()

const { conceptLabel, navigate } = useOntology()

const concept = computed(() => conceptOf(props.ontology, props.conceptId))
const parents = computed(() => parentIdentities(props.ontology, props.conceptId))

// Properties drawn in kind-position order; equal positions keep source order.
const drawn = computed(() =>
  [...(concept.value ?? [])]
    .map((property, i) => ({ property, i, kind: propertyKind(property.kind) }))
    .filter((x) => x.kind?.render)
    .sort((a, b) => a.kind.position - b.kind.position || a.i - b.i),
)
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

    <v-card variant="outlined" class="flex-grow-1 d-flex align-center overflow-auto">
      <v-card-text v-if="concept" class="d-flex flex-column ga-4 align-center">
        <component
          :is="entry.kind.render"
          v-for="entry in drawn"
          :key="entry.i"
          :property="entry.property"
          :concept="concept"
        />
      </v-card-text>
      <v-card-text v-else class="text-medium-emphasis">
        Unknown concept: {{ conceptId }}
      </v-card-text>
    </v-card>
  </div>
</template>
