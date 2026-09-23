<?php

declare(strict_types=1);

// Dependency-free tests for the file store API. Run with:
//   php platform/web/file-store/tests/ApiTest.php

use Cdd\FileStore\Api;
use Cdd\FileStore\FileStore;

require __DIR__.'/../src/FileStoreError.php';
require __DIR__.'/../src/FileStore.php';
require __DIR__.'/../src/Response.php';
require __DIR__.'/../src/Api.php';

$failures = 0;
function check(string $label, bool $ok): void
{
    global $failures;
    echo ($ok ? 'ok   ' : 'FAIL ').$label.PHP_EOL;
    $failures += $ok ? 0 : 1;
}

function upload(string $content, string $name): array
{
    $tmp = tempnam(sys_get_temp_dir(), 'upload');
    file_put_contents($tmp, $content);

    return ['tmp_name' => $tmp, 'name' => $name, 'error' => UPLOAD_ERR_OK];
}

$root = sys_get_temp_dir().'/cdd-file-store-test-'.bin2hex(random_bytes(4));
$api = new Api(new FileStore($root));

$empty = $api->handle('GET', '/ontologies/cdd/files');
check('lists nothing before any upload', $empty->status === 200 && $empty->body === '[]');

$created = $api->handle('POST', '/ontologies/cdd/files', upload('<svg xmlns="http://www.w3.org/2000/svg"/>', 'Logo.SVG'));
$file = json_decode((string) $created->body, true);
check('upload answers 201', $created->status === 201);
check('upload names the file by content hash', preg_match('/^[a-f0-9]{64}\.svg$/', $file['name'] ?? '') === 1);
check('upload keeps the original name', ($file['originalName'] ?? null) === 'Logo.SVG');
check('upload returns an editor-relative url', ($file['url'] ?? null) === "api/ontologies/cdd/files/{$file['name']}");
check('svg is served as image/svg+xml', ($file['contentType'] ?? null) === 'image/svg+xml');

$again = json_decode((string) $api->handle('POST', '/ontologies/cdd/files', upload('<svg xmlns="http://www.w3.org/2000/svg"/>', 'copy.svg'))->body, true);
$listed = json_decode((string) $api->handle('GET', '/ontologies/cdd/files')->body, true);
check('same content deduplicates', $again['name'] === $file['name'] && count($listed) === 1);

$other = json_decode((string) $api->handle('GET', '/ontologies/other/files')->body, true);
check('files are scoped per ontology', $other === []);

$served = $api->handle('GET', "/ontologies/cdd/files/{$file['name']}");
check('serves the stored file', $served->status === 200 && $served->file !== null && file_get_contents($served->file) === '<svg xmlns="http://www.w3.org/2000/svg"/>');
check('served files are immutable', str_contains($served->headers['Cache-Control'] ?? '', 'immutable'));

check('rejects a traversal name', $api->handle('GET', '/ontologies/cdd/files/..%2F..%2Fetc%2Fpasswd')->status === 404);
check('rejects a traversal ontology', $api->handle('GET', '/ontologies/../files')->status === 400);
check('rejects an upload without a file', $api->handle('POST', '/ontologies/cdd/files')->status === 400);
check('rejects an oversized upload', $api->handle('POST', '/ontologies/cdd/files', ['tmp_name' => '', 'name' => 'x', 'error' => UPLOAD_ERR_INI_SIZE])->status === 413);
check('unknown path is 404', $api->handle('GET', '/elsewhere')->status === 404);

check('deletes the file', $api->handle('DELETE', "/ontologies/cdd/files/{$file['name']}")->status === 204);
check('deleting again is 404', $api->handle('DELETE', "/ontologies/cdd/files/{$file['name']}")->status === 404);
check('list is empty after delete', $api->handle('GET', '/ontologies/cdd/files')->body === '[]');

exec('rm -rf '.escapeshellarg($root));
exit($failures === 0 ? 0 : 1);
