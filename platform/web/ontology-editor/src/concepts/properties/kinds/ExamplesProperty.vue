<script setup lang="ts">
import { computed } from 'vue'
import type { Property } from '@/concepts/properties/Property'
import { firstOfKind } from '@/concepts/properties/Property'
import type { Instance } from '@/concepts/instances/Instance'
import { useOntology } from '@/concepts/ontology/useOntology'

// `examples` value identities reference Example instances — each one pairs a
// linked `instance` (a concept, shown as a link) with a `description` of it in
// this context.
const props = defineProps<{ property: Property; instance: Instance }>()
const { ontology, conceptLabel, navigate } = useOntology()

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
    const target = linked ? literal(linked.value) : id
    return {
      key: id,
      target,
      label: conceptLabel(target) ?? target,
      description: description ? literal(description.value) : undefined,
    }
  })
})
</script>

<template>
  <div>
    <h3 class="text-left mb-1">Examples</h3>
    <ul class="examples-list">
      <li v-for="ex in examples" :key="ex.key">
        <a href="#" class="link" @click.prevent="navigate(ex.target)">{{ ex.label }}</a
        ><template v-if="ex.description">&nbsp;&mdash;&nbsp;{{ ex.description }}</template>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.examples-list {
  list-style: disc;
  padding-left: 1.25em;
  margin: 0;
}
.examples-list li + li {
  margin-top: 0.75em;
}
.link {
  color: rgb(var(--v-theme-concept));
  text-decoration: none;
  border-bottom: 2px solid currentColor;
}
</style>
