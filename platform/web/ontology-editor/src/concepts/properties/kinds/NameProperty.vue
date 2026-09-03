<script setup lang="ts">
import { computed } from 'vue'
import type { Property } from '@/concepts/properties/Property'
import type { Instance } from '@/concepts/instances/Instance'
import { instanceSlug, instanceType, instanceIdentity } from '@/concepts/instances/Instance'
import { conceptLabelOf, conceptSlug, conceptAttributes } from '@/concepts/concepts/Concept'
import { conceptOf } from '@/concepts/ontology/Ontology'
import { attributeType } from '@/concepts/attributes/Attribute'
import { useOntology } from '@/concepts/ontology/useOntology'

// `name` renders as the instance's title. For an attribute instance the title
// is "<owner concept> · <attribute name>", the owner being a navigable link.
// When the attribute's slug matches its type concept's slug, the name part
// also links — to the type concept.
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

// The type concept, linked from the name when its slug equals the attribute's.
const nameLink = computed(() => {
  if (!isAttribute.value) return undefined
  const typeId = attributeType(props.instance)
  if (!typeId) return undefined
  const type = conceptOf(ontology(), typeId)
  if (type && conceptSlug(type) === slug.value) return typeId
  return undefined
})
</script>

<template>
  <div class="d-flex align-baseline ga-2 justify-center flex-wrap">
    <h1 class="text-h3">
      <template v-if="isAttribute && owner"
        ><a class="link" href="#" @click.prevent="navigate(owner.id)">{{
          owner.label
        }}</a><span class="text-medium-emphasis">&nbsp;·&nbsp;</span></template
      ><a
        v-if="nameLink"
        class="link"
        href="#"
        @click.prevent="navigate(nameLink)"
        >{{ property.value }}</a
      ><template v-else>{{ property.value }}</template>
    </h1>
    <code v-if="slug" class="text-caption text-disabled">{{ slug }}</code>
  </div>
</template>

<style scoped>
.link {
  color: rgb(var(--v-theme-concept));
  text-decoration: none;
  border-bottom: 2px solid currentColor;
}
</style>
