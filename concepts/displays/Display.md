A display is a layer that visually represents [[State|state]] to a [[User|user]] through a [[Screen|screen]].

A display sits between the current state of a system and the screen where that state becomes visible. It determines what state is relevant, gathers or receives that state, shapes it into a visual representation, and sends that representation through a transport mechanism.

A display usually uses a third-party transport mechanism, such as a UI library, terminal output library, game engine, dashboarding system, charting library, browser rendering engine, or visualization tool. The transport mechanism is not the display itself. It is the [[Tool|tool]] through which the display reaches a screen.

**Structure:**
A display may include:

- selection logic: how relevant state is chosen
- gathering logic: how relevant state is read, queried, subscribed to, or exported
- presentation logic: how selected state is shaped visually
- update logic: when and how the display changes as state changes
- transport mechanism: the tool used to carry the visual representation to a screen

**Examples:**

- A game HUD display uses a game engine renderer and frame loop to show health, inventory, cooldowns, map markers, or selected world state.
- A CLI table display uses a terminal output library to show command-relevant state.
- A Grafana dashboard display uses Grafana panels and queries to show observed system state.
- A web application display uses browser rendering and a UI framework to show application state.

**Placement:**
Display files belong to the concept or process whose state they visually represent.

Generic rendering tools, UI framework configuration, dashboard runtime setup, terminal libraries, engine bootstrapping, and other reusable transport mechanisms belong to platform.

If a display file seems to belong both to a concept and to a transport mechanism, split the concept-specific display logic from the generic transport adapter. The concept-specific display stays with the concept or process. The generic adapter stays with platform.
