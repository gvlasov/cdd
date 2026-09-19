<script setup lang="ts">
import { computed } from 'vue'
import type { Instance } from '@/concepts/instances/Instance'
import type { Property } from '@/concepts/properties/Property'
import { firstOfKind } from '@/concepts/properties/Property'
import { instanceName, instanceSlug } from '@/concepts/instances/Instance'
import { useOntology } from '@/concepts/ontology/useOntology'
import ConceptText from '@/concepts/concept-links/ConceptText.vue'

const props = defineProps<{ property: Property; instance: Instance }>()
const { ontology, navigate } = useOntology()

function literal(value: Property['value']): string {
  return Array.isArray(value) ? (value[0] ?? '') : value
}

function definitionOf(instance: Instance | undefined): string | undefined {
  const definition = instance ? firstOfKind(instance, 'definition') : undefined
  return definition ? literal(definition.value) : undefined
}

const attributes = computed(() => {
  const ids = Array.isArray(props.property.value)
    ? props.property.value
    : [props.property.value]

  return ids.map((id) => {
    const attribute = ontology().instances[id]
    const label = attribute ? (instanceSlug(attribute) ?? instanceName(attribute) ?? id) : id
    const name = attribute ? instanceName(attribute) : undefined
    return {
      id,
      label,
      // Definitions explain the slot itself. Its type is deliberately not
      // displayed here: it is available from the attribute's own page.
      definition: definitionOf(attribute) ?? (name && name !== label ? name : undefined),
    }
  })
})
</script>

<template>
  <div>
    <h3 class="text-left mb-1">Attributes</h3>
    <ul class="rich-text-list">
      <li v-for="attribute in attributes" :key="attribute.id">
        <a href="#" class="link" @click.prevent="navigate(attribute.id)">{{ attribute.label }}</a>
        <template v-if="attribute.definition">
          &nbsp;&mdash;&nbsp;<ConceptText :text="attribute.definition" />
        </template>
      </li>
    </ul>
  </div>
</template>

<style scoped src="./rich-text-list.css"></style>

<style scoped>
.link {
  color: rgb(var(--v-theme-attribute));
  text-decoration: none;
  border-bottom: 2px solid currentColor;
}
</style>
