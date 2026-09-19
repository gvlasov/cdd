<script setup lang="ts">
import { computed } from 'vue'
import type { Property } from '@/concepts/properties/Property'
import { firstOfKind } from '@/concepts/properties/Property'
import type { Instance } from '@/concepts/instances/Instance'
import { useOntology } from '@/concepts/ontology/useOntology'
import ConceptText from '@/concepts/concept-links/ConceptText.vue'

// `examples` value identities reference Example instances — each one pairs an
// optional linked `instance` (a concept, shown as a link) with a
// `description`. An example with no linked instance is plain text: just its
// description, rendered without a link.
const props = defineProps<{ property: Property; instance: Instance }>()
const { ontology, conceptLabel, navigate } = useOntology()

const title = computed(() => props.property.kind[0].toUpperCase() + props.property.kind.slice(1))

function literal(value: Property['value']): string {
  return Array.isArray(value) ? (value[0] ?? '') : value
}

const examples = computed(() => {
  const ids = Array.isArray(props.property.value)
    ? props.property.value
    : [props.property.value]
  return ids.map((id) => {
    const example = ontology().instances[id]
    const linked = example ? firstOfKind(example, 'instance') : undefined
    const description = example ? firstOfKind(example, 'description') : undefined
    const target = linked ? literal(linked.value) : undefined
    const descriptionText = description ? literal(description.value) : undefined
    return {
      key: id,
      target,
      label: target ? (conceptLabel(target) ?? target) : undefined,
      description: descriptionText,
    }
  })
})
</script>

<template>
  <div>
    <h3 class="text-left mb-1">{{ title }}</h3>
    <ul class="rich-text-list">
      <li v-for="ex in examples" :key="ex.key">
        <template v-if="ex.target"
          ><a href="#" class="link" @click.prevent="navigate(ex.target)">{{ ex.label }}</a
          ><template v-if="ex.description"
            >&nbsp;&mdash;&nbsp;<ConceptText :text="ex.description" /></template
        ></template>
        <ConceptText v-else :text="ex.description ?? ''" />
      </li>
    </ul>
  </div>
</template>

<style scoped src="./rich-text-list.css"></style>

<style scoped>
.link {
  color: rgb(var(--v-theme-concept));
  text-decoration: none;
  border-bottom: 2px solid currentColor;
}
</style>
