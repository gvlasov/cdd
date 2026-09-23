<?php

declare(strict_types=1);

namespace Cdd\FileStore;

/**
 * Files uploaded to an ontology, kept on disk under `<root>/<ontology>/`.
 *
 * A stored file is named by the sha256 of its content plus its extension, so
 * names are immutable and uploading the same bytes twice yields one file. The
 * original filename and upload time live in a `<name>.json` sidecar.
 */
final class FileStore
{
    public const ONTOLOGY_PATTERN = '/^[a-zA-Z0-9_-]+$/';
    public const NAME_PATTERN = '/^[a-f0-9]{64}(\.[a-z0-9]+)?$/';
    public const MAX_BYTES = 10 * 1024 * 1024;

    public function __construct(private readonly string $root)
    {
    }

    public static function isOntology(string $ontology): bool
    {
        return preg_match(self::ONTOLOGY_PATTERN, $ontology) === 1;
    }

    public static function isName(string $name): bool
    {
        return preg_match(self::NAME_PATTERN, $name) === 1;
    }

    /** @return list<array<string, mixed>> newest first */
    public function list(string $ontology): array
    {
        $dir = $this->dir($ontology);
        if (!is_dir($dir)) {
            return [];
        }
        $files = [];
        foreach (scandir($dir) ?: [] as $entry) {
            if (self::isName($entry)) {
                $files[] = $this->describe($ontology, $entry);
            }
        }
        usort($files, fn (array $a, array $b) => strcmp($b['uploadedAt'], $a['uploadedAt']));

        return $files;
    }

    /**
     * Store the file at `$path` (e.g. an uploaded temp file).
     *
     * @return array<string, mixed>
     */
    public function save(string $ontology, string $path, string $originalName): array
    {
        $size = filesize($path);
        if ($size === false || $size > self::MAX_BYTES) {
            throw new FileStoreError('File is too large', 413);
        }
        $name = hash_file('sha256', $path).self::extension($originalName);
        $dir = $this->dir($ontology);
        if (!is_dir($dir) && !mkdir($dir, 0775, true) && !is_dir($dir)) {
            throw new FileStoreError('Cannot create storage directory', 500);
        }
        $target = $dir.'/'.$name;
        if (!is_file($target)) {
            if (!copy($path, $target)) {
                throw new FileStoreError('Cannot store file', 500);
            }
            file_put_contents($target.'.json', json_encode([
                'originalName' => $originalName,
                'uploadedAt' => gmdate('Y-m-d\TH:i:s\Z'),
            ]));
        }

        return $this->describe($ontology, $name);
    }

    /** Absolute path of a stored file, or null when it does not exist. */
    public function path(string $ontology, string $name): ?string
    {
        $path = $this->dir($ontology).'/'.$name;

        return self::isName($name) && is_file($path) ? $path : null;
    }

    public function delete(string $ontology, string $name): bool
    {
        $path = $this->path($ontology, $name);
        if ($path === null) {
            return false;
        }
        unlink($path);
        @unlink($path.'.json');

        return true;
    }

    /** @return array<string, mixed> */
    public function describe(string $ontology, string $name): array
    {
        $path = $this->dir($ontology).'/'.$name;
        $meta = json_decode((string) @file_get_contents($path.'.json'), true) ?: [];

        return [
            'name' => $name,
            'size' => filesize($path),
            'contentType' => self::contentType($path),
            'originalName' => $meta['originalName'] ?? $name,
            'uploadedAt' => $meta['uploadedAt'] ?? gmdate('Y-m-d\TH:i:s\Z', (int) filemtime($path)),
        ];
    }

    public static function contentType(string $path): string
    {
        $type = (new \finfo(FILEINFO_MIME_TYPE))->file($path) ?: 'application/octet-stream';
        // finfo reports SVG as text/plain or image/svg without the +xml suffix.
        if (str_ends_with($path, '.svg')) {
            return 'image/svg+xml';
        }

        return $type;
    }

    private static function extension(string $originalName): string
    {
        $extension = strtolower(pathinfo($originalName, PATHINFO_EXTENSION));

        return preg_match('/^[a-z0-9]{1,10}$/', $extension) === 1 ? '.'.$extension : '';
    }

    private function dir(string $ontology): string
    {
        if (!self::isOntology($ontology)) {
            throw new FileStoreError('Invalid ontology', 400);
        }

        return rtrim($this->root, '/').'/'.$ontology;
    }
}
