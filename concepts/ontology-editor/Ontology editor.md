# Ontology editor

An embeddable Vue 3 component for viewing and editing an ontology — a flat,
rhizomatic collection of concepts, where a concept is nothing but a collection
of attributes (name, definition, examples, identity, and references to other
concepts). Every instance is addressed by a unique identity string. It shows
one concept at a time, its attributes drawn in kind-defined order, with
navigation up to the concepts that reference it.

The component is developed as a standalone Vite project under
[`/platform/web/ontology-editor`](/platform/web/ontology-editor/README.md), on
the same stack as the `problems` app (Vue 3 + Vite + Vuetify 4 + TypeScript).

## Reflections

- `/platform/web/ontology-editor/` — the component's source, demo app, and build.
- `dist/` (here) — the built embeddable bundle, produced by `cdd editor:build`.
  Generated, git-ignored; run the command to (re)create it.

## Commands

- `editor:up` — bring up the local environment: install deps if needed and start
  the Vite dev server (HMR). No backend.
- `editor:open` — `editor:up` plus opening the demo app in the browser.
- `editor:build` — build the embeddable component bundle into `dist/` here.
