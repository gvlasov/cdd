<script setup lang="ts">
import { computed } from 'vue'
import type { Instance } from './Instance'
import { propertyKind } from '@/concepts/properties/kinds/property-kinds'

// The central component: renders one instance as its properties, in
// kind-position order. Equal positions keep source order. A concept's
// `attributes` are NOT drawn here — they belong below the instance, not inside.
const props = defineProps<{ instance: Instance }>()

const drawn = computed(() =>
  [...props.instance]
    .map((property, i) => ({ property, i, kind: propertyKind(property.kind) }))
    .filter((x) => x.kind?.render && x.property.kind !== 'attributes')
    .sort((a, b) => a.kind.position - b.kind.position || a.i - b.i),
)
</script>

<template>
  <v-card variant="outlined" class="flex-grow-1 d-flex align-center overflow-auto">
    <v-card-text class="d-flex flex-column ga-4 align-center">
      <component
        :is="entry.kind.render"
        v-for="entry in drawn"
        :key="entry.i"
        :property="entry.property"
        :concept="instance"
      />
    </v-card-text>
  </v-card>
</template>
