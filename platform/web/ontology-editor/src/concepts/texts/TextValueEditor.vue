<script setup lang="ts">
import { computed } from 'vue'
import type { Identity } from '@/concepts/identity/Identity'
import { textText } from '@/concepts/ontology/Ontology'
import { useOntology } from '@/concepts/ontology/useOntology'
import { setTextTranslation } from './editText'

const props = defineProps<{ textId: Identity; label: string }>()
const { ontology, language, apply } = useOntology()
const value = computed(() => textText(ontology(), props.textId, language()) ?? '')

function commit(next: string) {
  apply((current) => setTextTranslation(current, props.textId, language(), next))
}
</script>

<template>
  <v-textarea
    :model-value="value"
    :label="label"
    variant="outlined"
    density="comfortable"
    rows="3"
    auto-grow
    hide-details
    @update:model-value="commit($event)"
  />
</template>
