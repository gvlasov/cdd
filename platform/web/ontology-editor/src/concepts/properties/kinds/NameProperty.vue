<script setup lang="ts">
import { computed } from 'vue'
import type { Property } from '@/concepts/properties/Property'
import type { Instance } from '@/concepts/instances/Instance'
import { instanceType, instanceIdentity } from '@/concepts/instances/Instance'
import { conceptLabelOf, conceptAttributes } from '@/concepts/concepts/Concept'
import { conceptOf } from '@/concepts/ontology/Ontology'
import {
  attributeType,
  attributeCardinality,
  soleOwningAttribute,
} from '@/concepts/attributes/Attribute'
import { useOntology } from '@/concepts/ontology/useOntology'

// `name` renders as the instance's title. For an attribute instance the title
// is "<owner concept> · <attribute name>", the owner being a navigable link —
// followed on the same line by the attribute's type (also a link) and its
// cardinality as a superscript. `type` itself does not render separately.
const props = defineProps<{ property: Property; instance: Instance }>()

const { ontology, navigate, conceptLabel } = useOntology()

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

// Skip the type link when the type exists purely to shape this one attribute
// — the attribute's own page already stands in for it, so naming it again as
// a type would be redundant.
const typeId = computed(() => {
  if (!isAttribute.value) return undefined
  const type = attributeType(props.instance)
  if (!type) return undefined
  const myId = instanceIdentity(props.instance)
  if (myId && soleOwningAttribute(ontology(), type) === myId) return undefined
  return type
})
const cardinality = computed(() => attributeCardinality(props.instance))
</script>

<template>
  <h1 class="text-h3 title">
    <template v-if="isAttribute && owner"
      ><a class="link" href="#" @click.prevent="navigate(owner.id)">{{
        owner.label
      }}</a><span class="text-medium-emphasis">.</span></template
    >{{ property.value
    }}<template v-if="typeId"
      ><span class="text-medium-emphasis">:&nbsp;</span
      ><a class="link type-link" href="#" @click.prevent="navigate(typeId)">{{
        conceptLabel(typeId) ?? typeId
      }}</a
      ><sup class="text-medium-emphasis cardinality">{{ cardinality }}</sup></template
    >
  </h1>
</template>

<style scoped>
.title {
  white-space: nowrap;
}
.link {
  color: rgb(var(--v-theme-concept));
  text-decoration: none;
  border-bottom: 2px solid currentColor;
}
.type-link {
  font-size: 1rem;
  border-bottom-width: 1px;
}
.cardinality {
  font-size: 0.75rem;
}
</style>
