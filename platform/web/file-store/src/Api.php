<?php

declare(strict_types=1);

namespace Cdd\FileStore;

/**
 * The REST surface over a FileStore. Paths are relative to the API base
 * (`/api` in local development, `/cdd/api` inside Problemos):
 *
 *   GET    /ontologies/{ontology}/files          list
 *   POST   /ontologies/{ontology}/files          upload (multipart field `file`)
 *   GET    /ontologies/{ontology}/files/{name}   serve
 *   DELETE /ontologies/{ontology}/files/{name}   delete
 *
 * A stored file's `url` is relative to the editor's own base
 * (`api/ontologies/...`), so the same ontology data resolves in every
 * environment the editor is served from.
 */
final class Api
{
    public function __construct(private readonly FileStore $store)
    {
    }

    /** @param array<string, mixed>|null $upload one entry of $_FILES */
    public function handle(string $method, string $path, ?array $upload = null): Response
    {
        try {
            return $this->route($method, $path, $upload);
        } catch (FileStoreError $error) {
            return Response::json(['error' => $error->getMessage()], $error->status);
        }
    }

    /** @param array<string, mixed>|null $upload */
    private function route(string $method, string $path, ?array $upload): Response
    {
        $segments = array_values(array_filter(explode('/', $path), fn (string $s) => $s !== ''));
        if (count($segments) < 3 || $segments[0] !== 'ontologies' || $segments[2] !== 'files') {
            return Response::json(['error' => 'Not found'], 404);
        }
        $ontology = $segments[1];
        if (!FileStore::isOntology($ontology)) {
            return Response::json(['error' => 'Invalid ontology'], 400);
        }

        if (count($segments) === 3) {
            return match ($method) {
                'GET' => Response::json(array_map(fn ($f) => $this->withUrl($ontology, $f), $this->store->list($ontology))),
                'POST' => $this->upload($ontology, $upload),
                default => Response::json(['error' => 'Method not allowed'], 405),
            };
        }

        $name = $segments[3];
        if (count($segments) !== 4 || !FileStore::isName($name)) {
            return Response::json(['error' => 'Not found'], 404);
        }

        return match ($method) {
            'GET', 'HEAD' => $this->serve($ontology, $name),
            'DELETE' => $this->store->delete($ontology, $name)
                ? Response::empty(204)
                : Response::json(['error' => 'Not found'], 404),
            default => Response::json(['error' => 'Method not allowed'], 405),
        };
    }

    /** @param array<string, mixed>|null $upload */
    private function upload(string $ontology, ?array $upload): Response
    {
        if (!$upload || !isset($upload['tmp_name'], $upload['error'])) {
            return Response::json(['error' => 'Missing multipart field "file"'], 400);
        }
        if ($upload['error'] === UPLOAD_ERR_INI_SIZE || $upload['error'] === UPLOAD_ERR_FORM_SIZE) {
            return Response::json(['error' => 'File is too large'], 413);
        }
        if ($upload['error'] !== UPLOAD_ERR_OK) {
            return Response::json(['error' => 'Upload failed'], 400);
        }
        $file = $this->store->save($ontology, (string) $upload['tmp_name'], (string) ($upload['name'] ?? 'file'));

        return Response::json($this->withUrl($ontology, $file), 201);
    }

    private function serve(string $ontology, string $name): Response
    {
        $path = $this->store->path($ontology, $name);
        if ($path === null) {
            return Response::json(['error' => 'Not found'], 404);
        }

        return Response::file($path, FileStore::contentType($path));
    }

    /**
     * @param array<string, mixed> $file
     * @return array<string, mixed>
     */
    private function withUrl(string $ontology, array $file): array
    {
        return $file + ['url' => "api/ontologies/{$ontology}/files/{$file['name']}"];
    }
}
