<script setup lang="ts">
import { ref } from 'vue'
import type { Ontology } from '@/concepts/ontology/Ontology'
import type { Reality } from '@/concepts/reality/Reality'
import type { OntologyModule } from '@/concepts/ontology/loadOntology'
import { loadOntology } from '@/concepts/ontology/loadOntology'
import { emptyReality } from '@/concepts/reality/Reality'
import OntologyEditor from '@/concepts/ontology/OntologyEditor.vue'

// Loads this repo's own ontology from concepts/**/*.ts (one file per
// concept — see concepts/concepts/Concept-ontology.ts for the shape).
const modules = import.meta.glob<{ default: OntologyModule }>(
  '../../../../../../concepts/**/*.ts',
  { eager: true },
)
const ontology = ref<Ontology>(loadOntology(modules, 'cdd'))
const reality = ref<Reality>(emptyReality())
</script>

<template>
  <v-app>
    <v-main>
      <v-container fluid>
        <div style="height: 80vh">
          <OntologyEditor
            v-model="ontology"
            v-model:reality="reality"
            root-id="cdd.concept"
            editable
            history
          />
        </div>
      </v-container>
    </v-main>
  </v-app>
</template>
