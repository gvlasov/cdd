<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Identity } from '@/concepts/identity/Identity'
import type { Ontology } from '@/concepts/ontology/Ontology'
import { conceptOf } from '@/concepts/ontology/Ontology'
import { useOntology } from '@/concepts/ontology/useOntology'
import { setPropertyValue } from '@/concepts/editing/editOntology'
import { spawnValue, removeValue } from '@/concepts/attributes/spawnValue'
import type { StoredFile } from '@/concepts/files/FileStore'
import { IMAGE_CONCEPT, imageSource, imageAlt } from './Image'

// Edits an attribute typed `cdd.image`: each value is an owned Image instance
// whose `url` points at an uploaded file (via the host's FileStore) or any
// other address typed in by hand.
const props = defineProps<{ ownerId: Identity; slug: string; name: string; list: boolean }>()
const { ontology, apply, fileStore } = useOntology()

const valueIds = computed<Identity[]>(() => {
  const value = conceptOf(ontology(), props.ownerId)?.find((p) => p.kind === props.slug)?.value
  return Array.isArray(value) ? value : value ? [value] : []
})
const canAdd = computed(() => props.list || valueIds.value.length === 0)
const store = computed(() => fileStore())

function image(id: Identity) {
  return conceptOf(ontology(), id) ?? []
}
function url(id: Identity): string {
  const value = image(id).find((p) => p.kind === 'url')?.value
  return Array.isArray(value) ? value[0] ?? '' : value ?? ''
}
function setUrl(id: Identity, value: string | null) {
  apply((o) => setPropertyValue(o, id, 'url', value ?? ''))
}
function remove(id: Identity) {
  apply((o) => removeValue(o, props.ownerId, props.slug, id))
}

/** Spawn a new Image value; `fill` sets its properties once its id is known. */
function addImage(fill?: (o: Ontology, id: Identity) => Ontology) {
  apply((o) => {
    const before = new Set(valueIdsOf(o))
    const spawned = spawnValue(o, props.ownerId, props.slug, IMAGE_CONCEPT, props.list)
    const id = valueIdsOf(spawned).find((v) => !before.has(v))
    return id && fill ? fill(spawned, id) : spawned
  })
}
function valueIdsOf(o: Ontology): Identity[] {
  const value = conceptOf(o, props.ownerId)?.find((p) => p.kind === props.slug)?.value
  return Array.isArray(value) ? value : value ? [value] : []
}
function addFile(file: StoredFile) {
  addImage((o, id) =>
    setPropertyValue(setPropertyValue(o, id, 'url', file.url), id, 'originalName', file.originalName),
  )
}

// --- upload ---
const fileInput = ref<HTMLInputElement>()
const busy = ref(false)
const error = ref('')
async function onUpload(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ''
  if (!file || !store.value) return
  busy.value = true
  error.value = ''
  try {
    addFile(await store.value.upload(file))
  } catch (e) {
    error.value = e instanceof Error ? e.message : String(e)
  } finally {
    busy.value = false
  }
}

// --- choose from uploaded ---
const choosing = ref(false)
const files = ref<StoredFile[]>([])
async function refresh() {
  if (!store.value) return
  error.value = ''
  try {
    files.value = (await store.value.list()).filter((f) => f.contentType.startsWith('image/'))
  } catch (e) {
    error.value = e instanceof Error ? e.message : String(e)
  }
}
function openChooser() {
  choosing.value = true
  void refresh()
}
function choose(file: StoredFile) {
  addFile(file)
  choosing.value = false
}
// Deleting a file another Image still points at would leave it broken, so
// in-use files are marked and cannot be deleted from here.
const usedUrls = computed(() => {
  const urls = new Set<string>()
  for (const instance of Object.values(ontology().instances)) {
    const value = instance.find((p) => p.kind === 'url')?.value
    if (typeof value === 'string') urls.add(value)
  }
  return urls
})
async function removeFile(file: StoredFile) {
  if (!store.value) return
  try {
    await store.value.remove(file.name)
    files.value = files.value.filter((f) => f.name !== file.name)
  } catch (e) {
    error.value = e instanceof Error ? e.message : String(e)
  }
}
</script>

<template>
  <div class="d-flex flex-column ga-2">
    <div class="text-caption text-medium-emphasis">{{ name }}</div>

    <v-card v-for="id in valueIds" :key="id" variant="tonal" color="instance" class="pa-2">
      <div class="d-flex align-start ga-2">
        <img
          v-if="imageSource(image(id))"
          :src="imageSource(image(id))"
          :alt="imageAlt(image(id))"
          class="image-preview"
        />
        <v-text-field
          :model-value="url(id)"
          label="url"
          variant="outlined"
          density="compact"
          hide-details
          @update:model-value="setUrl(id, $event)"
        />
        <v-btn icon="mdi-close" variant="text" size="x-small" density="comfortable" @click="remove(id)" />
      </div>
    </v-card>

    <div v-if="canAdd" class="d-flex justify-center flex-wrap ga-2">
      <template v-if="store">
        <v-btn prepend-icon="mdi-upload" variant="tonal" size="small" :loading="busy" @click="fileInput?.click()">
          Upload
        </v-btn>
        <input ref="fileInput" type="file" accept="image/*" class="d-none" @change="onUpload" />
        <v-btn prepend-icon="mdi-image-multiple-outline" variant="tonal" size="small" @click="openChooser">
          Choose uploaded
        </v-btn>
      </template>
      <v-btn prepend-icon="mdi-link-variant" variant="tonal" size="small" @click="addImage()">URL</v-btn>
    </div>
    <div v-if="error" class="text-caption text-error text-center">{{ error }}</div>

    <v-dialog v-model="choosing" max-width="720">
      <v-card title="Uploaded images">
        <v-card-text>
          <div v-if="!files.length" class="text-medium-emphasis">Nothing uploaded yet.</div>
          <div class="file-grid">
            <v-card v-for="file in files" :key="file.name" variant="outlined" class="file-tile" @click="choose(file)">
              <img :src="file.url" :alt="file.originalName" class="file-thumb" />
              <div class="d-flex align-center pa-1 ga-1">
                <span class="text-caption text-truncate flex-grow-1" :title="file.originalName">
                  {{ file.originalName }}
                </span>
                <v-chip v-if="usedUrls.has(file.url)" size="x-small" label>in use</v-chip>
                <v-btn
                  v-else
                  icon="mdi-delete-outline"
                  variant="text"
                  size="x-small"
                  density="comfortable"
                  title="Delete file"
                  @click.stop="removeFile(file)"
                />
              </div>
            </v-card>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="choosing = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped>
.image-preview {
  width: 4rem;
  height: 4rem;
  object-fit: contain;
  flex-shrink: 0;
}
.file-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(9rem, 1fr));
  gap: 0.5rem;
}
.file-thumb {
  display: block;
  width: 100%;
  height: 7rem;
  object-fit: contain;
}
</style>
