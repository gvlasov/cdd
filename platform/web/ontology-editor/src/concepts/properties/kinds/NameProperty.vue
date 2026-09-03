<script setup lang="ts">
import { computed } from 'vue'
import type { Property } from '@/concepts/properties/Property'
import type { Instance } from '@/concepts/instances/Instance'
import { instanceSlug, instanceType, instanceIdentity } from '@/concepts/instances/Instance'
import { conceptLabelOf, conceptAttributes } from '@/concepts/concepts/Concept'
import { conceptOf } from '@/concepts/ontology/Ontology'
import { useOntology } from '@/concepts/ontology/useOntology'

// `name` renders as the instance's title. For an attribute instance the title
// is "<owner concept> · <attribute name>", the owner being a navigable link.
const props = defineProps<{ property: Property; instance: Instance }>()

const { ontology, navigate } = useOntology()

const slug = computed(() => instanceSlug(props.instance))
const isAttribute = computed(() => instanceType(props.instance) === 'cdd.attribute')

// The concept whose `attributes` list holds this attribute.
const owner = computed(() => {
  const myId = instanceIdentity(props.instance)
  if (!myId) return undefined
  for (const [id, inst] of Object.entries(ontology().instances)) {
    if (conceptAttributes(inst).includes(myId)) {
      return { id, label: conceptLabelOf(conceptOf(ontology(), id) ?? []) ?? id }
    }
  }
  return undefined
})
</script>

<template>
  <div class="d-flex align-baseline ga-2 justify-center flex-wrap">
    <h1 class="text-h3">
      <template v-if="isAttribute && owner">
        <a class="owner-link" href="#" @click.prevent="navigate(owner.id)">{{ owner.label }}</a>
        <span class="mx-1 text-medium-emphasis">·</span>
      </template>
      {{ property.value }}
    </h1>
    <code v-if="slug" class="text-caption text-disabled">{{ slug }}</code>
  </div>
</template>

<style scoped>
.owner-link {
  color: rgb(var(--v-theme-concept));
  text-decoration: none;
  border-bottom: 2px solid currentColor;
}
</style>
