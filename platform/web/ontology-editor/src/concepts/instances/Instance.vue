<script setup lang="ts">
import { computed } from 'vue'
import type { Instance } from './Instance'
import { isConcept } from '@/concepts/concepts/Concept'
import { instanceType } from './Instance'
import { propertyKind } from '@/concepts/properties/kinds/property-kinds'

// The central component: renders one instance as its properties, in
// kind-position order. Equal positions keep source order. A concept's
// `attributes` are NOT drawn here — they belong below the instance, not inside.
const props = defineProps<{ instance: Instance }>()

// Ground color: `attribute` for an attribute instance, `concept` when it
// declares attributes, else `instance`.
const tone = computed(() => {
  if (instanceType(props.instance) === 'cdd.attribute') return 'attribute'
  return isConcept(props.instance) ? 'concept' : 'instance'
})

const drawn = computed(() =>
  [...props.instance]
    .map((property, i) => ({ property, i, kind: propertyKind(property.kind) }))
    .filter((x) => x.kind?.render && x.property.kind !== 'attributes')
    .sort((a, b) => a.kind.position - b.kind.position || a.i - b.i),
)
</script>

<template>
  <v-card
    :color="tone"
    variant="tonal"
    class="flex-grow-1 d-flex align-center overflow-auto"
  >
    <v-card-text class="d-flex justify-center">
      <div class="d-flex flex-column ga-4" style="max-width: 60ch; width: 100%">
        <component
          :is="entry.kind.render"
          v-for="entry in drawn"
          :key="entry.i"
          :property="entry.property"
          :instance="instance"
        />
      </div>
    </v-card-text>
  </v-card>
</template>
