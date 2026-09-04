<script setup lang="ts">
import { computed } from 'vue'
import type { Property } from '@/concepts/properties/Property'
import type { Instance } from '@/concepts/instances/Instance'
import { useOntology } from '@/concepts/ontology/useOntology'

// `examples` value identities reference instances of the concept — each one
// resolved to a label, falling back to the raw identity for anything unknown.
const props = defineProps<{ property: Property; instance: Instance }>()
const { conceptLabel, navigate } = useOntology()

const identities = computed(() =>
  Array.isArray(props.property.value) ? props.property.value : [props.property.value],
)
</script>

<template>
  <div class="text-center">
    <div class="text-overline text-medium-emphasis">examples</div>
    <div class="d-flex flex-wrap ga-2 justify-center">
      <v-chip
        v-for="id in identities"
        :key="id"
        color="concept"
        variant="outlined"
        size="small"
        link
        @click="navigate(id)"
      >
        {{ conceptLabel(id) ?? id }}
      </v-chip>
    </div>
  </div>
</template>
