// Static browsable reflection of Attribute.
export default [
  [
    {
      "kind": "identity",
      "value": "cdd.attribute"
    },
    {
      "kind": "concept",
      "value": "cdd.concept"
    },
    {
      "kind": "slug",
      "value": "attribute"
    },
    {
      "kind": "name",
      "value": "Attribute"
    },
    {
      "kind": "definition",
      "value": "An attribute belongs to a [concept](cdd.concept). It defines what [property](cdd.property) an [instance](cdd.instance) of that concept may have."
    },
    {
      "kind": "details",
      "value": "A concept declares the properties available to its instances through its attributes: one attribute per available property.\n\nAttribute vs property:\n\n- An attribute is concept-level. \"A concept has a *name* attribute\" means every instance of that concept may carry a name.\n- A [property](cdd.property) is instance-level. \"This concept's name is *Order*\" is a property of that particular concept-as-instance.\n\nSo the attribute is the slot the concept defines; the property is the value an instance puts in that slot.\n\nExamples:\n\n- The concept *Player character* has a *health* attribute. A particular player character instance has a *health* property whose value is `42`.\n- The concept *Dog* has a *tail* attribute. A particular dog has a *tail* property.\n- The JavaScript `String` class has a *length* attribute. The string `\"abc\"` has a *length* property equal to `3`."
    },
    {
      "kind": "examples",
      "value": [
        "cdd.attribute:examples:1",
        "cdd.attribute:examples:2",
        "cdd.attribute:examples:3"
      ]
    }
  ],
  [
    {
      "kind": "identity",
      "value": "cdd.attribute:examples:1"
    },
    {
      "kind": "concept",
      "value": "cdd.example"
    },
    {
      "kind": "description",
      "value": "The concept *Player character* has a *health* attribute. A particular player character instance has a *health* property whose value is `42`."
    }
  ],
  [
    {
      "kind": "identity",
      "value": "cdd.attribute:examples:2"
    },
    {
      "kind": "concept",
      "value": "cdd.example"
    },
    {
      "kind": "description",
      "value": "The concept *Dog* has a *tail* attribute. A particular dog has a *tail* property."
    }
  ],
  [
    {
      "kind": "identity",
      "value": "cdd.attribute:examples:3"
    },
    {
      "kind": "concept",
      "value": "cdd.example"
    },
    {
      "kind": "description",
      "value": "The JavaScript `String` class has a *length* attribute. The string `\"abc\"` has a *length* property equal to `3`."
    }
  ]
]
