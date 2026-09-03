import type { ThemeDefinition } from 'vuetify'

// Domain colors for the ontology editor. Each names a part of an ontology:
//  - concept:   an instance that declares attributes
//  - instance:  an instance that does not
//  - attribute: a concept held by another concept
//  - relation:  the labelled link between a concept and its attribute
export const ontologyColors = {
  concept: '#3949AB', // indigo
  instance: '#546E7A', // blue-grey
  attribute: '#C62828', // red
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
    instance: '#90A4AE',
    attribute: '#EF9A9A',
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
