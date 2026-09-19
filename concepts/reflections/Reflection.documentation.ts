// Static browsable reflection of Reflection.
export default [
  [
    {
      "kind": "identity",
      "value": "cdd.reflection"
    },
    {
      "kind": "concept",
      "value": "cdd.concept"
    },
    {
      "kind": "slug",
      "value": "reflection"
    },
    {
      "kind": "name",
      "value": "Reflection"
    },
    {
      "kind": "definition",
      "value": "A way for a [concept](cdd.concept) to [exist](cdd.existence)"
    },
    {
      "kind": "details",
      "value": "Synonyms:\nManifestation\nRepresentation\n\nStructure:\nA reflection has a name, a definition and 0+ instances\n\nA reflection belongs to a concept directory based on what it is about, not how it runs. The runtime mechanism (queue, cache, search index, HTTP) is irrelevant to placement — only the concept it reflects determines where it lives.\n\nExamples: \n\n- ProductDTO is a reflection of the Product concept.\n- ProductView is a reflection of the Product concept\n- A SettleOrders job of the Orders concept (not a platform concern as one might think).\n- `/concepts/products/README.md` that explains the concept of products is a reflection\n\nRelation to Stakeholder\n\nA reflection is usually a [stakeholder](cdd.stakeholder)'s view into a concept, not a neutral fact about it. Some reflections are stakeholder-universal: used the same way regardless of who is asking.\n\nExamples:\n\n- `OrderAdminView` reflects Order for the admin stakeholder.\n- `OrderReceipt` reflects Order for the customer stakeholder.\n- `Order.php`, the entity itself, is stakeholder-universal — every path that touches an order goes through it.\n\nA reflection's name already says what it is. A stakeholder-specific reflection needs no separate naming convention or directory scheme beyond that.\n\nAxioms:\n- There is no canonical reflection of a concept"
    },
    {
      "kind": "examples",
      "value": [
        "cdd.reflection:examples:1",
        "cdd.reflection:examples:2",
        "cdd.reflection:examples:3",
        "cdd.reflection:examples:4"
      ]
    }
  ],
  [
    {
      "kind": "identity",
      "value": "cdd.reflection:examples:1"
    },
    {
      "kind": "concept",
      "value": "cdd.example"
    },
    {
      "kind": "description",
      "value": "ProductDTO is a reflection of the Product concept."
    }
  ],
  [
    {
      "kind": "identity",
      "value": "cdd.reflection:examples:2"
    },
    {
      "kind": "concept",
      "value": "cdd.example"
    },
    {
      "kind": "description",
      "value": "ProductView is a reflection of the Product concept"
    }
  ],
  [
    {
      "kind": "identity",
      "value": "cdd.reflection:examples:3"
    },
    {
      "kind": "concept",
      "value": "cdd.example"
    },
    {
      "kind": "description",
      "value": "A SettleOrders job of the Orders concept (not a platform concern as one might think)."
    }
  ],
  [
    {
      "kind": "identity",
      "value": "cdd.reflection:examples:4"
    },
    {
      "kind": "concept",
      "value": "cdd.example"
    },
    {
      "kind": "description",
      "value": "`/concepts/products/README.md` that explains the concept of products is a reflection"
    }
  ]
]
