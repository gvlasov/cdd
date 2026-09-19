// Static browsable reflection of Dependency Injection.
export default [
  [
    {
      "kind": "identity",
      "value": "cdd.dependencyInjection"
    },
    {
      "kind": "concept",
      "value": "cdd.concept"
    },
    {
      "kind": "slug",
      "value": "dependencyInjection"
    },
    {
      "kind": "name",
      "value": "Dependency Injection"
    },
    {
      "kind": "definition",
      "value": "Dependency injection is incredibly important to design processes, repositories, controllers. Any state (repositories, framework components) must come via dependency injection when viable."
    },
    {
      "kind": "details",
      "value": "```php\nclass GrabUnderAbility {\n  public function __construct(\n\t  public WorldItems $items,\n\t  public CharacterCoordinates $characterCoordinates,\n\t  public CharacterInventories $characterInventories\n  ) {\n\n  }\n\n  public function apply(GameCharacter $character) {\n\t  $coord = $this->characterCoordinates->of($character);\n\t  $item = $items->getFirstAt($coord);\n\t  $characterInventories->add($character, $item);\n\t  $items->remove($coord, $item);\n  }\n}\n```\n\nSee [Collection](cdd.collection), [State](cdd.state)\n\nAbsolute most of the time dependency injection must be used to define singletons and inject them into each other. It must be used create non-singleton objects only when absolutely necessary. Basically it is a container of singletons of specific types. You tell it what type you need - it constructs it if it doesn't exist yet, persists it in memory and gives you the object reference.\n\nThere will be a place where dependency injection container is populated - e.g. in Laravel that is called a Service Provider."
    }
  ]
]
