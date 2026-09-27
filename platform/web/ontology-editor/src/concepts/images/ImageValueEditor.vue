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

// Edits an image-valued property. A host FileStore is optional: local uploads
// and pasted images remain portable by being stored as the Image's data URL.
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
function setImage(fill: (o: Ontology, id: Identity) => Ontology, replaceId?: Identity) {
  const existing = replaceId ?? (!props.list ? valueIds.value[0] : undefined)
  if (existing) apply((o) => fill(o, existing))
  else addImage(fill)
}
function addFile(file: StoredFile, replaceId?: Identity) {
  setImage((o, id) =>
    setPropertyValue(
      setPropertyValue(setPropertyValue(o, id, 'url', file.url), id, 'blob', ''),
      id,
      'originalName',
      file.originalName,
    ),
  replaceId)
}

function readFile(file: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(reader.error ?? new Error('Could not read image'))
    reader.onload = () => resolve(String(reader.result))
    reader.readAsDataURL(file)
  })
}
async function addEmbeddedImage(file: Blob, name: string, replaceId?: Identity) {
  const blob = await readFile(file)
  setImage((o, id) =>
    setPropertyValue(
      setPropertyValue(setPropertyValue(o, id, 'url', ''), id, 'blob', blob),
      id,
      'originalName',
      name,
    ),
  replaceId)
}

// --- upload ---
const fileInput = ref<HTMLInputElement>()
const busy = ref(false)
const error = ref('')
const uploadImageId = ref<Identity>()
function openUpload(id?: Identity) {
  uploadImageId.value = id
  fileInput.value?.click()
}
async function onUpload(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ''
  if (!file) return
  const targetId = uploadImageId.value
  uploadImageId.value = undefined
  busy.value = true
  error.value = ''
  try {
    if (store.value) addFile(await store.value.upload(file), targetId)
    else await addEmbeddedImage(file, file.name, targetId)
  } catch (e) {
    error.value = e instanceof Error ? e.message : String(e)
  } finally {
    busy.value = false
  }
}

// Clipboard image data has no durable URL, so retain it in the Image's `blob`
// property. This makes pasted images work in the standalone editor too.
async function pasteImage(replaceId?: Identity) {
  error.value = ''
  if (!navigator.clipboard?.read) {
    error.value = 'Pasting images is not supported by this browser.'
    return
  }
  busy.value = true
  try {
    const items = await navigator.clipboard.read()
    for (const item of items) {
      const type = item.types.find((candidate) => candidate.startsWith('image/'))
      if (!type) continue
      await addEmbeddedImage(await item.getType(type), `Pasted image.${type.split('/')[1] ?? 'png'}`, replaceId)
      return
    }
    error.value = 'The clipboard does not contain an image.'
  } catch (e) {
    error.value = e instanceof Error ? e.message : String(e)
  } finally {
    busy.value = false
  }
}

// --- choose from uploaded ---
const choosing = ref(false)
const choosingImageId = ref<Identity>()
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
function openChooser(id?: Identity) {
  choosingImageId.value = id
  choosing.value = true
  void refresh()
}
function choose(file: StoredFile) {
  addFile(file, choosingImageId.value)
  choosingImageId.value = undefined
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
      <div class="d-flex justify-center flex-wrap ga-2 mt-2">
        <v-btn prepend-icon="mdi-upload" variant="tonal" size="small" :loading="busy" @click="openUpload(id)">Upload</v-btn>
        <v-btn prepend-icon="mdi-content-paste" variant="tonal" size="small" :loading="busy" @click="pasteImage(id)">Paste</v-btn>
        <v-btn v-if="store" prepend-icon="mdi-image-multiple-outline" variant="tonal" size="small" @click="openChooser(id)">Choose uploaded</v-btn>
      </div>
    </v-card>

    <v-card v-if="canAdd" variant="tonal" color="instance" class="pa-2">
      <div class="d-flex justify-center flex-wrap ga-2">
        <v-btn prepend-icon="mdi-upload" variant="tonal" size="small" :loading="busy" @click="openUpload()">Upload</v-btn>
        <v-btn prepend-icon="mdi-content-paste" variant="tonal" size="small" :loading="busy" @click="pasteImage()">Paste</v-btn>
        <v-btn v-if="store" prepend-icon="mdi-image-multiple-outline" variant="tonal" size="small" @click="openChooser()">Choose uploaded</v-btn>
        <v-btn prepend-icon="mdi-link-variant" variant="tonal" size="small" @click="addImage()">URL</v-btn>
      </div>
    </v-card>
    <input ref="fileInput" type="file" accept="image/*" class="d-none" @change="onUpload" />
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
