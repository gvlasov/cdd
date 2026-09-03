An attribute belongs to a [concept](/concepts/concepts/Concept.md). It defines what [property](/concepts/properties/Property.md) an [instance](/concepts/instances/Instance.md) of that concept may have.

A concept declares the properties available to its instances through its attributes: one attribute per available property.

**Attribute vs property:**

- An attribute is concept-level. "A concept has a *name* attribute" means every instance of that concept may carry a name.
- A [property](/concepts/properties/Property.md) is instance-level. "This concept's name is *Order*" is a property of that particular concept-as-instance.

So the attribute is the slot the concept defines; the property is the value an instance puts in that slot.

**Examples:**

- The concept *Player character* has a *health* attribute. A particular player character instance has a *health* property whose value is `42`.
- The concept *Dog* has a *tail* attribute. A particular dog has a *tail* property.
- The JavaScript `String` class has a *length* attribute. The string `"abc"` has a *length* property equal to `3`.
