<script setup lang="ts">
import { computed } from 'vue'
import type { Identity } from '@/concepts/identity/Identity'
import { conceptOf } from '@/concepts/ontology/Ontology'
import { instanceType } from '@/concepts/instances/Instance'
import { conceptAttributeSpecs } from '@/concepts/attributes/Attribute'
import { useOntology } from '@/concepts/ontology/useOntology'
import AttributeValueEditor from '@/concepts/attributes/AttributeValueEditor.vue'

// Renders the editable form for one instance: an AttributeValueEditor per
// attribute its type declares. Recursive — structured attribute values embed
// their own InstanceForm. `ancestors` carries the instance ids already open
// above so a cyclic type graph (concept → attribute → type → concept) stops
// expanding.
const props = withDefaults(
  defineProps<{ conceptId: Identity; ancestors?: Identity[] }>(),
  { ancestors: () => [] },
)

const { ontology, navigate } = useOntology()

const cyclic = computed(() => props.ancestors.includes(props.conceptId))
const chain = computed(() => [...props.ancestors, props.conceptId])

const instance = computed(() => conceptOf(ontology(), props.conceptId))
const typeId = computed(() => (instance.value ? instanceType(instance.value) : undefined))
const type = computed(() => (typeId.value ? conceptOf(ontology(), typeId.value) : undefined))
const specs = computed(() =>
  type.value ? conceptAttributeSpecs(ontology(), type.value) : [],
)
</script>

<template>
  <div v-if="cyclic" class="text-caption">
    <a href="#" class="link" @click.prevent="navigate(conceptId)">{{ conceptId }}</a>
    <span class="text-medium-emphasis"> (open separately to edit)</span>
  </div>
  <div v-else-if="instance" class="d-flex flex-column ga-4">
    <AttributeValueEditor
      v-for="spec in specs"
      :key="spec.attribute"
      :owner-id="conceptId"
      :spec="spec"
      :ancestors="chain"
    />
    <div v-if="!specs.length" class="text-caption text-medium-emphasis text-center">
      {{ typeId ? 'this type declares no attributes' : 'no type' }}
    </div>
  </div>
</template>

<style scoped>
.link {
  color: rgb(var(--v-theme-concept));
  text-decoration: none;
  border-bottom: 1px solid currentColor;
}
</style>
