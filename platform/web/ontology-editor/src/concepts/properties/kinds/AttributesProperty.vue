<script setup lang="ts">
import { computed } from 'vue'
import type { Instance } from '@/concepts/instances/Instance'
import type { Property } from '@/concepts/properties/Property'
import { firstOfKind } from '@/concepts/properties/Property'
import { instanceName, instanceSlug } from '@/concepts/instances/Instance'
import { useOntology } from '@/concepts/ontology/useOntology'
import { nameText, textText } from '@/concepts/ontology/Ontology'
import { propertyLabel } from '@/concepts/attributes/Attribute'
import ConceptText from '@/concepts/concept-links/ConceptText.vue'

const props = defineProps<{ property: Property; instance: Instance }>()
const { ontology, language, navigate } = useOntology()
const title = computed(() => propertyLabel(ontology(), props.instance, props.property.kind, language()))

function literal(value: Property['value']): string {
  return Array.isArray(value) ? (value[0] ?? '') : value
}

function definitionOf(instance: Instance | undefined): string | undefined {
  const definition = instance ? firstOfKind(instance, 'definition') : undefined
  if (!definition) return undefined
  const value = literal(definition.value)
  return textText(ontology(), value, language()) ?? value
}

const attributes = computed(() => {
  const ids = Array.isArray(props.property.value)
    ? props.property.value
    : [props.property.value]

  return ids.map((id) => {
    const attribute = ontology().instances[id]
    const nameId = attribute ? instanceName(attribute) : undefined
    const name = nameId ? nameText(ontology(), nameId, language()) : undefined
    const label = name ?? (attribute ? instanceSlug(attribute) : undefined) ?? id
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
    <h3 class="text-left mb-1">{{ title }}</h3>
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
