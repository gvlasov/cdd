A stateful set of all reflection instances of a concept

**Example:**

**How to use:**

Create classes for DI that are named after the plural of the concept:

```php
# /trees/Trees.php
class Trees {

  use Set;
  
  public function __construct(
	  protected Database $db
  ) {
  }
  
  public function getAll(): array {
	  return $this->db->select('trees.*')
  }
  
  public function add(int $heightCm): bool {
    return $this->db->insert('trees', ['heightCm' => $heightCm]);
  }
}
```
If a set class becomes very big and starts having internal structure of cohesive parts, extract its related methods into DDD Repositories or Aggregates and inject the extracted parts as dependencies.