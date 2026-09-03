<script setup lang="ts">
import { computed } from 'vue'
import type { Ontology } from '@/concepts/ontology/Ontology'
import { nodeById, attributesOf, parentsOf } from '@/concepts/ontology/Ontology'

const props = defineProps<{
  ontology: Ontology
  conceptId: string
}>()

const emit = defineEmits<{
  (e: 'navigate', conceptId: string): void
}>()

const concept = computed(() => nodeById(props.ontology, props.conceptId))
const parents = computed(() => parentsOf(props.ontology, props.conceptId))
const attributes = computed(() => attributesOf(props.ontology, props.conceptId))

function label(id: string): string {
  return nodeById(props.ontology, id)?.name ?? id
}
</script>

<template>
  <div class="d-flex flex-column ga-4 fill-height">
    <nav aria-label="Parent concepts">
      <div class="d-flex flex-wrap ga-2 align-center">
        <v-chip
          v-for="edge in parents"
          :key="edge.id"
          prepend-icon="mdi-arrow-up"
          variant="outlined"
          link
          @click="emit('navigate', edge.from)"
        >
          {{ label(edge.from) }}
        </v-chip>
        <span v-if="!parents.length" class="text-medium-emphasis text-caption">
          no parent concepts
        </span>
      </div>
    </nav>

    <v-card variant="outlined" class="flex-grow-1 d-flex align-center overflow-auto">
      <v-card-text v-if="concept" class="text-center">
        <h1 v-if="concept.name" class="text-h3 mb-4">{{ concept.name }}</h1>
        <p
          v-if="concept.description"
          class="text-body-1 text-medium-emphasis mx-auto"
          style="max-width: 60ch"
        >
          {{ concept.description }}
        </p>
      </v-card-text>
      <v-card-text v-else class="text-medium-emphasis">
        Unknown concept: {{ conceptId }}
      </v-card-text>
    </v-card>

    <nav aria-label="Attributes">
      <div class="d-flex flex-wrap ga-2 align-center">
        <v-chip
          v-for="edge in attributes"
          :key="edge.id"
          variant="outlined"
          link
          @click="emit('navigate', edge.to)"
        >
          {{ label(edge.to) }}
          <span v-if="edge.relation" class="text-medium-emphasis ms-1">
            · {{ edge.relation }}
          </span>
        </v-chip>
        <span v-if="!attributes.length" class="text-medium-emphasis text-caption">
          no attributes
        </span>
      </div>
    </nav>
  </div>
</template>
