<script setup lang="ts">
import { computed } from 'vue'
import type { Ontology } from '@/concepts/ontology/Ontology'
import type { Identity } from '@/concepts/identity/Identity'
import { conceptOf } from '@/concepts/ontology/Ontology'
import Instance from '@/concepts/instances/Instance.vue'
import RealityPanel from '@/concepts/reality/RealityPanel.vue'

const props = defineProps<{
  ontology: Ontology
  conceptId: Identity
}>()

const concept = computed(() => conceptOf(props.ontology, props.conceptId))
</script>

<template>
  <div class="d-flex flex-column ga-4 concept-view">
    <Instance v-if="concept" :instance="concept" :show-name="false" />
    <v-card v-else variant="outlined" class="flex-grow-1 d-flex align-center">
      <v-card-text class="text-medium-emphasis">Unknown concept: {{ conceptId }}</v-card-text>
    </v-card>

    <RealityPanel v-if="concept" :concept-id="conceptId" />
  </div>
</template>

<style scoped>
.concept-view {
  min-height: 0;
}
</style>
