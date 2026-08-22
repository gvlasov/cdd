# Real Volume

The set of a [class](/concepts/classes/Class.md)'s actual instances within the modeled [reality](/concepts/reality/Reality.md), as opposed to every instance the class could logically describe

A class's volume, in the logic sense used by [Diversity](/concepts/classes/Diversity.md), is the set of all things belonging to that class. A [concept](/concepts/concepts/Concept.md) is also a [class](/concepts/classes/Class.md) — a partition of a larger set — so it has a volume too: the set of all instances the concept could ever describe.

Most of the time, what actually matters is not that full logical volume, but the smaller set of instances that exist in the [reality](/concepts/reality/Reality.md) a project models — usually a [virtual reality](/concepts/reality/Virtual reality.md) backed by a [database](/concepts/databases/Database.md). That narrower set is the concept's real volume: the concept's [state](/concepts/databases/State.md), the thing a [transaction](/concepts/transactions/Transaction.md) actually changes.

A concept itself has no state — a concept has a name, attributes, and kinds, same as always. Its real volume is what has state, because the real volume is the part of reality where instances are added, removed, and changed.

**Examples:**

- The class "even number" has an infinite logical volume. A specific project's real volume of "orders," by contrast, is exactly the rows currently in the orders table (or their equivalent in whatever database backs the project).
- `CreateOrder` does not change the state of the `orders` concept. It changes the state of the orders concept's real volume, by adding one instance to it.

**Relation to Collection:**

A [collection](/concepts/collections/Collection.md) is the code-level access mechanism to a concept's real volume — the DI-injected class with methods like `getAll()` and `add()`. The collection is a [reflection](/concepts/reflections/Reflection.md) of the real volume, not the real volume itself, the same way a repository is a reflection of read/write access to it. A collection's own doc calls it "a stateful set," which describes the real volume it grants access to, not a separate thing.
