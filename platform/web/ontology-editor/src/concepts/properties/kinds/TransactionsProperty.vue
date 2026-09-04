<script setup lang="ts">
import { computed } from 'vue'
import type { Property } from '@/concepts/properties/Property'
import type { Instance } from '@/concepts/instances/Instance'
import { useOntology } from '@/concepts/ontology/useOntology'
import { transactionName, transactionOf } from '@/concepts/transactions/Transaction'

// `transactions` value identities reference transaction instances the concept
// exposes — listed here, inside the instance view; running them is handled
// separately by TransactionBar.
const props = defineProps<{ property: Property; instance: Instance }>()
const { ontology, navigate } = useOntology()

const ids = computed(() =>
  Array.isArray(props.property.value) ? props.property.value : [props.property.value],
)
const transactions = computed(() =>
  ids.value.map((id) => ({
    id,
    label: transactionName(id, transactionOf(ontology(), id)),
  })),
)
</script>

<template>
  <div>
    <h3 class="text-left mb-1">Transactions</h3>
    <ul class="transactions-list">
      <li v-for="t in transactions" :key="t.id">
        <a href="#" class="link" @click.prevent="navigate(t.id)">{{ t.label }}</a>
      </li>
    </ul>
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
