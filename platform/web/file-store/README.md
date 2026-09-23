# File store

Files uploaded to an ontology — the backend of the ontology editor's
`FileStore` interface (`platform/web/ontology-editor/src/concepts/files`).
Plain PHP, no framework and no dependencies, run by PHP-FPM behind Caddy.

## API

Mounted under an API base (`/api` locally, `/cdd/api` in Problemos):

| Method | Path | Result |
|---|---|---|
| GET | `/ontologies/{ontology}/files` | `200` list, newest first |
| POST | `/ontologies/{ontology}/files` (multipart `file`) | `201` the stored file |
| GET | `/ontologies/{ontology}/files/{name}` | the file, cached as immutable |
| DELETE | `/ontologies/{ontology}/files/{name}` | `204`, or `404` |

A stored file is `{ name, url, size, contentType, originalName, uploadedAt }`.
`name` is the sha256 of the content plus its extension, so uploading the same
bytes twice keeps one file. `url` is relative to the editor's own base
(`api/ontologies/...`), so ontology data holding it works in every environment.
Uploads are capped at 10 MB. There is no authentication yet.

## Configuration

`public/index.php` reads the environment, which the Caddy route sets:

- `FILE_STORE_DIR` — where files are kept (`<dir>/<ontology>/<name>`, plus a
  `<name>.json` sidecar with the original name and upload time)
- `FILE_STORE_BASE` — the URL prefix the API is mounted under

`routes.caddy` is the shared Caddy route; import it inside a `handle_path`:

```caddy
handle_path /api/* {
	import routes.caddy <public dir> <storage dir> <api base> <php-fpm upstream>
}
```

## Environments

- **Local development** — `editor:up` starts Caddy, PHP-FPM and Vite
  (`platform/web/ontology-editor/envs/local-development`). Files persist in the
  `file_store_data` volume.
- **Problemos** — this directory is symlinked into the Problemos repository as
  `platform/cddFileStore` and routed at `/cdd/api/*` by its
  `Caddyfile.backendful`. Its deploy copies the symlink's target into each
  release; files live in Problemos' persistent Laravel `storage/app/cdd-files`.

## Test

```bash
php platform/web/file-store/tests/ApiTest.php
```
