<script setup lang="ts">
import { computed } from 'vue'
import type { Property } from '@/concepts/properties/Property'
import type { Instance } from '@/concepts/instances/Instance'

const props = defineProps<{ property: Property; instance: Instance }>()

const code = computed(() =>
  Array.isArray(props.property.value) ? props.property.value.join('\n') : props.property.value,
)
</script>

<template>
  <pre class="effect-code text-caption pa-3">{{ code }}</pre>
</template>

<style scoped>
.effect-code {
  width: 100%;
  overflow-x: auto;
  border-radius: 6px;
  background: rgb(var(--v-theme-on-surface) / 0.06);
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  white-space: pre;
}
</style>
