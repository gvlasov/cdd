<script setup lang="ts">
import { computed } from 'vue'
import type { Property } from '@/concepts/properties/Property'
import type { Instance } from '@/concepts/instances/Instance'
import { useOntology } from '@/concepts/ontology/useOntology'

// `instance`: the identity an Example links to.
const props = defineProps<{ property: Property; instance: Instance }>()
const { conceptLabel, navigate } = useOntology()

const target = computed(() => String(props.property.value))
</script>

<template>
  <div class="text-caption text-medium-emphasis d-flex align-center ga-1">
    <span>instance</span>
    <v-chip color="concept" variant="outlined" size="small" link @click="navigate(target)">
      {{ conceptLabel(target) ?? target }}
    </v-chip>
  </div>
</template>
