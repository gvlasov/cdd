// Static browsable reflection of Ontology editor.
export default [
  [
    {
      "kind": "identity",
      "value": "cdd.ontologyEditor"
    },
    {
      "kind": "concept",
      "value": "cdd.concept"
    },
    {
      "kind": "slug",
      "value": "ontologyEditor"
    },
    {
      "kind": "name",
      "value": "Ontology editor"
    },
    {
      "kind": "definition",
      "value": "An embeddable Vue 3 component for viewing and editing an ontology — a flat,\nrhizomatic collection of concepts, where a concept is nothing but a collection\nof [properties](cdd.property) (name, definition, examples,\nidentity, slug, and references to other concepts). A concept's\n[attributes](cdd.attribute) declare what properties its\ninstances may have. Every instance is addressed by a unique identity string,\nderivable from a chain of slugs. It shows one concept at a time, its properties\ndrawn in kind-defined order, with navigation up to the concepts that reference\nit."
    },
    {
      "kind": "details",
      "value": "The component is developed as a standalone Vite project under\n`/platform/web/ontology-editor`, on\nthe same stack as the `problems` app (Vue 3 + Vite + Vuetify 4 + TypeScript).\n\nReflections\n\n- `/platform/web/ontology-editor/` — the component's source, demo app, and build.\n- `dist/` (here) — the built embeddable bundle, produced by `cdd editor:build`.\n  Generated, git-ignored; run the command to (re)create it.\n\nPass `editable` for edit mode: change an instance's property values (slug\nrenames re-key the identity and rewrite references) and create new concepts from\na slug.\n\nAn ontology carries a reality (`v-model:reality`) — the instances of its\nconcepts. Concepts expose [transactions](cdd.transaction)\n(CDD write operations) via a `transactions` property; each is an instance keyed\n`<conceptId>:<name>` with an `effect` (JavaScript run against a `reality` API).\nThe concept view shows a button per transaction that opens a params form and\nruns the effect — this is how instances are spawned into the reality (e.g. a\nconstructor `cdd.concept:create`).\n\nCommands\n\n- `editor:up` — bring up the local environment: install deps if needed and start\n  the Vite dev server (HMR). No backend.\n- `editor:open` — `editor:up` plus opening the demo app in the browser.\n- `editor:build` — build the embeddable component bundle into `dist/` here."
    }
  ]
]
