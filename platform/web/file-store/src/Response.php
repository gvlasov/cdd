<?php

declare(strict_types=1);

namespace Cdd\FileStore;

/** An HTTP response the front controller emits: JSON, a stored file, or nothing. */
final class Response
{
    /** @param array<string, string> $headers */
    private function __construct(
        public readonly int $status,
        public readonly array $headers,
        public readonly ?string $body = null,
        public readonly ?string $file = null,
    ) {
    }

    public static function json(mixed $data, int $status = 200): self
    {
        return new self($status, ['Content-Type' => 'application/json'], json_encode($data, JSON_UNESCAPED_SLASHES));
    }

    public static function empty(int $status): self
    {
        return new self($status, []);
    }

    public static function file(string $path, string $contentType): self
    {
        return new self(200, [
            'Content-Type' => $contentType,
            'Content-Length' => (string) filesize($path),
            // Names are content hashes, so a stored file never changes.
            'Cache-Control' => 'public, max-age=31536000, immutable',
            'X-Content-Type-Options' => 'nosniff',
        ], null, $path);
    }

    public function emit(bool $withBody = true): void
    {
        http_response_code($this->status);
        foreach ($this->headers as $name => $value) {
            header("{$name}: {$value}");
        }
        if (!$withBody) {
            return;
        }
        if ($this->file !== null) {
            readfile($this->file);
        } elseif ($this->body !== null) {
            echo $this->body;
        }
    }
}
