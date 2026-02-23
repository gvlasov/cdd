Dependency injection is incredibly important to design processes, repositories, controllers. Any state (repositories, framework components) must come via dependency injection when viable.

```php
class GrabUnderAbility {
  public function __construct(
	  public WorldItems $items,
	  public CharacterCoordinates $characterCoordinates,
	  public CharacterInventories $characterInventories
  ) {
    
  }
  
  public function apply(GameCharacter $character) {
	  $coord = $this->characterCoordinates->of($character);
	  $item = $items->getFirstAt($coord);
	  $characterInventories->add($character, $item);
	  $items->remove($coord, $item);
  }
}
```

See [[Collection]], [[State]]

Absolute most of the time dependency injection must be used to define singletons and inject them into each other. It must be used create non-singleton objects only when absolutely necessary. Basically it is a container of singletons of specific types. You tell it what type you need - it constructs it if it doesn't exist yet, persists it in memory and gives you the object reference.

There will be a place where dependency injection container is populated - e.g. in Laravel that is called a Service Provider.