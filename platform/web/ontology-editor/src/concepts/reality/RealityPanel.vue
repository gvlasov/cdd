<script setup lang="ts">
import { computed } from 'vue'
import type { Identity } from '@/concepts/identity/Identity'
import { instancesOfConcept } from './Reality'
import { instanceName, instanceIdentity } from '@/concepts/instances/Instance'
import { useOntology } from '@/concepts/ontology/useOntology'

// The instances of `conceptId` currently in the reality.
const props = defineProps<{ conceptId: Identity }>()

const { reality } = useOntology()

const items = computed(() =>
  instancesOfConcept(reality(), props.conceptId).map((instance) => ({
    id: instanceIdentity(instance) ?? '',
    label: instanceName(instance),
    props: instance
      .filter((p) => p.kind !== 'identity' && p.kind !== 'concept')
      .map((p) => `${p.kind}: ${Array.isArray(p.value) ? p.value.join(', ') : p.value}`),
  })),
)
</script>

<template>
  <div v-if="items.length" class="reality-panel">
    <div class="text-overline text-medium-emphasis text-center">reality</div>
    <div class="d-flex flex-column ga-2">
      <v-card
        v-for="item in items"
        :key="item.id"
        color="instance"
        variant="tonal"
        density="compact"
      >
        <v-card-text class="py-2">
          <span v-if="item.label" class="font-weight-medium">{{ item.label }}</span>
          <span class="text-caption text-medium-emphasis ms-2">{{ item.props.join(' · ') }}</span>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>
