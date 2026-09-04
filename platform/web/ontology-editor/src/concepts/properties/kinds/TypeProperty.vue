<script setup lang="ts">
import { computed } from 'vue'
import type { Property } from '@/concepts/properties/Property'
import type { Instance } from '@/concepts/instances/Instance'
import { attributeCardinality } from '@/concepts/attributes/Attribute'
import { useOntology } from '@/concepts/ontology/useOntology'

// `type` references the concept an attribute's value is an instance of,
// shown as a plain link with the attribute's cardinality as a superscript.
const props = defineProps<{ property: Property; instance: Instance }>()
const { conceptLabel, navigate } = useOntology()

const target = computed(() => String(props.property.value))
const cardinality = computed(() => attributeCardinality(props.instance))
</script>

<template>
  <div class="text-caption text-medium-emphasis d-flex align-center">
    <a class="link" href="#" @click.prevent="navigate(target)">{{ conceptLabel(target) ?? target }}</a>
    <sup>{{ cardinality }}</sup>
  </div>
</template>

<style scoped>
.link {
  color: rgb(var(--v-theme-concept));
  text-decoration: none;
  border-bottom: 1px solid currentColor;
}
</style>
