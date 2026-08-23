A way for a [concept](/concepts/concepts/Concept.md) to [exist](/concepts/reality/Existence.md)

**Synonyms:**
Manifestation
Representation

**Structure:**
A reflection has a name, a definition and 0+ instances

A reflection belongs to a concept directory based on what it is about, not how it runs. The runtime mechanism (queue, cache, search index, HTTP) is irrelevant to placement — only the concept it reflects determines where it lives.

**Examples:** 

- ProductDTO is a reflection of the Product concept.
- ProductView is a reflection of the Product concept
- A SettleOrders job of the Orders concept (not a platform concern as one might think).
- `/concepts/products/README.md` that explains the concept of products is a reflection

## Relation to Stakeholder

A reflection is usually a [stakeholder](/concepts/stakeholders/Stakeholder.md)'s view into a concept, not a neutral fact about it. Some reflections are stakeholder-universal: used the same way regardless of who is asking.

**Examples:**

- `OrderAdminView` reflects Order for the admin stakeholder.
- `OrderReceipt` reflects Order for the customer stakeholder.
- `Order.php`, the entity itself, is stakeholder-universal — every path that touches an order goes through it.

A reflection's name already says what it is. A stakeholder-specific reflection needs no separate naming convention or directory scheme beyond that.

**Axioms:**
- There is no canonical reflection of a concept
