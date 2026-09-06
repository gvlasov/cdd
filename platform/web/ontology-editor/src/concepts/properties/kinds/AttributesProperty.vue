<script setup lang="ts">
import { computed } from 'vue'
import type { Instance } from '@/concepts/instances/Instance'
import type { Property } from '@/concepts/properties/Property'
import { firstOfKind } from '@/concepts/properties/Property'
import { attributeType } from '@/concepts/attributes/Attribute'
import { useOntology } from '@/concepts/ontology/useOntology'
import ConceptText from '@/concepts/concept-links/ConceptText.vue'

const props = defineProps<{ property: Property; instance: Instance }>()
const { ontology, conceptLabel, navigate } = useOntology()

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
    // An attribute's type is the concept that gives the slot its meaning:
    // `cdd.concept:slug` therefore presents as the `Slug` concept, rather
    // than as the local implementation attribute named `slug`.
    const displayedId = attribute ? (attributeType(attribute) ?? id) : id
    const displayed = ontology().instances[displayedId]
    return {
      id: displayedId,
      label: conceptLabel(displayedId) ?? displayedId,
      definition: definitionOf(displayed),
    }
  })
})
</script>

<template>
  <div>
    <h3 class="text-left mb-1">Attributes</h3>
    <ul class="attributes-list">
      <li v-for="attribute in attributes" :key="attribute.id">
        <a href="#" class="link" @click.prevent="navigate(attribute.id)">{{ attribute.label }}</a>
        <template v-if="attribute.definition">
          &nbsp;&mdash;&nbsp;<ConceptText :text="attribute.definition" />
        </template>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.attributes-list {
  list-style: disc;
  padding-left: 1.25em;
  margin: 0;
}
.attributes-list li + li {
  margin-top: 0.75em;
}
.link {
  color: rgb(var(--v-theme-attribute));
  text-decoration: none;
  border-bottom: 2px solid currentColor;
}
</style>
