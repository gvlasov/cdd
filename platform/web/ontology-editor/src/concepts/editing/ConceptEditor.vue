<script setup lang="ts">
import { computed } from 'vue'
import type { Identity } from '@/concepts/identity/Identity'
import type { Ontology } from '@/concepts/ontology/Ontology'
import { conceptOf } from '@/concepts/ontology/Ontology'
import { propertyKind } from '@/concepts/properties/kinds/property-kinds'
import PropertyEditor from './PropertyEditor.vue'

// Edits the currently open concept: one editor per existing property, ordered
// by property-kind position. Adding/removing properties is out of scope here.
const props = defineProps<{ ontology: Ontology; conceptId: Identity }>()

const concept = computed(() => conceptOf(props.ontology, props.conceptId))

const editable = computed(() =>
  [...(concept.value ?? [])]
    .map((property, i) => ({ property, i, position: propertyKind(property.kind)?.position ?? 99 }))
    .sort((a, b) => a.position - b.position || a.i - b.i),
)
</script>

<template>
  <v-card variant="outlined" class="flex-grow-1 overflow-auto">
    <v-card-text v-if="concept" class="d-flex flex-column ga-4">
      <PropertyEditor
        v-for="entry in editable"
        :key="entry.property.kind"
        :instance-id="conceptId"
        :property="entry.property"
      />
    </v-card-text>
    <v-card-text v-else class="text-medium-emphasis">
      Unknown concept: {{ conceptId }}
    </v-card-text>
  </v-card>
</template>
