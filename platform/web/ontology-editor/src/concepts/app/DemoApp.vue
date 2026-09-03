<script setup lang="ts">
import { ref } from 'vue'
import type { Ontology } from '@/concepts/ontology/Ontology'
import type { Reality } from '@/concepts/reality/Reality'
import { sampleOntology } from '@/concepts/ontology/sample-ontology'
import { emptyReality } from '@/concepts/reality/Reality'
import OntologyEditor from '@/concepts/ontology/OntologyEditor.vue'

const ontology = ref<Ontology>(sampleOntology)
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
          />
        </div>
      </v-container>
    </v-main>
  </v-app>
</template>
