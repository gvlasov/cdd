<script setup lang="ts">
import { computed } from 'vue'
import type { Property } from '@/concepts/properties/Property'
import type { Instance } from '@/concepts/instances/Instance'
import { instanceSlug } from '@/concepts/instances/Instance'
import { conceptSlug } from '@/concepts/concepts/Concept'
import { conceptOf } from '@/concepts/ontology/Ontology'
import { useOntology } from '@/concepts/ontology/useOntology'

// `type` references the concept an attribute's value is an instance of.
// Hidden when the attribute's slug matches its type's slug — the title's name
// part already links to the type then.
const props = defineProps<{ property: Property; instance: Instance }>()
const { conceptLabel, navigate, ontology } = useOntology()

const target = computed(() => String(props.property.value))
const redundant = computed(() => {
  const type = conceptOf(ontology(), target.value)
  return !!type && conceptSlug(type) === instanceSlug(props.instance)
})
</script>

<template>
  <div
    v-if="!redundant"
    class="text-caption text-medium-emphasis d-flex align-center ga-1"
  >
    <span>type</span>
    <v-chip color="concept" variant="outlined" size="small" link @click="navigate(target)">
      {{ conceptLabel(target) ?? target }}
    </v-chip>
  </div>
</template>
