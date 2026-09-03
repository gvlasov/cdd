# Ontology editor

An embeddable Vue 3 component for viewing and editing a generic concept graph
(an ontology): typed nodes connected by typed, directed edges.

The component is developed as a standalone Vite project under
[`/platform/web/ontology-editor`](/platform/web/ontology-editor/README.md), on
the same stack as the `problems` app (Vue 3 + Vite + Vuetify 4 + TypeScript).

## Reflections

- `/platform/web/ontology-editor/` — the component's source, demo app, and build.
- `dist/` (here) — the built embeddable bundle, produced by `cdd editor:build`.
  Generated, git-ignored; run the command to (re)create it.

## Commands

- `editor:open` — serve the demo app with Vite and open it in the browser; code
  edits reflect immediately via HMR.
- `editor:build` — build the embeddable component bundle into `dist/` here.
