<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Property } from '@/concepts/properties/Property'
import type { Instance } from '@/concepts/instances/Instance'
import { useOntology } from '@/concepts/ontology/useOntology'
import { transactionName, transactionOf, transactionParams } from '@/concepts/transactions/Transaction'

// `transactions` value identities reference transaction instances the concept
// exposes. Each list item links to its transaction and has an adjacent action
// for running it against the reality.
const props = defineProps<{ property: Property; instance: Instance }>()
const { ontology, navigate, runTransaction } = useOntology()

const ids = computed(() =>
  Array.isArray(props.property.value) ? props.property.value : [props.property.value],
)
const transactions = computed(() =>
  ids.value.map((id) => {
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
  inputs.value = Object.fromEntries(params.map((param) => [param, '']))
}

function run() {
  if (!open.value) return
  runTransaction(open.value, { ...inputs.value })
  open.value = null
}
</script>

<template>
  <div>
    <h3 class="text-left mb-1">Transactions</h3>
    <ul class="transactions-list">
      <li v-for="t in transactions" :key="t.id">
        <a href="#" class="link" @click.prevent="navigate(t.id)">{{ t.label }}</a>
        <v-btn
          :aria-label="`Run ${t.label}`"
          icon="mdi-play"
          color="relation"
          variant="text"
          size="x-small"
          @click="start(t.id, t.params)"
        />
      </li>
    </ul>

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
  </div>
</template>

<style scoped>
.transactions-list {
  list-style: disc;
  padding-left: 1.25em;
  margin: 0;
}
.link {
  color: rgb(var(--v-theme-concept));
  text-decoration: none;
  border-bottom: 2px solid currentColor;
}
</style>
