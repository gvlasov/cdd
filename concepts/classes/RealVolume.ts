// Static browsable reflection of Real Volume.
export default [
  [
    {
      "kind": "identity",
      "value": "cdd.realVolume"
    },
    {
      "kind": "concept",
      "value": "cdd.concept"
    },
    {
      "kind": "slug",
      "value": "realVolume"
    },
    {
      "kind": "name",
      "value": "Real Volume"
    },
    {
      "kind": "definition",
      "value": "The set of a [class](cdd.class)'s actual instances within the modeled [reality](cdd.reality), as opposed to every instance the class could logically describe"
    },
    {
      "kind": "details",
      "value": "A class's volume, in the logic sense used by [Diversity](cdd.diversity), is the set of all things belonging to that class. A [concept](cdd.concept) is also a [class](cdd.class) — a partition of a larger set — so it has a volume too: the set of all instances the concept could ever describe.\n\nMost of the time, what actually matters is not that full logical volume, but the smaller set of instances that exist in the [reality](cdd.reality) a project models — usually a [virtual reality](cdd.virtualReality) backed by a [database](cdd.database). That narrower set is the concept's real volume: the concept's [state](cdd.state), the thing a [transaction](cdd.transaction) actually changes.\n\nA concept itself has no state — a concept has a name, attributes, and kinds, same as always. Its real volume is what has state, because the real volume is the part of reality where instances are added, removed, and changed.\n\nExamples:\n\n- The class \"even number\" has an infinite logical volume. A specific project's real volume of \"orders,\" by contrast, is exactly the rows currently in the orders table (or their equivalent in whatever database backs the project).\n- `CreateOrder` does not change the state of the `orders` concept. It changes the state of the orders concept's real volume, by adding one instance to it.\n\nRelation to Collection:\n\nA [collection](cdd.collection) is the code-level access mechanism to a concept's real volume — the DI-injected class with methods like `getAll()` and `add()`. The collection is a [reflection](cdd.reflection) of the real volume, not the real volume itself, the same way a repository is a reflection of read/write access to it. A collection's own doc calls it \"a stateful set,\" which describes the real volume it grants access to, not a separate thing."
    },
    {
      "kind": "examples",
      "value": [
        "cdd.realVolume:examples:1",
        "cdd.realVolume:examples:2"
      ]
    }
  ],
  [
    {
      "kind": "identity",
      "value": "cdd.realVolume:examples:1"
    },
    {
      "kind": "concept",
      "value": "cdd.example"
    },
    {
      "kind": "description",
      "value": "The class \"even number\" has an infinite logical volume. A specific project's real volume of \"orders,\" by contrast, is exactly the rows currently in the orders table (or their equivalent in whatever database backs the project)."
    }
  ],
  [
    {
      "kind": "identity",
      "value": "cdd.realVolume:examples:2"
    },
    {
      "kind": "concept",
      "value": "cdd.example"
    },
    {
      "kind": "description",
      "value": "`CreateOrder` does not change the state of the `orders` concept. It changes the state of the orders concept's real volume, by adding one instance to it."
    }
  ]
]
