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
        <h1 class="text-h5 mb-4">CDD Ontology Editor — demo</h1>
        <div style="height: 70vh">
          <OntologyEditor v-model="ontology" />
        </div>
      </v-container>
    </v-main>
  </v-app>
</template>
