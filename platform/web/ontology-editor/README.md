# CDD Ontology Editor

An embeddable Vue 3 component for viewing — and, later, editing — an ontology:
a flat, rhizomatic collection of **concepts**. Format-agnostic; not tied to
CDD's directory layout or any storage backend.

## Model

- Everything is an **instance**: a collection of properties addressed by a
  unique identity. Every instance has a **type** — a concept — named by its
  `concept` property.
- A **concept** is an instance (typed `cdd.concept`) that also carries an
  `attributes` property. Every type is a concept; any concept can be a type.
- A **property** is a `kind` and a `value` an instance holds in a slot.
- An **attribute** defines one slot. It is an instance typed `cdd.attribute`
  with `slug` (the property key), `name`, `type` (the concept its value is an
  instance of), and `cardinality` (`0-1` | `1` | `0+` | `1+`). A concept's
  `attributes` property lists attribute-instance identities.
- A **leaf** concept declares no attributes; its value edits as a plain field.
  A structured concept's value edits as its own nested attribute form.
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
  renderer: `name` (0), `slug` (1), `definition` / `description` (2),
  `examples` (6). Properties
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

## Navigate

The toolbar has a **concept search** — an autocomplete over every concept,
filtered by name; picking one navigates to it.

## Edit

Pass `editable` to show **New concept** and **Edit** buttons. **New concept**
asks for a slug (validated, must be unique) and creates an instance typed
`cdd.concept` (`identity` + `concept` + `slug`; identity is `<rootSlug>.<slug>`),
appends it to the ontology root's `concepts` list, and opens it in edit mode.

The edit form (`InstanceForm`) is driven by the instance's **type**: one
`AttributeValueEditor` per attribute the type declares (`conceptAttributeSpecs`).
For each attribute:

- **leaf `type`** → a plain text field on the property `slug`. Cardinality
  `0+`/`1+` → a chips combobox.
- **structured `type`** → a nested `InstanceForm` per value (a value instance
  keyed under the owner). Cardinality `0-1`/`1` → one; `0+`/`1+` → a list with
  add/remove. `1`/`1+` show a "required" hint when empty.

Since a concept is being edited, a **+attribute** button opens a dialog for a
new attribute: `name`, `slug` (property key, validated/unique), `type` (concept
picker), `cardinality` (`0-1`/`1`/`0+`/`1+`) → `createAttribute` adds a
`cdd.attribute` instance to the concept's `attributes` list.

Editing a `slug` recomputes a top-level concept's identity (`derivedIdentity`,
which only re-keys `cdd.concept`-typed instances), moves its `instances` entry,
and rewrites references. Every edit emits a new `Ontology` via
`update:modelValue`.

## Concept links in text

`definition` / `description` text may embed markdown-style links to other
concepts:

```
A concept is a collection of [properties](.property), and its
[attributes](.attribute) declare what its instances may have.
[Ontology](cdd.ontology)
```

`[Label](identity)` links to that concept; a leading dot means "this ontology",
so `.attribute` resolves to `<rootSlug>.attribute`. Known targets render as
clickable links that navigate to the concept; unknown targets render in the
error color and are inert.

## Reality & transactions

An ontology has a **reality** — the instances of its concepts — passed alongside
it as `v-model:reality` (a `Reality = { instances }`, never merged into the
ontology).

Every concept can expose **transactions** (CDD write operations) through a
`transactions` property listing transaction identities. A transaction is itself
an instance keyed `<conceptId>:<name>` (e.g. `cdd.concept:create`, a
constructor) with:

- `name` — the transaction name
- `params` — names of the inputs it expects (rendered as a form)
- `effect` — JavaScript source, run as
  `new Function('input', 'reality', 'ontology', effect)`

The `reality` argument is an API: `add(conceptId, props)` (returns the new id),
`get(id)`, `all(conceptId)`, `update(id, props)`, `remove(id)`. Mutations apply
to a copy; the editor emits the result via `update:reality`.

In the concept view, each transaction is a button; clicking it opens the params
form and Run executes the effect. Instances of the concept currently in the
reality are listed below.

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
- [x] Create concepts (slug → identity, added to the ontology's concept list)
- [x] Reality + concept transactions with executable `effect` (constructor etc.)
- [x] Attributes with type + cardinality; +attribute dialog; nested value forms
- [ ] Editing: delete concepts / attributes / values
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
  concept-links/  parse & render [Label](identity) links embedded in text
  attributes/     AttributeSpec (name/type/cardinality), <AttributeValueEditor>, value spawning
  editing/        immutable edits, <ConceptEditor> (+attribute dialog), <InstanceForm>
  reality/        Reality (instances of concepts), <RealityPanel>
  transactions/   Transaction model, runEffect, <TransactionBar>
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

The component uses theme colors — `concept`, `instance`, `attribute`, `relation`.
The instance card is tinted `concept` when the instance declares `attributes`,
else `instance`.
Merge `ontologyTheme` into your Vuetify config so they resolve:

```ts
import { createVuetify } from 'vuetify'
import { ontologyTheme } from '@cdd/ontology-editor'

createVuetify({ theme: ontologyTheme })
```
