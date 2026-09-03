import type { ThemeDefinition } from 'vuetify'

// Domain colors for the ontology editor. Each names a part of an ontology:
//  - concept:   a node in the graph
//  - attribute: a concept held by another concept
//  - relation:  the labelled link between a concept and its attribute
export const ontologyColors = {
  concept: '#3949AB', // indigo
  attribute: '#00897B', // teal
  relation: '#8E24AA', // purple
} as const

export type OntologyColor = keyof typeof ontologyColors

export const ontologyLightTheme: ThemeDefinition = {
  dark: false,
  colors: { ...ontologyColors },
}

export const ontologyDarkTheme: ThemeDefinition = {
  dark: true,
  colors: {
    concept: '#7986CB',
    attribute: '#4DB6AC',
    relation: '#CE93D8',
  },
}

// Drop-in for createVuetify({ theme: ontologyTheme }).
export const ontologyTheme = {
  themes: {
    light: ontologyLightTheme,
    dark: ontologyDarkTheme,
  },
}
