// Static browsable reflection of Property.
export default [
  [
    {
      "kind": "identity",
      "value": "cdd.property"
    },
    {
      "kind": "concept",
      "value": "cdd.concept"
    },
    {
      "kind": "slug",
      "value": "property"
    },
    {
      "kind": "name",
      "value": "Property"
    },
    {
      "kind": "definition",
      "value": "A property belongs to an [instance](cdd.instance). It is a value the instance holds in a slot its [concept](cdd.concept) defines."
    },
    {
      "kind": "details",
      "value": "The slot itself is an [attribute](cdd.attribute) of the concept. The property is what one instance fills that slot with.\n\nProperty vs attribute:\n\n- A property is instance-level: \"this concept's name is *Order*\", \"this dog's tail is docked\".\n- An [attribute](cdd.attribute) is concept-level: it defines that instances of the concept *may have* a name, a tail, and so on.\n\nA concept is itself an instance — of the ontology, or of a higher concept — so a concept has properties too: its own name, definition, and slug are properties of that concept.\n\nExamples:\n\n- The concept *Order* has a *name* property whose value is `\"Order\"`, because the ontology defines a *name* attribute.\n- A particular dog has a *tail* property, because the concept *Dog* has a *tail* attribute.\n- The string `\"abc\"` has a *length* property equal to `3`, because `String` has a *length* attribute."
    },
    {
      "kind": "examples",
      "value": [
        "cdd.property:examples:1",
        "cdd.property:examples:2",
        "cdd.property:examples:3"
      ]
    }
  ],
  [
    {
      "kind": "identity",
      "value": "cdd.property:examples:1"
    },
    {
      "kind": "concept",
      "value": "cdd.example"
    },
    {
      "kind": "description",
      "value": "The concept *Order* has a *name* property whose value is `\"Order\"`, because the ontology defines a *name* attribute."
    }
  ],
  [
    {
      "kind": "identity",
      "value": "cdd.property:examples:2"
    },
    {
      "kind": "concept",
      "value": "cdd.example"
    },
    {
      "kind": "description",
      "value": "A particular dog has a *tail* property, because the concept *Dog* has a *tail* attribute."
    }
  ],
  [
    {
      "kind": "identity",
      "value": "cdd.property:examples:3"
    },
    {
      "kind": "concept",
      "value": "cdd.example"
    },
    {
      "kind": "description",
      "value": "The string `\"abc\"` has a *length* property equal to `3`, because `String` has a *length* attribute."
    }
  ]
]
