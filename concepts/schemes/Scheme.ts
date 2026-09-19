// A Scheme is a navigable, automatically laid-out reflection of a concept.
// Its child element instances are deliberately kept as ontology instances:
// their `denotatum` properties can lead back into the ontology rather than
// becoming opaque identifiers inside a drawing document.
export default [
  [
    { kind: 'identity', value: 'cdd.scheme' },
    { kind: 'concept', value: 'cdd.concept' },
    { kind: 'slug', value: 'scheme' },
    { kind: 'name', value: 'Scheme' },
    { kind: 'definition', value: 'a concept drawn as a collection of automatically laid-out boxes, edges, and texts.' },
    { kind: 'attributes', value: ['cdd.scheme:boxes', 'cdd.scheme:edges', 'cdd.scheme:texts'] },
    { kind: 'exampleDiagram', value: 'cdd.scheme:example' },
  ],
  [
    { kind: 'identity', value: 'cdd.scheme:example' }, { kind: 'concept', value: 'cdd.scheme' },
    { kind: 'boxes', value: ['cdd.scheme:example.scheme', 'cdd.scheme:example.box', 'cdd.scheme:example.edge', 'cdd.scheme:example.text'] },
    { kind: 'edges', value: ['cdd.scheme:example.scheme-to-box', 'cdd.scheme:example.scheme-to-edge', 'cdd.scheme:example.scheme-to-text'] },
    { kind: 'texts', value: ['cdd.scheme:example.caption'] },
  ],
  [
    { kind: 'identity', value: 'cdd.scheme:example.scheme' }, { kind: 'concept', value: 'cdd.schemeBox' },
    { kind: 'content', value: 'Scheme\na semantic drawing' }, { kind: 'denotatum', value: 'cdd.scheme' },
    { kind: 'borderColor', value: 'rgb(var(--v-theme-primary))' }, { kind: 'padding', value: '16' },
  ],
  [
    { kind: 'identity', value: 'cdd.scheme:example.box' }, { kind: 'concept', value: 'cdd.schemeBox' },
    { kind: 'content', value: 'Box\ncontent, padding, border, colour' }, { kind: 'denotatum', value: 'cdd.schemeBox' },
    { kind: 'borderColor', value: 'rgb(var(--v-theme-concept))' }, { kind: 'padding', value: '16' },
  ],
  [
    { kind: 'identity', value: 'cdd.scheme:example.edge' }, { kind: 'concept', value: 'cdd.schemeBox' },
    { kind: 'content', value: 'Edge\nconnects two elements' }, { kind: 'denotatum', value: 'cdd.schemeEdge' },
    { kind: 'borderColor', value: 'rgb(var(--v-theme-relation))' }, { kind: 'padding', value: '16' },
  ],
  [
    { kind: 'identity', value: 'cdd.scheme:example.text' }, { kind: 'concept', value: 'cdd.schemeBox' },
    { kind: 'content', value: 'Text\naligned annotation' }, { kind: 'denotatum', value: 'cdd.schemeText' },
    { kind: 'borderColor', value: 'rgb(var(--v-theme-attribute))' }, { kind: 'padding', value: '16' },
  ],
  [
    { kind: 'identity', value: 'cdd.scheme:example.scheme-to-box' }, { kind: 'concept', value: 'cdd.schemeEdge' },
    { kind: 'source', value: 'cdd.scheme:example.scheme' }, { kind: 'target', value: 'cdd.scheme:example.box' }, { kind: 'content', value: 'contains' },
    { kind: 'denotatum', value: 'cdd.scheme' }, { kind: 'color', value: '#0f766e' }, { kind: 'lineStyle', value: 'solid' }, { kind: 'routing', value: 'straight' }, { kind: 'startHead', value: 'none' }, { kind: 'endHead', value: 'arrow' },
  ],
  [
    { kind: 'identity', value: 'cdd.scheme:example.scheme-to-edge' }, { kind: 'concept', value: 'cdd.schemeEdge' },
    { kind: 'source', value: 'cdd.scheme:example.scheme' }, { kind: 'target', value: 'cdd.scheme:example.edge' }, { kind: 'content', value: 'connects' },
    { kind: 'denotatum', value: 'cdd.scheme' }, { kind: 'color', value: '#a16207' }, { kind: 'lineStyle', value: 'dashed' }, { kind: 'routing', value: 'orthogonal' }, { kind: 'startHead', value: 'circle' }, { kind: 'endHead', value: 'diamond' },
  ],
  [
    { kind: 'identity', value: 'cdd.scheme:example.scheme-to-text' }, { kind: 'concept', value: 'cdd.schemeEdge' },
    { kind: 'source', value: 'cdd.scheme:example.scheme' }, { kind: 'target', value: 'cdd.scheme:example.text' }, { kind: 'content', value: 'labels' },
    { kind: 'denotatum', value: 'cdd.scheme' }, { kind: 'color', value: 'rgb(var(--v-theme-primary))' }, { kind: 'lineStyle', value: 'dotted' }, { kind: 'routing', value: 'orthogonal' }, { kind: 'startHead', value: 'none' }, { kind: 'endHead', value: 'arrow' },
  ],
  [
    { kind: 'identity', value: 'cdd.scheme:example.caption' }, { kind: 'concept', value: 'cdd.schemeText' },
    { kind: 'content', value: 'A Scheme is a semantic drawing.' }, { kind: 'denotatum', value: 'cdd.scheme' }, { kind: 'align', value: 'center' },
  ],
  [
    { kind: 'identity', value: 'cdd.scheme:boxes' }, { kind: 'concept', value: 'cdd.attribute' },
    { kind: 'slug', value: 'boxes' }, { kind: 'name', value: 'boxes' }, { kind: 'type', value: 'cdd.schemeBox' }, { kind: 'cardinality', value: '0+' },
  ],
  [
    { kind: 'identity', value: 'cdd.scheme:edges' }, { kind: 'concept', value: 'cdd.attribute' },
    { kind: 'slug', value: 'edges' }, { kind: 'name', value: 'edges' }, { kind: 'type', value: 'cdd.schemeEdge' }, { kind: 'cardinality', value: '0+' },
  ],
  [
    { kind: 'identity', value: 'cdd.scheme:texts' }, { kind: 'concept', value: 'cdd.attribute' },
    { kind: 'slug', value: 'texts' }, { kind: 'name', value: 'texts' }, { kind: 'type', value: 'cdd.schemeText' }, { kind: 'cardinality', value: '0+' },
  ],
  [
    { kind: 'identity', value: 'cdd.schemeBox' }, { kind: 'concept', value: 'cdd.concept' }, { kind: 'slug', value: 'schemeBox' }, { kind: 'name', value: 'Box' },
    { kind: 'definition', value: 'a padded bordered element with content, colour, and an optional denotatum.' },
    { kind: 'attributes', value: ['cdd.schemeBox:content', 'cdd.schemeBox:denotatum', 'cdd.schemeBox:color', 'cdd.schemeBox:backgroundColor', 'cdd.schemeBox:borderColor', 'cdd.schemeBox:padding'] },
  ],
  [
    { kind: 'identity', value: 'cdd.schemeEdge' }, { kind: 'concept', value: 'cdd.concept' }, { kind: 'slug', value: 'schemeEdge' }, { kind: 'name', value: 'Edge' },
    { kind: 'definition', value: 'a styled line between two boxes, optionally labelled and denoting a relationship.' },
    { kind: 'attributes', value: ['cdd.schemeEdge:source', 'cdd.schemeEdge:target', 'cdd.schemeEdge:content', 'cdd.schemeEdge:denotatum', 'cdd.schemeEdge:color', 'cdd.schemeEdge:lineStyle', 'cdd.schemeEdge:routing', 'cdd.schemeEdge:startHead', 'cdd.schemeEdge:endHead'] },
  ],
  [
    { kind: 'identity', value: 'cdd.schemeText' }, { kind: 'concept', value: 'cdd.concept' }, { kind: 'slug', value: 'schemeText' }, { kind: 'name', value: 'Text' },
    { kind: 'definition', value: 'free text in a scheme, with left, centre, or right alignment and an optional denotatum.' },
    { kind: 'attributes', value: ['cdd.schemeText:content', 'cdd.schemeText:denotatum', 'cdd.schemeText:align'] },
  ],
  ...[
    ['cdd.schemeBox:content', 'content', 'content', 'cdd.string', '1'], ['cdd.schemeBox:denotatum', 'denotatum', 'denotatum', 'cdd.instance', '0-1'],
    ['cdd.schemeBox:color', 'color', 'color', 'cdd.string', '0-1'], ['cdd.schemeBox:backgroundColor', 'backgroundColor', 'background color', 'cdd.string', '0-1'],
    ['cdd.schemeBox:borderColor', 'borderColor', 'border color', 'cdd.string', '0-1'], ['cdd.schemeBox:padding', 'padding', 'padding', 'cdd.string', '0-1'],
    ['cdd.schemeEdge:source', 'source', 'source box identity', 'cdd.string', '1'], ['cdd.schemeEdge:target', 'target', 'target box identity', 'cdd.string', '1'],
    ['cdd.schemeEdge:content', 'content', 'label', 'cdd.string', '0-1'], ['cdd.schemeEdge:denotatum', 'denotatum', 'denotatum', 'cdd.instance', '0-1'],
    ['cdd.schemeEdge:color', 'color', 'color', 'cdd.string', '0-1'], ['cdd.schemeEdge:lineStyle', 'lineStyle', 'line style: solid, dashed, dotted', 'cdd.string', '0-1'],
    ['cdd.schemeEdge:routing', 'routing', 'routing: straight or orthogonal', 'cdd.string', '0-1'],
    ['cdd.schemeEdge:startHead', 'startHead', 'start head: none, arrow, circle, diamond', 'cdd.string', '0-1'], ['cdd.schemeEdge:endHead', 'endHead', 'end head: none, arrow, circle, diamond', 'cdd.string', '0-1'],
    ['cdd.schemeText:content', 'content', 'content', 'cdd.string', '1'], ['cdd.schemeText:denotatum', 'denotatum', 'denotatum', 'cdd.instance', '0-1'],
    ['cdd.schemeText:align', 'align', 'alignment: left, center, right', 'cdd.string', '0-1'],
  ].map(([identity, slug, name, type, cardinality]) => [
    { kind: 'identity', value: identity }, { kind: 'concept', value: 'cdd.attribute' }, { kind: 'slug', value: slug }, { kind: 'name', value: name }, { kind: 'type', value: type }, { kind: 'cardinality', value: cardinality },
  ]),
]
