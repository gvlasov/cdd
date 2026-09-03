<script setup lang="ts">
import { computed } from 'vue'
import type { Attribute } from '@/concepts/attributes/Attribute'
import type { Concept } from '@/concepts/concepts/Concept'
import { useOntology } from '@/concepts/ontology/useOntology'

// `examples` value identity references a concept whose own attributes are the
// individual examples. Fall back to showing the raw value if it is a literal.
const props = defineProps<{ attribute: Attribute; concept: Concept }>()
const { conceptLabel } = useOntology()

const items = computed(() => {
  const referenced = props.attribute.value
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
