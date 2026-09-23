<?php

declare(strict_types=1);

// Front controller for the ontology file store. Configuration comes from the
// environment (set by the Caddy `php_fastcgi` block that routes here):
//   FILE_STORE_DIR   where files are kept
//   FILE_STORE_BASE  URL prefix the API is mounted under (e.g. /api, /cdd/api)

use Cdd\FileStore\Api;
use Cdd\FileStore\FileStore;

require __DIR__.'/../src/FileStoreError.php';
require __DIR__.'/../src/FileStore.php';
require __DIR__.'/../src/Response.php';
require __DIR__.'/../src/Api.php';

$root = getenv('FILE_STORE_DIR') ?: sys_get_temp_dir().'/cdd-file-store';
$base = rtrim(getenv('FILE_STORE_BASE') ?: '/api', '/');

$path = (string) parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);
if (str_starts_with($path, $base.'/')) {
    $path = substr($path, strlen($base));
}
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

(new Api(new FileStore($root)))
    ->handle($method, rawurldecode($path), $_FILES['file'] ?? null)
    ->emit($method !== 'HEAD');
