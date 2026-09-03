# CDD Ontology Editor

An embeddable Vue 3 component for viewing — and, later, editing — an ontology:
a flat, rhizomatic collection of **concepts**. Format-agnostic; not tied to
CDD's directory layout or any storage backend.

## Model

- A **concept is a collection of properties** — nothing else. Name, definition,
  examples, identity and slug are all just properties.
- A **property** belongs to the concept as an instance: a `kind` and a `value`
  it holds in a slot. An **attribute** is the slot — itself a concept — that
  defines what property an instance may have. A concept's `attributes` property
  is the list of attribute-concept identities its instances may carry (Name,
  Definition, Slug, …).
- An **ontology** is itself a concept — its root instance. That instance is the
  root concept of itself; its `concepts` property is the list of concept
  identities the ontology contains.
- An **identity** is a string, unique within the ontology. It is the base case:
  an identity *is* its own literal content. `IdentityRepository` maps every
  identity to the instance it represents; it is built from the ontology at load.
- A **slug** is a `[a-zA-Z0-9_-]+` word, unique within the ontology, that
  identifies an **instance** — the ontology and a concept are just instances
  that commonly carry one. When an entry and every entity
  above it in the metaentity chain (instance → concept → ontology) are slugged,
  the entry's identity is those slugs joined by `.` —
  `<ontologySlug>.<conceptSlug>.<instanceSlug>`. The ontology is the root
  concept of itself (`ontology.root` names its own entry).
- Predefined property kinds and their draw positions inside the instance
  renderer: `name` (0), `definition` / `description` (1), `slug` (2),
  `examples` (5). Properties
  at the same position draw in renderer-defined order. `identity`, `concept`,
  `concepts` and `attributes` have no in-instance renderer: `identity` is the
  key; `concept` / `concepts` references and the declared `attributes` are drawn
  *below* the instance by `ConceptView`.
- Title / slug rendering: the `name` renderer shows the title and, if the
  instance has a slug, the slug right beside it. The `slug` renderer draws the
  slug only when the instance has no name; otherwise it stays silent.
- Storage is **flat**: `{ root, instances: { <identity>: Property[] } }` — the
  addressable store. Concept membership is the root instance's `concepts`
  property; concepts reference each other via `concept` properties.

## Edit

Pass `editable` to show an **Edit** toggle. In edit mode the open concept's
properties become inputs, ordered by property-kind position. A property kind can
ship its own `edit` component (like its `render`); otherwise the value kind
picks a generic input:

- `definition` / `description` → textarea (the kind renders its own editor)
- other literals (`name`, `slug`) → outlined text field labelled with the kind
- literal list (`examples`) → combobox with chips; type new entries
- concept list (`concept`, `concepts`, `attributes`) → autocomplete over the
  ontology's concepts

`identity` is not shown in edit mode — it is derived. Editing a `slug` recomputes the instance's identity
(`derivedIdentity`), moves its `instances` entry, updates its `identity`
property, and rewrites every `attributes` / `concept` / `concepts` reference
that pointed at the old identity — the view follows the moved concept. Every edit emits a new
`Ontology` via `update:modelValue`. Adding/removing properties is not in this
pass.

## View

The central component is the **instance renderer**: it fills the screen with one
instance drawn as its properties, in kind-position order (name as the title,
definition below, and so on).

`ConceptView` wraps it: **parent concepts** above (those that reference this one
through an `attributes` / `concept` / `concepts` property), and — when the
instance is a concept — its referenced concepts below as navigable chips (its
attributes, `concept` parts, and an ontology's `concepts` list). Clicking any
chip navigates.

Same stack as the `problems` app: Vue 3 + Vite + Vuetify 4 + TypeScript.
No backend.

## Goal

A `<OntologyEditor>` Vue component that other apps can embed.

## Status — first cut (task t203)

- [x] Vite + Vue + Vuetify + TS project that builds
- [x] Property-based concept model with an identity repository
- [x] Instance renderer + concept view (parents above, attributes below)
- [x] Edit mode: change property values, slug rename re-keys the identity
- [ ] Editing: add / remove properties and concepts
- [ ] Persistence adapters
- [ ] `.d.ts` emission for the published bundle

## Layout (CDD)

```
src/concepts/
  ontology/       Ontology (root + instance store), concept list, <OntologyEditor>, theme
  identity/       Identity & Slug types, IdentityRepository, slug-chain identity
  instances/      Instance (= Property[]) and <InstanceRenderer> — the central component
  concepts/       Concept helpers (a concept is an instance with `attributes`)
  properties/     Property, PropertyKind, and kinds/ (one renderer per drawn kind)
  editing/        edit-mode: value-kind classification, immutable edits, <ConceptEditor>
  concept-view/   <ConceptView> — instance renderer + parents above + attributes below
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
