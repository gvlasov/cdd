# Scheme

A Scheme is a concept drawn as automatically laid-out [boxes](Scheme.ts), [edges](Scheme.ts), and text.

It is a semantic reflection, not a separate drawing document: every element may have a `denotatum` pointing at the ontology instance it represents. Clicking an element in the viewer navigates to that instance.

## Use

Define an attribute on the concept being documented with type `cdd.scheme`. Its value is a Scheme instance. Add Box, Edge, and Text instances through the Scheme form. Edges name their source and target Box identities; the viewer places the boxes in directed layers and draws the edges between them.

The viewer fits the whole scheme into a width-100% block. It uses the following optional visual values:

- Box: `color`, `backgroundColor`, `borderColor`, `padding`.
- Edge: `color`, `lineStyle` (`solid`, `dashed`, `dotted`), `startHead` and `endHead` (`none`, `arrow`, `circle`, `diamond`), and `content` for its label.
- Text: `align` (`left`, `center`, `right`).
