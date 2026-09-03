# CDD Ontology Editor

An embeddable Vue 3 component for viewing — and, later, editing — an ontology:
a flat, rhizomatic collection of **concepts**. Format-agnostic; not tied to
CDD's directory layout or any storage backend.

## Model

- A **concept is a collection of attributes** — nothing else. Name, definition,
  examples and identity are all just attributes.
- An **attribute** has a `kind` and a `value`. The value is another attribute
  of the attribute, referenced (like everything) by **identity**.
- An **identity** is a string, unique within the ontology. It is the base case:
  an identity *is* its own literal content. `IdentityRepository` maps every
  identity to the instance it represents; it is built from the ontology at load.
- A **slug** is a `[a-zA-Z0-9_-]+` word, unique within the ontology. The ontology,
  a concept, and an instance can each carry one. When an entry and every entity
  above it in the metaentity chain (instance → concept → ontology) are slugged,
  the entry's identity is those slugs joined by `.` —
  `<ontologySlug>.<conceptSlug>.<instanceSlug>`. The ontology is the root
  concept of itself (`ontology.root` names its own entry).
- Predefined attribute kinds and their draw positions on the concept widget:
  `name` (0), `definition` (1), `slug` (2), `concept` (3), `examples` (5).
  Each kind ships a component that draws one attribute of that kind; attributes
  at the same position draw in renderer-defined order. `identity` (position 2)
  has no renderer — it is the concept's key, not something shown.
- Title / slug rendering: the `name` renderer shows the title and, if the
  concept has a slug, the slug right beside it. The `slug` renderer draws the
  slug only when the concept has no name; otherwise it stays silent.
- The ontology is **flat**: `{ concepts: { <identity>: Attribute[] } }`.
  Concepts reference each other by identity via `concept` attributes.

## View

One concept fills the screen at a time. Its attributes are drawn in kind-position
order (name as the title, definition below, and so on). Buttons above it are the
**parent concepts** — those that reference this one through a `concept`
attribute. Clicking any button navigates to that concept.

Same stack as the `problems` app: Vue 3 + Vite + Vuetify 4 + TypeScript.
No backend.

## Goal

A `<OntologyEditor>` Vue component that other apps can embed.

## Status — first cut (task t203)

- [x] Vite + Vue + Vuetify + TS project that builds
- [x] Attribute-based concept model with an identity repository
- [x] Single-concept view: attributes drawn by kind position, parent navigation
- [ ] In-place editing (add / change / remove attributes and concepts)
- [ ] Persistence adapters
- [ ] `.d.ts` emission for the published bundle

## Layout (CDD)

```
src/concepts/
  ontology/       Ontology aggregate, identity repo access, <OntologyEditor>, theme
  identity/       Identity & Slug types, IdentityRepository, slug-chain identity
  concepts/       Concept (= Attribute[]) helpers
  attributes/     Attribute, AttributeKind, and kinds/ (one renderer per kind)
  concept-view/   <ConceptView> — one concept and its parents
  app/            local demo app (not part of the published bundle)
src/index.ts      public entry point for the embeddable component
```

## Develop

From anywhere in the repo:

```bash
editor:up        # install deps if needed + start the Vite dev server (HMR)
editor:open      # editor:up, and open the demo app in the browser
editor:build     # build the embeddable bundle into /concepts/ontology-editor/dist
```

Or directly:

```bash
cd platform/web/ontology-editor
npm install
npm run dev        # demo app
npm run check      # type-check
npm run build:lib  # build the embeddable bundle into ./dist
```

`editor:open` serves on port 5273 (override with `EDITOR_PORT`), falling through
to the next free port if taken.

## Embed

```ts
import { OntologyEditor, type Ontology } from '@cdd/ontology-editor'
import '@cdd/ontology-editor/style.css'
```

```vue
<OntologyEditor v-model="ontology" root-id="concept" />
```

The component uses theme colors — `concept`, `attribute`, `relation`.
Merge `ontologyTheme` into your Vuetify config so they resolve:

```ts
import { createVuetify } from 'vuetify'
import { ontologyTheme } from '@cdd/ontology-editor'

createVuetify({ theme: ontologyTheme })
```
