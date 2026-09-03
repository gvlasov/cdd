# CDD Ontology Editor

An embeddable Vue 3 component for viewing — and, later, editing — a **generic
concept graph** (an ontology): typed nodes connected by typed, directed edges.
Format-agnostic; not tied to CDD's directory layout or any storage backend.

Same stack as the `problems` app: Vue 3 + Vite + Vuetify 4 + TypeScript.
No backend.

## Goal

A `<OntologyEditor>` Vue component that other apps can embed.

## Status — first cut (task t203)

- [x] Vite + Vue + Vuetify + TS project that builds
- [x] `Ontology` data model (`src/concepts/ontology/Ontology.ts`)
- [x] Read-only graph viewer with a detail panel, fed by a static fixture
- [ ] In-place editing (add / rename / delete nodes and edges)
- [ ] Persistence adapters
- [ ] `.d.ts` emission for the published bundle

## Layout (CDD)

```
src/concepts/
  ontology/     Ontology model, sample fixture, <OntologyEditor> shell
  graph-view/   <OntologyGraphView> SVG viewer + layout
  app/          local demo app (not part of the published bundle)
src/index.ts    public entry point for the embeddable component
```

## Develop

```bash
cd platform/web/ontology-editor
npm install
npm run dev      # demo app
npm run check    # type-check
npm run build:lib  # build the embeddable bundle into dist/
```

## Embed

```ts
import { OntologyEditor, type Ontology } from '@cdd/ontology-editor'
import '@cdd/ontology-editor/style.css'
```

```vue
<OntologyEditor v-model="ontology" />
```
