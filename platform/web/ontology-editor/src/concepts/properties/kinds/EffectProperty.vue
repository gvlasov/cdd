<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Property } from '@/concepts/properties/Property'
import type { Instance } from '@/concepts/instances/Instance'
import { instanceIdentity } from '@/concepts/instances/Instance'
import { transactionParams } from '@/concepts/transactions/Transaction'
import { useOntology } from '@/concepts/ontology/useOntology'

const props = defineProps<{ property: Property; instance: Instance }>()

const { runTransaction } = useOntology()

const code = computed(() =>
  Array.isArray(props.property.value) ? props.property.value.join('\n') : props.property.value,
)

const transactionId = computed(() => instanceIdentity(props.instance))
const params = computed(() => transactionParams(props.instance))

const open = ref(false)
const inputs = ref<Record<string, string>>({})

function start() {
  inputs.value = Object.fromEntries(params.value.map((p) => [p, '']))
  open.value = true
}

function run() {
  if (!transactionId.value) return
  runTransaction(transactionId.value, { ...inputs.value })
  open.value = false
}
</script>

<template>
  <div class="d-flex flex-column ga-3">
    <v-textarea
      :model-value="code"
      label="effect"
      variant="outlined"
      density="comfortable"
      readonly
      auto-grow
      hide-details
      class="effect-code"
    />
    <v-btn
      v-if="transactionId"
      prepend-icon="mdi-play"
      color="relation"
      variant="tonal"
      size="small"
      class="align-self-start"
      @click="start"
    >
      Run
    </v-btn>
  </div>

  <v-dialog v-model="open" max-width="420">
    <v-card>
      <v-card-title>Run {{ transactionId }}</v-card-title>
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
        <v-btn variant="text" @click="open = false">Cancel</v-btn>
        <v-btn color="primary" variant="tonal" @click="run">Run</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.effect-code :deep(textarea) {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.85rem;
}
</style>
