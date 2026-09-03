<script setup lang="ts">
import { computed } from 'vue'
import type { Property } from '@/concepts/properties/Property'
import type { Instance } from '@/concepts/instances/Instance'
import { useOntology } from '@/concepts/ontology/useOntology'

// `examples` value identity references a concept whose own properties are the
// individual examples. Fall back to showing the raw value if it is a literal.
const props = defineProps<{ property: Property; instance: Instance }>()
const { conceptLabel } = useOntology()

const items = computed(() => {
  const referenced = String(props.property.value)
  const label = conceptLabel(referenced)
  return label ? [label] : [referenced]
})
</script>

<template>
  <div class="text-center">
    <div class="text-overline text-medium-emphasis">examples</div>
    <ul class="d-inline-flex flex-column ga-1 text-body-2" style="list-style: none; padding: 0">
      <li v-for="item in items" :key="item">{{ item }}</li>
    </ul>
  </div>
</template>
