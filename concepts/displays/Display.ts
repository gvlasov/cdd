// Static browsable reflection of Display.
export default [
  [
    {
      "kind": "identity",
      "value": "cdd.display"
    },
    {
      "kind": "concept",
      "value": "cdd.concept"
    },
    {
      "kind": "slug",
      "value": "display"
    },
    {
      "kind": "name",
      "value": "Display"
    },
    {
      "kind": "definition",
      "value": "A display is a layer that visually represents [state](cdd.state) to a [user](cdd.user) through a [screen](cdd.screen)."
    },
    {
      "kind": "details",
      "value": "A display sits between the current state of a system and the screen where that state becomes visible. It determines what state is relevant, gathers or receives that state, shapes it into a visual representation, and sends that representation through a transport mechanism.\n\nA display usually uses a third-party transport mechanism, such as a UI library, terminal output library, game engine, dashboarding system, charting library, browser rendering engine, or visualization tool. The transport mechanism is not the display itself. It is the [tool](cdd.tool) through which the display reaches a screen.\n\nStructure:\nA display may include:\n\n- selection logic: how relevant state is chosen\n- gathering logic: how relevant state is read, queried, subscribed to, or exported\n- presentation logic: how selected state is shaped visually\n- update logic: when and how the display changes as state changes\n- transport mechanism: the tool used to carry the visual representation to a screen\n\nExamples:\n\n- A game HUD display uses a game engine renderer and frame loop to show health, inventory, cooldowns, map markers, or selected world state.\n- A CLI table display uses a terminal output library to show command-relevant state.\n- A Grafana dashboard display uses Grafana panels and queries to show observed system state.\n- A web application display uses browser rendering and a UI framework to show application state.\n\nPlacement:\nDisplay files belong to the concept or process whose state they visually represent.\n\nGeneric rendering tools, UI framework configuration, dashboard runtime setup, terminal libraries, engine bootstrapping, and other reusable transport mechanisms belong to platform.\n\nIf a display file seems to belong both to a concept and to a transport mechanism, split the concept-specific display logic from the generic transport adapter. The concept-specific display stays with the concept or process. The generic adapter stays with platform."
    },
    {
      "kind": "examples",
      "value": [
        "cdd.display:examples:1",
        "cdd.display:examples:2",
        "cdd.display:examples:3",
        "cdd.display:examples:4"
      ]
    }
  ],
  [
    {
      "kind": "identity",
      "value": "cdd.display:examples:1"
    },
    {
      "kind": "concept",
      "value": "cdd.example"
    },
    {
      "kind": "description",
      "value": "A game HUD display uses a game engine renderer and frame loop to show health, inventory, cooldowns, map markers, or selected world state."
    }
  ],
  [
    {
      "kind": "identity",
      "value": "cdd.display:examples:2"
    },
    {
      "kind": "concept",
      "value": "cdd.example"
    },
    {
      "kind": "description",
      "value": "A CLI table display uses a terminal output library to show command-relevant state."
    }
  ],
  [
    {
      "kind": "identity",
      "value": "cdd.display:examples:3"
    },
    {
      "kind": "concept",
      "value": "cdd.example"
    },
    {
      "kind": "description",
      "value": "A Grafana dashboard display uses Grafana panels and queries to show observed system state."
    }
  ],
  [
    {
      "kind": "identity",
      "value": "cdd.display:examples:4"
    },
    {
      "kind": "concept",
      "value": "cdd.example"
    },
    {
      "kind": "description",
      "value": "A web application display uses browser rendering and a UI framework to show application state."
    }
  ]
]
