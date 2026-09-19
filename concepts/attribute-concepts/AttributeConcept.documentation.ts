// Static browsable reflection of AttributeConcept.
export default [
  [
    {
      "kind": "identity",
      "value": "cdd.attributeConcept"
    },
    {
      "kind": "concept",
      "value": "cdd.concept"
    },
    {
      "kind": "slug",
      "value": "attributeConcept"
    },
    {
      "kind": "name",
      "value": "AttributeConcept"
    },
    {
      "kind": "definition",
      "value": "A [concept](cdd.concept) that exists only to shape a single [attribute](cdd.attribute)'s values — the `type` of exactly one attribute across the whole ontology, and not otherwise a first-class concept a developer would reach for on its own."
    },
    {
      "kind": "details",
      "value": "Structure:\n\nA concept qualifies as an attribute-concept when both hold:\n\n- it is the `type` of exactly one attribute instance in the ontology\n- nothing else treats it as independently meaningful (it isn't referenced as a `concepts` member, an `instance` target, or any other attribute's type)\n\nExamples:\n\n- `Name` is an attribute-concept of `Instance.name` — nothing else in the ontology is typed `Name`.\n- `Slug` is an attribute-concept wherever only one attribute (e.g. a concept's own `slug`) is typed by it.\n\nRelation to Reflection:\n\nAn attribute-concept still has its own [reflections](cdd.reflection) — a definition, examples, maybe a transaction — same as any concept. What's special is cardinality of use, not richness: it just happens that only one attribute in this ontology currently reaches for it.\n\nWhy it matters:\n\nKnowing a concept is attribute-only tells a reader where to look for its full meaning: on the one attribute's page, not scattered across many unrelated attributes that happen to share its type. It also flags a concept as a candidate for merging into that attribute's own page, since it has no independent audience — see how the ontology editor renders a sole-owning attribute's type inline on the attribute's page rather than giving it a separate one."
    },
    {
      "kind": "examples",
      "value": [
        "cdd.attributeConcept:examples:1",
        "cdd.attributeConcept:examples:2"
      ]
    }
  ],
  [
    {
      "kind": "identity",
      "value": "cdd.attributeConcept:examples:1"
    },
    {
      "kind": "concept",
      "value": "cdd.example"
    },
    {
      "kind": "description",
      "value": "`Name` is an attribute-concept of `Instance.name` — nothing else in the ontology is typed `Name`."
    }
  ],
  [
    {
      "kind": "identity",
      "value": "cdd.attributeConcept:examples:2"
    },
    {
      "kind": "concept",
      "value": "cdd.example"
    },
    {
      "kind": "description",
      "value": "`Slug` is an attribute-concept wherever only one attribute (e.g. a concept's own `slug`) is typed by it."
    }
  ]
]
