// Static browsable reflection of /trees/Trees.php.
export default [
  [
    {
      "kind": "identity",
      "value": "cdd.collection"
    },
    {
      "kind": "concept",
      "value": "cdd.concept"
    },
    {
      "kind": "slug",
      "value": "collection"
    },
    {
      "kind": "name",
      "value": "/trees/Trees.php"
    },
    {
      "kind": "definition",
      "value": "A code-level object that grants read/write access to a concept's [real volume](cdd.realVolume) — the set of all its actual instances"
    },
    {
      "kind": "details",
      "value": "Example:\n\nHow to use:\n\nCreate classes for DI that are named after the plural of the concept:\n\n```php\n\nclass Trees {\n\n  use Set;\n\n  public function __construct(\n\t  protected Database $db\n  ) {\n  }\n\n  public function getAll(): array {\n\t  return $this->db->select('trees.*')\n  }\n\n  public function add(int $heightCm): bool {\n    return $this->db->insert('trees', ['heightCm' => $heightCm]);\n  }\n}\n```\nIf a set class becomes very big and starts having internal structure of cohesive parts, extract its related methods into DDD Repositories or Aggregates and inject the extracted parts as dependencies."
    }
  ]
]
