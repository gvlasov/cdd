<script setup lang="ts">
import { computed } from 'vue'
import type { Property } from '@/concepts/properties/Property'
import type { Instance } from '@/concepts/instances/Instance'
import { instanceSlug } from '@/concepts/instances/Instance'

// `name` renders as the instance's title. If the instance also has a slug, the
// slug is shown right next to the title (the slug renderer stays silent then).
const props = defineProps<{ property: Property; instance: Instance }>()

const slug = computed(() => instanceSlug(props.instance))
</script>

<template>
  <div class="d-flex align-baseline ga-2 justify-center flex-wrap">
    <h1 class="text-h3">{{ property.value }}</h1>
    <code v-if="slug" class="text-caption text-disabled">{{ slug }}</code>
  </div>
</template>
