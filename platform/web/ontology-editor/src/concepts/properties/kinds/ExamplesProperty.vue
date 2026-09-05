<script setup lang="ts">
import { computed } from 'vue'
import type { Property } from '@/concepts/properties/Property'
import { firstOfKind } from '@/concepts/properties/Property'
import type { Instance } from '@/concepts/instances/Instance'
import { useOntology } from '@/concepts/ontology/useOntology'
import ConceptText from '@/concepts/concept-links/ConceptText.vue'

// `examples` value identities reference Example instances — each one pairs an
// optional linked `instance` (a concept, shown as a link) with a
// `description`. An example with no linked instance is plain text: just its
// description, rendered without a link.
const props = defineProps<{ property: Property; instance: Instance }>()
const { ontology, conceptLabel, navigate } = useOntology()

const title = computed(() => props.property.kind[0].toUpperCase() + props.property.kind.slice(1))

function literal(value: Property['value']): string {
  return Array.isArray(value) ? (value[0] ?? '') : value
}

// A plain-text description (no linked instance) renders as inline code when
// it's a short literal like `logs:view`, or as parsed text — with markdown
// links and inline code — when it contains a markdown link, since a code
// span can't itself hold a link.
const MARKDOWN_LINK = /\[[^\]]+\]\([^)]+\)/

const examples = computed(() => {
  const ids = Array.isArray(props.property.value)
    ? props.property.value
    : [props.property.value]
  return ids.map((id) => {
    const example = ontology().instances[id]
    const linked = example ? firstOfKind(example, 'instance') : undefined
    const description = example ? firstOfKind(example, 'description') : undefined
    const target = linked ? literal(linked.value) : undefined
    const descriptionText = description ? literal(description.value) : undefined
    return {
      key: id,
      target,
      label: target ? (conceptLabel(target) ?? target) : undefined,
      description: descriptionText,
      descriptionHasLink: descriptionText ? MARKDOWN_LINK.test(descriptionText) : false,
    }
  })
})
</script>

<template>
  <div>
    <h3 class="text-left mb-1">{{ title }}</h3>
    <ul class="examples-list">
      <li v-for="ex in examples" :key="ex.key">
        <template v-if="ex.target"
          ><a href="#" class="link" @click.prevent="navigate(ex.target)">{{ ex.label }}</a
          ><template v-if="ex.description"
            >&nbsp;&mdash;&nbsp;<ConceptText :text="ex.description" /></template
        ></template>
        <ConceptText v-else-if="ex.descriptionHasLink" :text="ex.description ?? ''" />
        <code v-else class="inline-code">{{ ex.description }}</code>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.examples-list {
  list-style: disc;
  padding-left: 1.25em;
  margin: 0;
}
.examples-list li + li {
  margin-top: 0.75em;
}
.link {
  color: rgb(var(--v-theme-concept));
  text-decoration: none;
  border-bottom: 2px solid currentColor;
}
.inline-code {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.9em;
  padding: 0.1em 0.35em;
  border-radius: 4px;
  background: rgb(var(--v-theme-on-surface) / 0.08);
}
</style>
