<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import type { Ontology } from '@/concepts/ontology/Ontology'
import type { Reality } from '@/concepts/reality/Reality'
import type { OntologyModule } from '@/concepts/ontology/loadOntology'
import { loadOntology } from '@/concepts/ontology/loadOntology'
import { CddXmlError, parseCdd, serializeCdd } from '@/concepts/ontology/cddXml'
import { emptyReality } from '@/concepts/reality/Reality'
import OntologyEditor from '@/concepts/ontology/OntologyEditor.vue'
import { restFileStore } from '@/concepts/files/restFileStore'
import OntologiesPage from '@/concepts/ontologies/OntologiesPage.vue'
import type { AvailableOntology } from '@/concepts/ontologies/OntologyRepository'
import { CommonOntologiesRepository } from '@/concepts/ontologies/CommonOntologiesRepository'
import { SourceCodeOntologiesRepository } from '@/concepts/ontologies/SourceCodeOntologiesRepository'
import { FileOntologiesRepository } from '@/concepts/ontologies/FileOntologiesRepository'
import { OnlineOntologiesRepository } from '@/concepts/ontologies/OnlineOntologiesRepository'
import { DatabaseOntologiesRepository } from '@/concepts/ontologies/DatabaseOntologiesRepository'

const cddModules = import.meta.glob<{ default: OntologyModule }>('../../../../../../concepts/**/*.ts', { eager: true })
const sampleModules = import.meta.glob<{ default: OntologyModule }>('../ontologies/sample-ontology.ts', { eager: true })
const sourceCodeRepository = new SourceCodeOntologiesRepository([
  { id: 'source:cdd', name: 'CDD', source: 'source-code', description: 'This project’s authored CDD ontology', ontology: loadOntology(cddModules, 'cdd'), editable: false },
  { id: 'source:garden', name: 'Garden', source: 'source-code', description: 'Small sample ontology authored in TypeScript', ontology: loadOntology(sampleModules, 'garden'), editable: false },
])
const fileRepository = new FileOntologiesRepository()
const ontologiesRepository = new CommonOntologiesRepository([sourceCodeRepository, fileRepository, new OnlineOntologiesRepository(), new DatabaseOntologiesRepository()])
const initialOntologyId = new URLSearchParams(window.location.search).get('ontology')
const current = ref<AvailableOntology | undefined>(ontologiesRepository.list().find((ontology) => ontology.id === initialOntologyId))
const showingOntologies = ref(!current.value)
const reality = ref<Reality>(emptyReality())
const fileError = ref('')
const cddFile = ref<HTMLInputElement>()
const ontologies = computed(() => ontologiesRepository.list())
function updateOntology(value: Ontology) { if (current.value) current.value = { ...current.value, ontology: value } }
const fileStore = computed(() => current.value && restFileStore('api', current.value.ontology.root))
function openOntology(selected: AvailableOntology) { current.value = selected; showingOntologies.value = false; reality.value = emptyReality(); fileError.value = '' }
function closeOntologies() { if (current.value) showingOntologies.value = false }
function onKeydown(event: KeyboardEvent) { if (event.key === 'Escape' && showingOntologies.value && current.value) { event.preventDefault(); closeOntologies() } }
onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
function openOntologyInNewTab(selected: AvailableOntology) {
  const url = new URL(window.location.href)
  url.searchParams.set('ontology', selected.id)
  window.open(url, '_blank', 'noopener')
}
function openCdd(event: Event) {
  const input = event.target as HTMLInputElement; const file = input.files?.[0]; input.value = ''
  if (!file) return
  file.text().then((xml) => { const parsed = parseCdd(xml); const selected = { id: `file:${file.name}:${Date.now()}`, name: file.name.replace(/\.cdd$/i, ''), source: 'file' as const, description: file.name, ontology: parsed }; fileRepository.add(selected); openOntology(selected) }).catch((error: unknown) => { fileError.value = error instanceof CddXmlError || error instanceof Error ? error.message : String(error) })
}
function downloadCdd() {
  if (!current.value) return
  const url = URL.createObjectURL(new Blob([serializeCdd(current.value.ontology)], { type: 'application/xml;charset=utf-8' }))
  const link = document.createElement('a'); link.href = url; link.download = `${current.value.ontology.root}.cdd`; link.click(); URL.revokeObjectURL(url)
}
</script>
<template><v-app><v-main><v-container fluid><input ref="cddFile" type="file" accept=".cdd,application/xml,text/xml" class="d-none" @change="openCdd" /><OntologiesPage v-if="showingOntologies" :ontologies="ontologies" @open="openOntology" @open-in-new-tab="openOntologyInNewTab" @select-file="cddFile?.click()" /><template v-else-if="current"><OntologyEditor :model-value="current.ontology" v-model:reality="reality" :root-id="current.ontology.root === 'cdd' ? 'cdd.concept' : undefined" :file-store="fileStore" :editable="current.editable !== false" history @update:model-value="updateOntology"><template #utility-rail><v-tooltip text="Ontologies" location="left" :open-delay="0"><template #activator="{ props }"><v-btn v-bind="props" icon="mdi-vector-triangle" variant="text" size="small" aria-label="Ontologies" @click="showingOntologies = true" /></template></v-tooltip><v-tooltip text="Download .cdd" location="left" :open-delay="0"><template #activator="{ props }"><v-btn v-bind="props" icon="mdi-download" variant="text" size="small" aria-label="Download .cdd" @click="downloadCdd" /></template></v-tooltip></template></OntologyEditor><v-alert v-if="fileError" type="error" density="compact" class="mt-2">{{ fileError }}</v-alert></template></v-container></v-main></v-app></template>
