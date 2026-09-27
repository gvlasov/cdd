<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Identity } from '@/concepts/identity/Identity'
import { conceptOf } from '@/concepts/ontology/Ontology'
import { instanceType } from '@/concepts/instances/Instance'
import { isConcept } from '@/concepts/concepts/Concept'
import { conceptAttributeSpecs } from '@/concepts/attributes/Attribute'
import { useOntology } from '@/concepts/ontology/useOntology'
import AttributeValueEditor from '@/concepts/attributes/AttributeValueEditor.vue'
import DefineAttributeButton from '@/concepts/attributes/DefineAttributeButton.vue'
import ImageValueEditor from '@/concepts/images/ImageValueEditor.vue'
import { addProperty, isListPropertyKind, setPropertyValue } from './editOntology'
import { propertyKinds } from '@/concepts/properties/kinds/property-kinds'
import type { PropertyKindName } from '@/concepts/properties/Property'

// Renders the editable form for one instance: an AttributeValueEditor per
// attribute its type declares. Recursive — structured attribute values embed
// their own InstanceForm. `ancestors` carries the instance ids already open
// above so a cyclic type graph (concept → attribute → type → concept) stops
// expanding.
const props = withDefaults(
  defineProps<{ conceptId: Identity; ancestors?: Identity[] }>(),
  { ancestors: () => [] },
)

const { ontology, navigate, apply } = useOntology()

const cyclic = computed(() => props.ancestors.includes(props.conceptId))
const chain = computed(() => [...props.ancestors, props.conceptId])

const instance = computed(() => conceptOf(ontology(), props.conceptId))
const typeId = computed(() => (instance.value ? instanceType(instance.value) : undefined))
const type = computed(() => (typeId.value ? conceptOf(ontology(), typeId.value) : undefined))
const specs = computed(() =>
  type.value ? conceptAttributeSpecs(ontology(), type.value) : [],
)
const specKinds = computed(() => new Set(specs.value.map((spec) => spec.slug)))
const freeProperties = computed(() =>
  (instance.value ?? []).filter((property) =>
    property.kind !== 'identity'
    && property.kind !== 'concept'
    && property.kind !== 'attributes'
    && !specKinds.value.has(property.kind),
  ),
)
const isConceptInstance = computed(() => !!instance.value && isConcept(instance.value))
const addingProperty = ref(false)
const newPropertyKind = ref<PropertyKindName | null>(null)
const propertyItems = computed(() =>
  Object.keys(propertyKinds)
    .filter((kind) => !['identity', 'concept', 'attributes'].includes(kind))
    .filter((kind) => !(instance.value ?? []).some((property) => property.kind === kind))
    .map((kind) => ({ value: kind, title: kind })),
)
const multilineKinds = new Set<PropertyKindName>(['definition', 'description', 'details', 'effect', 'function'])

function addNewProperty() {
  if (!newPropertyKind.value) return
  apply((o) => addProperty(o, props.conceptId, newPropertyKind.value!))
  addingProperty.value = false
  newPropertyKind.value = null
}
function setFreeProperty(kind: PropertyKindName, value: string | string[]) {
  apply((o) => setPropertyValue(o, props.conceptId, kind, value))
}
</script>

<template>
  <div v-if="cyclic" class="text-caption">
    <a href="#" class="link" @click.prevent="navigate(conceptId)">{{ conceptId }}</a>
    <span class="text-medium-emphasis"> (open separately to edit)</span>
  </div>
  <div v-else-if="instance" class="d-flex flex-column ga-4">
    <AttributeValueEditor
      v-for="spec in specs"
      :key="spec.attribute"
      :owner-id="conceptId"
      :spec="spec"
      :ancestors="chain"
    />
    <template v-for="property in freeProperties" :key="property.kind">
      <ImageValueEditor
        v-if="property.kind === 'prototypeImage'"
        :owner-id="conceptId"
        :slug="property.kind"
        name="prototype image"
        :list="false"
      />
      <v-combobox
        v-else-if="isListPropertyKind(property.kind)"
        :model-value="Array.isArray(property.value) ? property.value : []"
        :label="property.kind"
        variant="outlined"
        density="comfortable"
        hide-details
        multiple
        chips
        closable-chips
        @update:model-value="setFreeProperty(property.kind, $event)"
      />
      <v-textarea
        v-else-if="multilineKinds.has(property.kind)"
        :model-value="Array.isArray(property.value) ? '' : property.value"
        :label="property.kind"
        variant="outlined"
        density="comfortable"
        hide-details
        auto-grow
        rows="2"
        @update:model-value="setFreeProperty(property.kind, $event)"
      />
      <v-text-field
        v-else
        :model-value="Array.isArray(property.value) ? '' : property.value"
        :label="property.kind"
        variant="outlined"
        density="comfortable"
        hide-details
        @update:model-value="setFreeProperty(property.kind, $event)"
      />
    </template>
    <div v-if="!specs.length && !freeProperties.length" class="text-caption text-medium-emphasis text-center">
      {{ typeId ? 'this type declares no attributes' : 'no type' }}
    </div>
    <div class="editing-actions d-flex justify-center flex-wrap ga-2">
      <v-btn prepend-icon="mdi-plus" variant="tonal" size="small" @click="addingProperty = true">Property</v-btn>
      <DefineAttributeButton v-if="isConceptInstance" :owner-id="conceptId" />
    </div>
    <v-dialog v-model="addingProperty" max-width="460">
      <v-card>
        <v-card-title>New property</v-card-title>
        <v-card-text>
          <v-autocomplete v-model="newPropertyKind" :items="propertyItems" label="property" variant="outlined" density="comfortable" hide-details autofocus />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="addingProperty = false">Cancel</v-btn>
          <v-btn color="primary" variant="tonal" :disabled="!newPropertyKind" @click="addNewProperty">Add</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped>
.editing-actions {
  position: sticky;
  bottom: 0;
  z-index: 2;
  margin-top: auto;
  padding: 0.75rem;
  background: rgb(var(--v-theme-surface));
  border: 1px solid rgb(var(--v-theme-outline));
  border-radius: 0.5rem;
  box-shadow: 0 -0.25rem 0.75rem color-mix(in srgb, rgb(var(--v-theme-shadow)) 20%, transparent);
}
.link {
  color: rgb(var(--v-theme-concept));
  text-decoration: none;
  border-bottom: 1px solid currentColor;
}
</style>
