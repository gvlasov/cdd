<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, ref, watch } from 'vue'
import type { Ontology } from './Ontology'
import type { Identity } from '@/concepts/identity/Identity'
import type { Slug } from '@/concepts/identity/Slug'
import { isSlug } from '@/concepts/identity/Slug'
import { provideOntology } from './useOntology'
import { ontologyConcepts, conceptOf, nameSynonymTexts } from './Ontology'
import { conceptLabelOf } from '@/concepts/concepts/Concept'
import { attributeSpec, conceptAttributeSpecs, soleOwningAttribute } from '@/concepts/attributes/Attribute'
import { instanceType } from '@/concepts/instances/Instance'
import {
  renameSlug as renameSlugEdit,
  identityAfterSlug,
  createConcept as createConceptEdit,
  newConceptIdentity,
} from '@/concepts/editing/editOntology'
import type { Reality } from '@/concepts/reality/Reality'
import { emptyReality } from '@/concepts/reality/Reality'
import type { TransactionId } from '@/concepts/transactions/Transaction'
import { transactionOf, transactionEffect } from '@/concepts/transactions/Transaction'
import { runEffect } from '@/concepts/transactions/runEffect'
import ConceptView from '@/concepts/concept-view/ConceptView.vue'
import ConceptEditor from '@/concepts/editing/ConceptEditor.vue'
import type { FileStore } from '@/concepts/files/FileStore'

const props = defineProps<{
  /** The ontology to display. */
  modelValue: Ontology
  /** The reality — instances of the ontology's concepts. Optional; defaults empty. */
  reality?: Reality
  /** Identity of the concept to show first. Defaults to the root. */
  rootId?: Identity
  /** Allow entering edit mode and creating concepts. */
  editable?: boolean
  /**
   * Sync the open concept to the URL hash (`#<identity>`) and honour the
   * browser's back / forward buttons. Off by default so an embedding host's
   * history is untouched.
   */
  history?: boolean
  /** Where uploaded files live. Without one, image values take URLs only. */
  fileStore?: FileStore
  /** The language used to display localized Names. Defaults to English. */
  language?: Identity
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: Ontology): void
  (e: 'update:reality', value: Reality): void
  (e: 'update:language', value: Identity): void
}>()

const currentReality = computed(() => props.reality ?? emptyReality())

const firstId = computed(
  () => props.rootId ?? props.modelValue.root ?? Object.keys(props.modelValue.instances)[0] ?? '',
)
const currentId = ref<Identity>(firstId.value)
const editing = ref(false)
const selectedLanguage = ref<Identity>(props.language ?? 'cdd.language:en')
const languageDialog = ref(false)

watch(
  () => props.language,
  (language) => {
    if (language) selectedLanguage.value = language
  },
)

watch(
  () => props.editable,
  (editable) => {
    if (!editable) editing.value = false
  },
)

function selectLanguage(language: Identity) {
  selectedLanguage.value = language
  languageDialog.value = false
  emit('update:language', language)
}

const languageOptions = computed(() =>
  Object.entries(props.modelValue.instances)
    .filter(([, instance]) => instanceType(instance) === 'cdd.language')
    .map(([id, instance]) => ({
      value: id,
      title: conceptLabelOf(props.modelValue, instance, selectedLanguage.value) ?? id,
      subtitle: id,
    }))
    .sort((a, b) => a.title.localeCompare(b.title)),
)

const creating = ref(false)
const newSlug = ref('')
const newConceptError = computed(() => {
  const s = newSlug.value.trim()
  if (!s) return ''
  if (!isSlug(s)) return 'Slug must match [a-zA-Z0-9_-]'
  if (!newConceptIdentity(props.modelValue, s)) return 'That identity is already taken'
  return ''
})

watch(
  () => [props.rootId, props.modelValue] as const,
  () => {
    if (!(currentId.value in props.modelValue.instances)) {
      currentId.value = firstId.value
    }
  },
)

// --- URL-hash history (opt-in via `history`) ---
function hashIdentity(): Identity | '' {
  return decodeURIComponent(window.location.hash.replace(/^#/, ''))
}
function pushHash(identity: Identity) {
  const next = `#${encodeURIComponent(identity)}`
  if (window.location.hash !== next) window.history.pushState({ ontologyConcept: identity }, '', next)
}
function resolveTarget(identity: Identity): Identity {
  return soleOwningAttribute(props.modelValue, identity) ?? identity
}

function onPopState() {
  const id = hashIdentity()
  if (id && id in props.modelValue.instances) {
    currentId.value = resolveTarget(id)
    editing.value = false
  }
}

onMounted(() => {
  if (!props.history) return
  const id = hashIdentity()
  if (id && id in props.modelValue.instances) currentId.value = resolveTarget(id)
  else pushHash(currentId.value)
  window.addEventListener('popstate', onPopState)
})
onBeforeUnmount(() => {
  if (props.history) window.removeEventListener('popstate', onPopState)
})

function navigate(identity: Identity) {
  const target = resolveTarget(identity)
  if (target === currentId.value) return
  currentId.value = target
  editing.value = false
  if (props.history) pushHash(target)
}
function navigateToRoot() {
  navigate(props.modelValue.root)
}

function apply(mutate: (ontology: Ontology) => Ontology) {
  emit('update:modelValue', mutate(props.modelValue))
}

function renameSlug(instanceId: Identity, slug: Slug) {
  const nextId = identityAfterSlug(props.modelValue, instanceId, slug)
  emit('update:modelValue', renameSlugEdit(props.modelValue, instanceId, slug))
  if (currentId.value === instanceId && nextId !== instanceId) {
    currentId.value = nextId
    if (props.history) window.history.replaceState({ ontologyConcept: nextId }, '', `#${encodeURIComponent(nextId)}`)
  }
}

function createConcept(slug: Slug) {
  const id = newConceptIdentity(props.modelValue, slug)
  if (!id) return
  emit('update:modelValue', createConceptEdit(props.modelValue, slug))
  currentId.value = id
  editing.value = true
}

function submitNewConcept() {
  const s = newSlug.value.trim()
  if (!s || newConceptError.value) return
  createConcept(s)
  creating.value = false
  newSlug.value = ''
}

const runError = ref('')

function runTransaction(id: TransactionId, input: unknown) {
  runError.value = ''
  const transaction = transactionOf(props.modelValue, id)
  const effect = transaction ? transactionEffect(transaction) : ''
  if (!effect) {
    runError.value = `Transaction ${id} has no effect`
    return
  }
  try {
    const { reality } = runEffect(effect, input, currentReality.value, props.modelValue)
    emit('update:reality', reality)
  } catch (e) {
    runError.value = e instanceof Error ? e.message : String(e)
  }
}

// Search includes the ontology root, first-class concepts, and attribute-
// concepts. Selecting an attribute-concept still routes to its sole owning
// attribute, so it opens as the inline concept it represents.
const conceptSearchItems = computed(() =>
  [
    props.modelValue.root,
    ...ontologyConcepts(props.modelValue),
    ...Object.entries(props.modelValue.instances)
      .filter(([id, instance]) => instanceType(instance) === 'cdd.concept' && soleOwningAttribute(props.modelValue, id))
      .map(([id]) => id),
  ]
    .filter((id, index, all) => all.indexOf(id) === index)
    .flatMap((id) => {
    const c = conceptOf(props.modelValue, id)
    const label = (c && conceptLabelOf(props.modelValue, c, selectedLanguage.value)) || id
    const name = c?.find((property) => property.kind === 'name')
    const synonyms = name && !Array.isArray(name.value)
      ? nameSynonymTexts(props.modelValue, name.value, selectedLanguage.value).filter((text) => text !== label)
      : []
    return [label, ...synonyms].map((title) => ({ value: id, title }))
    }),
)
const search = ref<Identity | null>(null)
function onSearchSelect(id: Identity | null) {
  if (id) navigate(id)
  search.value = null
}

const currentConcept = computed(() => conceptOf(props.modelValue, currentId.value))
// The masthead identifies the ontology itself, not the CDD editor embedding it.
// A localized Name is used whenever the ontology provides one.
const ontologyName = computed(() => {
  const root = conceptOf(props.modelValue, props.modelValue.root)
  return root ? conceptLabelOf(props.modelValue, root, selectedLanguage.value) ?? props.modelValue.root : props.modelValue.root
})
function ucfirst(value: string) {
  return value ? value.slice(0, 1).toLocaleUpperCase() + value.slice(1) : value
}
const currentAttributeConceptTitle = computed(() => {
  const instance = currentConcept.value
  if (!instance || instanceType(instance) !== 'cdd.attribute') return undefined
  const attribute = attributeSpec(props.modelValue, currentId.value, selectedLanguage.value)
  if (!attribute?.type || soleOwningAttribute(props.modelValue, attribute.type) !== currentId.value) {
    return undefined
  }
  const owner = Object.values(props.modelValue.instances).find((candidate) =>
    conceptAttributeSpecs(props.modelValue, candidate, selectedLanguage.value)
      .some((spec) => spec.attribute === currentId.value),
  )
  const ownerName = owner && conceptLabelOf(props.modelValue, owner, selectedLanguage.value)
  if (!ownerName) return undefined
  return { ownerName: ucfirst(ownerName), attributeName: ucfirst(attribute.name) }
})
const currentTitle = computed(() => {
  const instance = currentConcept.value
  if (!instance) return currentId.value
  if (instanceType(instance) !== 'cdd.attribute') {
    return conceptLabelOf(props.modelValue, instance, selectedLanguage.value) || currentId.value
  }
  if (currentAttributeConceptTitle.value) {
    const { ownerName, attributeName } = currentAttributeConceptTitle.value
    return `${ownerName}.${attributeName}`
  }
  const owner = Object.values(props.modelValue.instances).find((candidate) =>
    conceptAttributeSpecs(props.modelValue, candidate, selectedLanguage.value)
      .some((spec) => spec.attribute === currentId.value),
  )
  const ownerName = owner && conceptLabelOf(props.modelValue, owner, selectedLanguage.value)
  const attributeName = attributeSpec(props.modelValue, currentId.value, selectedLanguage.value)?.name
  return ownerName && attributeName
    ? `${ucfirst(ownerName)}.${attributeName}`
    : conceptLabelOf(props.modelValue, instance, selectedLanguage.value) || currentId.value
})
const currentAttributeType = computed(() => {
  const instance = currentConcept.value
  if (!instance || instanceType(instance) !== 'cdd.attribute') return undefined
  const type = instance.find((property) => property.kind === 'type')?.value
  const typeId = type && (Array.isArray(type) ? type[0] : type)
  if (!typeId) return undefined
  if (soleOwningAttribute(props.modelValue, typeId) === currentId.value) return undefined
  const cardinality = instance.find((property) => property.kind === 'cardinality')?.value
  const cardinalityValue = cardinality && (Array.isArray(cardinality) ? cardinality[0] : cardinality)
  const typeConcept = conceptOf(props.modelValue, typeId)
  const label = typeConcept
    ? conceptLabelOf(props.modelValue, typeConcept, selectedLanguage.value)
    : undefined
  const fallback = typeId.split(/[.:]/).at(-1) ?? typeId
  return {
    id: typeId,
    label: label && label !== typeId ? label : ucfirst(fallback),
    cardinality: cardinalityValue === '1' ? undefined : cardinalityValue,
  }
})
function scrollToProperty(index: number) {
  document
    .getElementById(`instance-property-${currentId.value}-${index}`)
    ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
function scrollToInstanceName() {
  document
    .getElementById(`instance-name-${currentId.value}`)
    ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
const PROPERTY_TREE_SKIP = new Set(['concept', 'definition', 'identity', 'name', 'prototypeImage', 'slug'])
const ATTRIBUTE_PROPERTY_TREE_SKIP = new Set(['type', 'cardinality'])
const currentPropertyAttributes = computed(() => {
  const instance = currentConcept.value
  if (!instance) return []
  const typeId = instanceType(instance)
  const mergedConceptId =
    instanceType(instance) === 'cdd.attribute'
      ? attributeSpec(props.modelValue, currentId.value, selectedLanguage.value)?.type
      : undefined
  const mergedConcept =
    mergedConceptId && soleOwningAttribute(props.modelValue, mergedConceptId) === currentId.value
      ? conceptOf(props.modelValue, mergedConceptId)
      : undefined
  const properties = [
    ...instance.map((property, index) => ({ property, index, typeId })),
    ...(mergedConcept ?? []).map((property, index) => ({
      property,
      index: instance.length + index,
      typeId: mergedConceptId,
    })),
  ]
  const attributeName = (propertyKind: string, ownerTypeId: Identity | undefined) => {
    const type = ownerTypeId ? conceptOf(props.modelValue, ownerTypeId) : undefined
    const attribute = type
      ? conceptAttributeSpecs(props.modelValue, type, selectedLanguage.value).find(
          (candidate) => candidate.slug === propertyKind,
        )
      : undefined
    return ucfirst(attribute?.name ?? propertyKind)
  }
  return properties
    .map(({ property, index, typeId: ownerTypeId }) => ({
      key: `${property.kind}-${index}`,
      index,
      name: attributeName(property.kind, ownerTypeId),
      kind: property.kind,
    }))
    .filter(
      (attribute) =>
        !PROPERTY_TREE_SKIP.has(attribute.kind) &&
        (instanceType(instance) !== 'cdd.attribute' || !ATTRIBUTE_PROPERTY_TREE_SKIP.has(attribute.kind)),
    )
})

provideOntology({
  ontology: () => props.modelValue,
  language: () => selectedLanguage.value,
  reality: () => currentReality.value,
  navigate,
  apply,
  renameSlug,
  createConcept,
  runTransaction,
  fileStore: () => props.fileStore,
})
</script>

<template>
  <div class="ontology-editor">
    <header class="editor-header">
      <button type="button" class="editor-brand" @click="navigateToRoot">
        <v-icon icon="mdi-vector-triangle" size="24" />
        <span>{{ ontologyName }}</span>
      </button>

      <v-autocomplete
        :model-value="search"
        :items="conceptSearchItems"
          placeholder="Concepts"
        prepend-inner-icon="mdi-magnify"
        variant="plain"
        density="comfortable"
        hide-details
        clearable
        auto-select-first
        menu-icon=""
        :menu-props="{ transition: 'concept-menu-transition' }"
        class="editor-search"
        @update:model-value="onSearchSelect"
      />

    </header>

    <div class="editor-layout" :class="{ 'has-utility-rail': editable || $slots['utility-rail'] }">
      <aside class="concept-sidebar">
        <v-list density="compact" class="property-tree">
          <v-list-item
            :title="currentTitle"
            prepend-icon="mdi-circle-medium"
            rounded="lg"
            class="instance-tree-root"
            @click="scrollToInstanceName"
          />
          <v-list-item
            v-for="attribute in currentPropertyAttributes"
            :key="attribute.key"
            :title="attribute.name"
            prepend-icon="mdi-circle-small"
            density="compact"
            class="property-tree-item"
            @click="scrollToProperty(attribute.index)"
          />
        </v-list>
      </aside>

      <main class="selected-instance" :class="{ 'roadmap-instance': currentConcept && instanceType(currentConcept) === 'cdd.roadmap' }">
        <div class="instance-heading">
          <h1 :id="`instance-name-${currentId}`">
            <template v-if="currentAttributeConceptTitle">
              {{ currentAttributeConceptTitle.ownerName
              }}<span class="attribute-concept-separator">&middot;</span>{{ currentAttributeConceptTitle.attributeName }}
            </template>
            <template v-else>{{ currentTitle }}</template>
          </h1>
          <template v-if="currentAttributeType">
            <span class="attribute-separator">·</span>
            <span class="attribute-type-summary">
              <a
                href="#"
                class="attribute-type"
                @click.prevent="navigate(currentAttributeType.id)"
              >{{ currentAttributeType.label }}</a>
              <sup v-if="currentAttributeType.cardinality" class="attribute-cardinality">{{ currentAttributeType.cardinality }}</sup>
            </span>
          </template>
        </div>

        <v-alert
          v-if="runError"
          type="error"
          density="compact"
          closable
          class="mb-4"
          @click:close="runError = ''"
        >
          {{ runError }}
        </v-alert>

        <ConceptEditor v-if="editing && editable" :ontology="modelValue" :concept-id="currentId" />
        <ConceptView v-else :ontology="modelValue" :concept-id="currentId" />
      </main>

      <aside v-if="editable || $slots['utility-rail'] || languageOptions.length" class="utility-rail">
        <template v-if="editable || $slots['utility-rail']">
          <v-tooltip text="New concept" location="left" :open-delay="0">
            <template #activator="{ props: tooltipProps }">
              <span v-bind="tooltipProps" class="tool-tooltip-activator">
                <v-btn icon="mdi-plus" variant="text" size="small" aria-label="New concept" :disabled="!editable" @click="creating = true" />
              </span>
            </template>
          </v-tooltip>
          <v-tooltip :text="editing ? 'Done editing' : 'Edit concept'" location="left" :open-delay="0">
            <template #activator="{ props: tooltipProps }">
              <span v-bind="tooltipProps" class="tool-tooltip-activator">
                <v-btn
                  :icon="editing ? 'mdi-check' : 'mdi-pencil'"
                  :color="editing ? 'primary' : undefined"
                  variant="text"
                  size="small"
                  :aria-label="editing ? 'Done editing' : 'Edit concept'"
                  :disabled="!editable"
                  @click="editing = !editing"
                />
              </span>
            </template>
          </v-tooltip>
        </template>
        <slot name="utility-rail" />
        <v-tooltip text="Language" location="left" :open-delay="0">
          <template #activator="{ props: tooltipProps }">
            <v-btn
              v-bind="tooltipProps"
              icon="mdi-translate"
              variant="text"
              size="small"
              aria-label="Language"
              @click="languageDialog = true"
            />
          </template>
        </v-tooltip>
      </aside>
    </div>

    <v-dialog v-model="languageDialog" max-width="420">
      <v-card title="Language">
        <v-list>
          <v-list-item
            v-for="language in languageOptions"
            :key="language.value"
            :title="language.title"
            :subtitle="language.subtitle"
            :active="language.value === selectedLanguage"
            @click="selectLanguage(language.value)"
          />
        </v-list>
      </v-card>
    </v-dialog>

    <v-dialog v-model="creating" max-width="420">
      <v-card>
        <v-card-text>
          <v-text-field
            v-model="newSlug"
            label="slug"
            placeholder="my-new-concept"
            :error-messages="newConceptError"
            variant="outlined"
            autofocus
            @keydown.enter="submitNewConcept"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="creating = false">Cancel</v-btn>
          <v-btn
            color="primary"
            variant="tonal"
            :disabled="!newSlug.trim() || !!newConceptError"
            @click="submitNewConcept"
          >
            Create
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped>
.ontology-editor {
  width: 100%;
  min-height: 400px;
  color: rgb(var(--v-theme-on-surface));
}
.editor-header {
  min-height: 72px;
  display: flex;
  align-items: center;
  gap: 1.25rem;
  padding: 0 2rem;
}
.editor-brand {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0;
  border: 0;
  color: inherit;
  background: none;
  cursor: pointer;
  min-width: 10rem;
  font-size: 1.45rem;
  font-weight: 700;
  letter-spacing: -0.04em;
}
.editor-brand .v-icon {
  color: rgb(var(--v-theme-primary));
}
.editor-search {
  max-width: 32rem;
  padding-left: 1rem;
  transform: translateY(-0.5rem);
}
.editor-layout {
  display: grid;
  grid-template-columns: minmax(13rem, 18rem) minmax(0, 1fr);
}
.editor-layout.has-utility-rail {
  grid-template-columns: minmax(13rem, 18rem) minmax(0, 1fr) 4.5rem;
}
.concept-sidebar {
  align-self: start;
  position: sticky;
  top: 0;
  max-height: 100vh;
  overflow-y: auto;
  padding: 2rem 1rem;
}
.property-tree {
  background: transparent;
}
.instance-tree-root {
  font-weight: 700;
}
.property-tree-item {
  margin-left: 1rem;
}
.selected-instance {
  min-width: 0;
  padding: clamp(2rem, 5vw, 5rem);
}
.selected-instance.roadmap-instance {
  padding: 0;
}
.utility-rail {
  align-self: start;
  position: sticky;
  top: 0;
  max-height: 100vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 0.5rem;
}
.tool-tooltip-activator {
  display: inline-flex;
}
.instance-heading {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  max-width: 60ch;
}
.instance-heading h1 {
  margin: 0;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: clamp(2rem, 4vw, 3.5rem);
  line-height: 1.05;
  letter-spacing: -0.035em;
}
.attribute-type {
  color: rgb(var(--v-theme-concept));
  font-size: 1.2rem;
  text-decoration: none;
  border-bottom: 2px solid currentColor;
}
.attribute-type-summary {
  align-self: flex-end;
}
.attribute-concept-separator {
  display: inline-block;
  margin: 0 8px;
}
.attribute-separator {
  align-self: flex-end;
  margin-bottom: 0.25rem;
  color: rgb(var(--v-theme-on-surface));
  font-size: 1.2rem;
}
.attribute-cardinality {
  margin-left: 0.1em;
  font-size: 0.7em;
}
@media (max-width: 760px) {
  .editor-header {
    min-height: 60px;
    padding: 0 1rem;
  }
  .editor-brand {
    min-width: auto;
  }
  .editor-search {
    border: 0;
    padding-left: 0;
  }
  .editor-layout {
    display: block;
  }
  .concept-sidebar {
    position: static;
    max-height: none;
    padding: 0.75rem 1rem;
  }
  .property-tree {
    display: flex;
    overflow-x: auto;
  }
  .property-tree :deep(.v-list-item) {
    flex: 0 0 auto;
  }
  .selected-instance {
    padding: 2rem 1.25rem;
  }
  .utility-rail {
    flex-direction: row;
    justify-content: flex-end;
    padding: 0.75rem 1rem;
  }
}
</style>

<style>
.concept-menu-transition-enter-active,
.concept-menu-transition-leave-active {
  transition: opacity 90ms ease-out, transform 90ms ease-out;
}
.concept-menu-transition-enter-from,
.concept-menu-transition-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
