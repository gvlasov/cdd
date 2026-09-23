<?php

declare(strict_types=1);

namespace Cdd\FileStore;

/** A request the file store refuses, carrying the HTTP status to answer with. */
final class FileStoreError extends \RuntimeException
{
    public function __construct(string $message, public readonly int $status)
    {
        parent::__construct($message);
    }
}
