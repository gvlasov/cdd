<script setup lang="ts">
import { computed } from 'vue'
import { conceptSlug } from '@/concepts/concepts/Concept'
import { conceptOf, rootConcept } from '@/concepts/ontology/Ontology'
import { useOntology } from '@/concepts/ontology/useOntology'
import { parseConceptLinks } from './parseConceptLinks'

// Renders text that may embed [Label](identity) links to other concepts.
// A leading dot in the target means "this ontology": `.attribute` →
// `<rootSlug>.attribute`.
const props = defineProps<{ text: string }>()

const { ontology, navigate } = useOntology()

const rootSlug = computed(() => {
  const root = rootConcept(ontology())
  return root ? conceptSlug(root) : undefined
})

const segments = computed(() => parseConceptLinks(props.text, rootSlug.value))

function known(target: string): boolean {
  return conceptOf(ontology(), target) !== undefined
}
</script>

<template>
  <span>
    <template v-for="(seg, i) in segments" :key="i">
      <a
        v-if="seg.kind === 'link' && known(seg.target)"
        class="concept-link"
        href="#"
        @click.prevent="navigate(seg.target)"
        >{{ seg.label }}</a
      >
      <span v-else-if="seg.kind === 'link'" class="concept-link concept-link--broken">{{
        seg.label
      }}</span>
      <template v-else>{{ seg.text }}</template>
    </template>
  </span>
</template>

<style scoped>
.concept-link {
  color: rgb(var(--v-theme-concept));
  text-decoration: none;
  border-bottom: 1px solid currentColor;
  cursor: pointer;
}
.concept-link--broken {
  color: rgb(var(--v-theme-error));
  cursor: default;
}
</style>
