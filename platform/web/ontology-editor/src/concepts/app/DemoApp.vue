<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Ontology } from '@/concepts/ontology/Ontology'
import type { Reality } from '@/concepts/reality/Reality'
import type { OntologyModule } from '@/concepts/ontology/loadOntology'
import { loadOntology } from '@/concepts/ontology/loadOntology'
import { CddXmlError, parseCdd, serializeCdd } from '@/concepts/ontology/cddXml'
import { emptyReality } from '@/concepts/reality/Reality'
import OntologyEditor from '@/concepts/ontology/OntologyEditor.vue'
import { restFileStore } from '@/concepts/files/restFileStore'

// Loads this repo's own ontology from concepts/**/*.ts (one file per
// concept — see concepts/concepts/Concept-ontology.ts for the shape).
const modules = import.meta.glob<{ default: OntologyModule }>(
  '../../../../../../concepts/**/*.ts',
  { eager: true },
)
const ontology = ref<Ontology>(loadOntology(modules, 'cdd'))
const reality = ref<Reality>(emptyReality())
// Served by platform/web/file-store behind the same origin (see the Docker
// environment's Caddyfile, and Problemos' /cdd/api route in production).
const fileStore = computed(() => restFileStore('api', ontology.value.root))
const fileError = ref('')
const cddFile = ref<HTMLInputElement>()

function openCdd(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ''
  if (!file) return
  file.text()
    .then((xml) => {
      ontology.value = parseCdd(xml)
      fileError.value = ''
    })
    .catch((error: unknown) => {
      fileError.value = error instanceof CddXmlError || error instanceof Error ? error.message : String(error)
    })
}

function downloadCdd() {
  const blob = new Blob([serializeCdd(ontology.value)], { type: 'application/xml;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${ontology.value.root}.cdd`
  link.click()
  URL.revokeObjectURL(url)
}

</script>

<template>
  <v-app>
    <v-main>
      <v-container fluid>
        <div class="d-flex align-center ga-2 mb-2">
          <v-btn prepend-icon="mdi-folder-open-outline" variant="tonal" size="small" @click="cddFile?.click()">
            Открыть онтологию
          </v-btn>
          <input ref="cddFile" type="file" accept=".cdd,application/xml,text/xml" class="d-none" @change="openCdd" />
          <v-btn prepend-icon="mdi-download" variant="tonal" size="small" @click="downloadCdd">Скачать .cdd</v-btn>
          <span v-if="fileError" class="text-error text-body-2">{{ fileError }}</span>
        </div>
        <div style="height: 80vh">
          <OntologyEditor
            v-model="ontology"
            v-model:reality="reality"
            root-id="cdd.concept"
            :file-store="fileStore"
            editable
            history
          />
        </div>
      </v-container>
    </v-main>
  </v-app>
</template>
