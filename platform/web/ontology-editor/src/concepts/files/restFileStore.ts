import type { Slug } from '@/concepts/identity/Slug'
import type { FileStore, StoredFile } from './FileStore'

async function ok(response: Response): Promise<Response> {
  if (response.ok) return response
  const body = await response.json().catch(() => undefined)
  throw new Error(body?.error ?? `${response.status} ${response.statusText}`)
}

/**
 * A FileStore over the file-store REST API (platform/web/file-store).
 * `baseUrl` is where the API is mounted — `api` resolves against the page, so
 * it works wherever the editor is served from.
 */
export function restFileStore(baseUrl: string, ontology: Slug): FileStore {
  const files = `${baseUrl.replace(/\/$/, '')}/ontologies/${encodeURIComponent(ontology)}/files`
  return {
    async list(): Promise<StoredFile[]> {
      return (await ok(await fetch(files))).json()
    },
    async upload(file: File): Promise<StoredFile> {
      const body = new FormData()
      body.append('file', file)
      return (await ok(await fetch(files, { method: 'POST', body }))).json()
    },
    async remove(name: string): Promise<void> {
      await ok(await fetch(`${files}/${encodeURIComponent(name)}`, { method: 'DELETE' }))
    },
  }
}
