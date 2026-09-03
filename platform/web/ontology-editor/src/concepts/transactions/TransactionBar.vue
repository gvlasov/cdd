<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Identity } from '@/concepts/identity/Identity'
import { conceptOf } from '@/concepts/ontology/Ontology'
import { useOntology } from '@/concepts/ontology/useOntology'
import {
  conceptTransactions,
  transactionName,
  transactionParams,
  transactionOf,
} from './Transaction'

// The transactions a concept exposes, as buttons. Clicking one opens a params
// form; submitting runs its effect against the reality.
const props = defineProps<{ conceptId: Identity }>()

const { ontology, runTransaction } = useOntology()

const concept = computed(() => conceptOf(ontology(), props.conceptId))
const transactions = computed(() =>
  (concept.value ? conceptTransactions(concept.value) : []).map((id) => {
    const instance = transactionOf(ontology(), id)
    return {
      id,
      label: transactionName(id, instance),
      params: instance ? transactionParams(instance) : [],
    }
  }),
)

const open = ref<string | null>(null)
const inputs = ref<Record<string, string>>({})

function start(id: string, params: string[]) {
  open.value = id
  inputs.value = Object.fromEntries(params.map((p) => [p, '']))
}

function run() {
  if (!open.value) return
  runTransaction(open.value, { ...inputs.value })
  open.value = null
}
</script>

<template>
  <nav v-if="transactions.length" aria-label="Transactions">
    <div class="d-flex flex-wrap ga-3 align-center justify-center">
      <v-btn
        v-for="t in transactions"
        :key="t.id"
        prepend-icon="mdi-play"
        color="relation"
        variant="tonal"
        size="small"
        @click="start(t.id, t.params)"
      >
        {{ t.label }}
      </v-btn>
    </div>

    <v-dialog :model-value="open !== null" max-width="420" @update:model-value="open = null">
      <v-card>
        <v-card-title>{{ open }}</v-card-title>
        <v-card-text class="d-flex flex-column ga-3">
          <v-text-field
            v-for="(_, name) in inputs"
            :key="name"
            v-model="inputs[name]"
            :label="name"
            variant="outlined"
            density="comfortable"
            hide-details
          />
          <span v-if="!Object.keys(inputs).length" class="text-medium-emphasis text-caption">
            no inputs
          </span>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="open = null">Cancel</v-btn>
          <v-btn color="primary" variant="tonal" @click="run">Run</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </nav>
</template>
