<script setup lang="ts">
import { ref } from 'vue'
import type { Ontology } from '@/concepts/ontology/Ontology'
import { sampleOntology } from '@/concepts/ontology/sample-ontology'
import OntologyEditor from '@/concepts/ontology/OntologyEditor.vue'

const ontology = ref<Ontology>(sampleOntology)
</script>

<template>
  <v-app>
    <v-main>
      <v-container fluid>
        <div style="height: 70vh">
          <OntologyEditor v-model="ontology" root-id="cdd.concept" editable />
        </div>
      </v-container>
    </v-main>
  </v-app>
</template>
