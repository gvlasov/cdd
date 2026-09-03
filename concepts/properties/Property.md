A property belongs to an [instance](/concepts/instances/Instance.md). It is a value the instance holds in a slot its [concept](/concepts/concepts/Concept.md) defines.

The slot itself is an [attribute](/concepts/attributes/Attribute.md) of the concept. The property is what one instance fills that slot with.

**Property vs attribute:**

- A property is instance-level: "this concept's name is *Order*", "this dog's tail is docked".
- An [attribute](/concepts/attributes/Attribute.md) is concept-level: it defines that instances of the concept *may have* a name, a tail, and so on.

A concept is itself an instance — of the ontology, or of a higher concept — so a concept has properties too: its own name, definition, and slug are properties of that concept.

**Examples:**

- The concept *Order* has a *name* property whose value is `"Order"`, because the ontology defines a *name* attribute.
- A particular dog has a *tail* property, because the concept *Dog* has a *tail* attribute.
- The string `"abc"` has a *length* property equal to `3`, because `String` has a *length* attribute.
