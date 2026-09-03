<script setup lang="ts">
import { computed } from 'vue'
import type { Attribute } from '@/concepts/attributes/Attribute'
import type { Concept } from '@/concepts/concepts/Concept'
import { conceptSlug } from '@/concepts/concepts/Concept'

// `name` renders as the concept's title. If the concept also has a slug, the
// slug is shown right next to the title (the slug renderer stays silent then).
const props = defineProps<{ attribute: Attribute; concept: Concept }>()

const slug = computed(() => conceptSlug(props.concept))
</script>

<template>
  <div class="d-flex align-baseline ga-2 justify-center flex-wrap">
    <h1 class="text-h3">{{ attribute.value }}</h1>
    <code v-if="slug" class="text-caption text-disabled">{{ slug }}</code>
  </div>
</template>
