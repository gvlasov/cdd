A [concept](/concepts/concepts/Concept.md) that exists only to shape a single [attribute](/concepts/attributes/Attribute.md)'s values — the `type` of exactly one attribute across the whole ontology, and not otherwise a first-class concept a developer would reach for on its own.

**Structure:**

A concept qualifies as an attribute-concept when both hold:

- it is the `type` of exactly one attribute instance in the ontology
- nothing else treats it as independently meaningful (it isn't referenced as a `concepts` member, an `instance` target, or any other attribute's type)

**Examples:**

- `Name` is an attribute-concept of `Instance.name` — nothing else in the ontology is typed `Name`.
- `Slug` is an attribute-concept wherever only one attribute (e.g. a concept's own `slug`) is typed by it.

**Relation to Reflection:**

An attribute-concept still has its own [reflections](/concepts/reflections/Reflection.md) — a definition, examples, maybe a transaction — same as any concept. What's special is cardinality of use, not richness: it just happens that only one attribute in this ontology currently reaches for it.

**Why it matters:**

Knowing a concept is attribute-only tells a reader where to look for its full meaning: on the one attribute's page, not scattered across many unrelated attributes that happen to share its type. It also flags a concept as a candidate for merging into that attribute's own page, since it has no independent audience — see how the ontology editor renders a sole-owning attribute's type inline on the attribute's page rather than giving it a separate one.
