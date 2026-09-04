<script setup lang="ts">
import { computed } from 'vue'
import type { Property } from '@/concepts/properties/Property'
import type { Instance } from '@/concepts/instances/Instance'

// Renders a literal list of strings as a titled list — ordered when the
// values form a sequence (e.g. `layers`), unordered otherwise (e.g.
// `concerns`). Used for property kinds with no cross-references to resolve,
// unlike `examples`/`transactions`/`concepts`.
const props = defineProps<{ property: Property; instance: Instance }>()

const ORDERED_KINDS = new Set(['layers'])

const title = computed(() => props.property.kind[0].toUpperCase() + props.property.kind.slice(1))
const ordered = computed(() => ORDERED_KINDS.has(props.property.kind))
const items = computed(() =>
  Array.isArray(props.property.value) ? props.property.value : [props.property.value],
)
</script>

<template>
  <div>
    <h3 class="text-left mb-1">{{ title }}</h3>
    <component :is="ordered ? 'ol' : 'ul'" class="string-list">
      <li v-for="(item, i) in items" :key="i">{{ item }}</li>
    </component>
  </div>
</template>

<style scoped>
.string-list {
  padding-left: 1.25em;
  margin: 0;
  text-align: left;
}
.string-list li + li {
  margin-top: 0.25em;
}
</style>
