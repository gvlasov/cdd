# CDD Ontology Editor

An embeddable Vue 3 component for viewing — and, later, editing — a **generic
concept graph** (an ontology). Every node is a concept; the one relation the
editor navigates is "has attribute". Format-agnostic; not tied to CDD's
directory layout or any storage backend.

## View

One concept fills the screen at a time: its name (if any) as the title, its
description (if any) below. Buttons above it are the **parent concepts** — the
concepts that have this one as an attribute. Buttons below it are this concept's
**attributes**. Clicking any button navigates to that concept.

Same stack as the `problems` app: Vue 3 + Vite + Vuetify 4 + TypeScript.
No backend.

## Goal

A `<OntologyEditor>` Vue component that other apps can embed.

## Status — first cut (task t203)

- [x] Vite + Vue + Vuetify + TS project that builds
- [x] `Ontology` data model (`src/concepts/ontology/Ontology.ts`)
- [x] Single-concept view with parent / attribute navigation, fed by a fixture
- [ ] In-place editing (add / rename / delete nodes and edges)
- [ ] Persistence adapters
- [ ] `.d.ts` emission for the published bundle

## Layout (CDD)

```
src/concepts/
  ontology/       Ontology model, sample fixture, <OntologyEditor> shell
  concept-view/   <ConceptView> — one concept, its parents and its attributes
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

The component uses three theme colors — `concept`, `attribute`, `relation`.
Merge `ontologyTheme` into your Vuetify config so they resolve:

```ts
import { createVuetify } from 'vuetify'
import { ontologyTheme } from '@cdd/ontology-editor'

createVuetify({ theme: ontologyTheme })
```
