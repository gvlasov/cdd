<script setup lang="ts">
import { computed } from 'vue'
import type { Property } from '@/concepts/properties/Property'
import { firstOfKind } from '@/concepts/properties/Property'
import type { Instance } from '@/concepts/instances/Instance'
import { useOntology } from '@/concepts/ontology/useOntology'
import ConceptText from '@/concepts/concept-links/ConceptText.vue'

// `concepts` value identities are the concepts an ontology contains — listed
// here as name (linking to the concept) plus its definition text.
const props = defineProps<{ property: Property; instance: Instance }>()
const { ontology, conceptLabel, navigate } = useOntology()

function literal(value: Property['value']): string {
  return Array.isArray(value) ? (value[0] ?? '') : value
}

const concepts = computed(() => {
  const ids = Array.isArray(props.property.value)
    ? props.property.value
    : [props.property.value]
  return ids.map((id) => {
    const instance = ontology().instances[id]
    const definition = instance ? firstOfKind(instance, 'definition') : undefined
    return {
      id,
      label: conceptLabel(id) ?? id,
      definition: definition ? literal(definition.value) : undefined,
    }
  })
})
</script>

<template>
  <div>
    <h3 class="text-left mb-1">Concepts</h3>
    <ul class="concepts-list">
      <li v-for="c in concepts" :key="c.id">
        <a href="#" class="link" @click.prevent="navigate(c.id)">{{ c.label }}</a
        ><template v-if="c.definition">&nbsp;&mdash;&nbsp;<ConceptText :text="c.definition" /></template>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.concepts-list {
  list-style: disc;
  padding-left: 1.25em;
  margin: 0;
}
.link {
  color: rgb(var(--v-theme-concept));
  text-decoration: none;
  border-bottom: 2px solid currentColor;
}
</style>
