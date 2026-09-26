import type { Identity } from '@/concepts/identity/Identity'
import type { Instance } from '@/concepts/instances/Instance'
import type { Ontology } from '@/concepts/ontology/Ontology'
import { conceptOf } from '@/concepts/ontology/Ontology'
import { firstOfKind } from '@/concepts/properties/Property'
import { instanceName } from '@/concepts/instances/Instance'

export type EdgeHead = 'none' | 'arrow' | 'circle' | 'diamond'
export type EdgeLineStyle = 'solid' | 'dashed' | 'dotted'
export type EdgeRouting = 'straight' | 'orthogonal'
export type EdgeBoldness = 'thin' | 'normal' | 'bold'
export type TextAlign = 'left' | 'center' | 'right'

export interface SchemeBox {
  id: Identity
  content: string
  denotatum?: Identity
  color: string
  backgroundColor: string
  borderColor: string
  padding: number
}

export interface SchemeEdge {
  id: Identity
  source: Identity
  target: Identity
  content: string
  denotatum?: Identity
  color: string
  lineStyle: EdgeLineStyle
  routing: EdgeRouting
  boldness: EdgeBoldness
  startHead: EdgeHead
  endHead: EdgeHead
}

export interface SchemeText {
  id: Identity
  content: string
  denotatum?: Identity
  align: TextAlign
}

export interface SchemeLayout {
  boxes: Array<SchemeBox & { x: number; y: number }>
  edges: SchemeEdge[]
  texts: Array<SchemeText & { x: number; y: number }>
  width: number
  height: number
  direction: 'leftToRight' | 'bottomToTop'
}

const BOX_WIDTH = 220
const BOX_HEIGHT = 135
const MIN_COLUMN_GAP = 70

// Labels use a 1.25rem font in the SVG. Measuring SVG text requires a live
// DOM; this conservative average glyph width reserves enough layout space
// before rendering, including the separation from both box borders.
function labelSpace(label: string): number {
  return label ? label.length * 12 + 32 : MIN_COLUMN_GAP
}

function literal(instance: Instance | undefined, kind: string, fallback = ''): string {
  const property = instance?.find((candidate) => candidate.kind === kind)
  if (!property || Array.isArray(property.value)) return fallback
  return property.value
}

function ids(instance: Instance | undefined, kind: string): Identity[] {
  const property = instance?.find((candidate) => candidate.kind === kind)
  if (!property) return []
  return Array.isArray(property.value) ? property.value : property.value ? [property.value] : []
}

function head(value: string): EdgeHead {
  return ['none', 'arrow', 'circle', 'diamond'].includes(value) ? value as EdgeHead : 'none'
}

function lineStyle(value: string): EdgeLineStyle {
  return ['solid', 'dashed', 'dotted'].includes(value) ? value as EdgeLineStyle : 'solid'
}
function routing(value: string): EdgeRouting {
  return value === 'orthogonal' ? 'orthogonal' : 'straight'
}

function boldness(value: string): EdgeBoldness {
  return ['thin', 'normal', 'bold'].includes(value) ? value as EdgeBoldness : 'normal'
}

function align(value: string): TextAlign {
  return ['left', 'center', 'right'].includes(value) ? value as TextAlign : 'center'
}

/** Reads the semantic Scheme/Box/Edge/Text instances and derives their geometry. */
export function layoutScheme(ontology: Ontology, schemeId: Identity): SchemeLayout | undefined {
  const scheme = conceptOf(ontology, schemeId)
  if (!scheme) return undefined
  const direction = literal(scheme, 'direction') === 'bottomToTop' ? 'bottomToTop' : 'leftToRight'
  const boxes = ids(scheme, 'boxes').flatMap((id) => {
    const instance = conceptOf(ontology, id)
    if (!instance) return []
    return [{
      id,
      content: literal(instance, 'content', id),
      denotatum: literal(instance, 'denotatum') || undefined,
      color: literal(instance, 'color', 'rgb(var(--v-theme-on-surface))'),
      backgroundColor: literal(instance, 'backgroundColor', 'rgb(var(--v-theme-surface))'),
      borderColor: literal(instance, 'borderColor', 'rgb(var(--v-theme-outline))'),
      padding: Number(literal(instance, 'padding', '16')) || 16,
    }]
  })
  const edges = ids(scheme, 'edges').flatMap((id) => {
    const instance = conceptOf(ontology, id)
    if (!instance) return []
    return [{
      id,
      source: literal(instance, 'source'), target: literal(instance, 'target'),
      content: literal(instance, 'content'), denotatum: literal(instance, 'denotatum') || undefined,
      color: literal(instance, 'color', 'rgb(var(--v-theme-outline))'), lineStyle: lineStyle(literal(instance, 'lineStyle')), routing: routing(literal(instance, 'routing')), boldness: boldness(literal(instance, 'boldness')),
      startHead: head(literal(instance, 'startHead')), endHead: head(literal(instance, 'endHead', 'arrow')),
    }]
  })
  const texts = ids(scheme, 'texts').flatMap((id) => {
    const instance = conceptOf(ontology, id)
    if (!instance) return []
    return [{ id, content: literal(instance, 'content', id), denotatum: literal(instance, 'denotatum') || undefined, align: align(literal(instance, 'align')) }]
  })

  // A stable, cycle-tolerant layered layout. Cyclic vertices keep layer zero;
  // DAG portions advance one layer per predecessor.
  const boxIds = new Set(boxes.map((box) => box.id))
  const incoming = new Map(boxes.map((box) => [box.id, 0]))
  const outgoing = new Map(boxes.map((box) => [box.id, [] as string[]]))
  for (const edge of edges) {
    if (!boxIds.has(edge.source) || !boxIds.has(edge.target) || edge.source === edge.target) continue
    outgoing.get(edge.source)?.push(edge.target)
    incoming.set(edge.target, (incoming.get(edge.target) ?? 0) + 1)
  }
  const queue = boxes.filter((box) => incoming.get(box.id) === 0).map((box) => box.id)
  const layer = new Map(boxes.map((box) => [box.id, 0]))
  for (let cursor = 0; cursor < queue.length; cursor += 1) {
    const id = queue[cursor]
    for (const target of outgoing.get(id) ?? []) {
      layer.set(target, Math.max(layer.get(target) ?? 0, (layer.get(id) ?? 0) + 1))
      incoming.set(target, (incoming.get(target) ?? 1) - 1)
      if (incoming.get(target) === 0) queue.push(target)
    }
  }
  if (direction === 'bottomToTop') {
    // Roadmap-like schemes align every terminal vertex at the top. Work
    // backwards through the topological order so shorter branches skip
    // intermediate layers instead of leaving their terminal boxes lower.
    const distanceToTerminal = new Map<string, number>()
    for (let cursor = queue.length - 1; cursor >= 0; cursor -= 1) {
      const id = queue[cursor]
      const distance = Math.max(
        0,
        ...(outgoing.get(id) ?? []).map((target) => (distanceToTerminal.get(target) ?? 0) + 1),
      )
      distanceToTerminal.set(id, distance)
    }
    const depth = Math.max(0, ...distanceToTerminal.values())
    for (const [id, distance] of distanceToTerminal) layer.set(id, depth - distance)
  }
  const columns = new Map<number, SchemeBox[]>()
  for (const box of boxes) {
    const column = layer.get(box.id) ?? 0
    columns.set(column, [...(columns.get(column) ?? []), box])
  }
  const lastColumn = Math.max(0, ...columns.keys())
  const gaps = Array.from({ length: lastColumn }, () => MIN_COLUMN_GAP)
  for (const edge of edges) {
    const sourceColumn = layer.get(edge.source)
    const targetColumn = layer.get(edge.target)
    if (sourceColumn === undefined || targetColumn === undefined || targetColumn <= sourceColumn) continue
    const span = targetColumn - sourceColumn
    const existingSpace = (span - 1) * BOX_WIDTH + gaps.slice(sourceColumn, targetColumn).reduce((sum, gap) => sum + gap, 0)
    const extra = Math.max(0, labelSpace(edge.content) - existingSpace)
    if (!extra) continue
    // Spread extra whitespace across every crossed layer boundary, keeping a
    // long edge from creating one visually disproportionate empty column.
    for (let boundary = sourceColumn; boundary < targetColumn; boundary += 1) gaps[boundary] += extra / span
  }
  const maxRows = Math.max(1, ...[...columns.values()].map((column) => column.length))
  const positioned = direction === 'bottomToTop'
    ? (() => {
      const separation = BOX_WIDTH + 60
      const centerX = new Map<Identity, number>()
      const terminals = boxes.filter((box) => (outgoing.get(box.id) ?? []).length === 0)
      terminals.forEach((box, index) => centerX.set(box.id, index * separation))

      // Place each predecessor at the barycenter of its direct dependents.
      // A fork therefore expands equally to either side whenever surrounding
      // vertices leave enough room for the ideal position.
      for (let cursor = queue.length - 1; cursor >= 0; cursor -= 1) {
        const id = queue[cursor]
        const dependentCenters = (outgoing.get(id) ?? []).flatMap((target) => {
          const center = centerX.get(target)
          return center === undefined ? [] : [center]
        })
        if (dependentCenters.length) {
          centerX.set(id, dependentCenters.reduce((sum, center) => sum + center, 0) / dependentCenters.length)
        }
      }

      // Separate colliding barycenters within each layer, preserving the
      // layer's center so collision avoidance does not bias the whole graph.
      for (const columnBoxes of columns.values()) {
        const ordered = columnBoxes
          .map((box, index) => ({ box, preferred: centerX.get(box.id) ?? index * separation }))
          .sort((a, b) => a.preferred - b.preferred)
        const resolved: number[] = []
        for (const entry of ordered) {
          const previous = resolved.at(-1)
          resolved.push(previous === undefined ? entry.preferred : Math.max(entry.preferred, previous + separation))
        }
        const preferredMean = ordered.reduce((sum, entry) => sum + entry.preferred, 0) / Math.max(1, ordered.length)
        const resolvedMean = resolved.reduce((sum, center) => sum + center, 0) / Math.max(1, resolved.length)
        ordered.forEach((entry, index) => centerX.set(entry.box.id, resolved[index] - resolvedMean + preferredMean))
      }

      const minimumCenter = Math.min(0, ...centerX.values())
      const offset = 48 + BOX_WIDTH / 2 - minimumCenter
      return boxes.map((box) => ({
        ...box,
        x: (centerX.get(box.id) ?? 0) + offset - BOX_WIDTH / 2,
        y: 48 + (lastColumn - (layer.get(box.id) ?? 0)) * (BOX_HEIGHT + 100),
      }))
    })()
    : (() => {
      const columnX = new Map<number, number>()
      let nextX = 48
      for (let column = 0; column <= lastColumn; column += 1) {
        columnX.set(column, nextX)
        nextX += BOX_WIDTH + (gaps[column] ?? 0)
      }
      return boxes.map((box) => {
        const column = layer.get(box.id) ?? 0
        const columnBoxes = columns.get(column) ?? []
        const row = columnBoxes.findIndex((candidate) => candidate.id === box.id)
        const rowGap = BOX_HEIGHT + 60
        const perpendicularOffset = (maxRows - columnBoxes.length) * rowGap / 2
        return { ...box, x: columnX.get(column) ?? 48, y: 48 + perpendicularOffset + row * rowGap }
      })
    })()
  const width = direction === 'bottomToTop'
    ? Math.max(360, Math.max(...positioned.map((box) => box.x + BOX_WIDTH), 0) + 48)
    : Math.max(360, Math.max(...positioned.map((box) => box.x + BOX_WIDTH), 0) + 48)
  const height = direction === 'bottomToTop'
    ? Math.max(225, 48 + (lastColumn + 1) * BOX_HEIGHT + lastColumn * 100 + 48)
    : Math.max(225, 48 + maxRows * (BOX_HEIGHT + 60))
  return {
    boxes: positioned,
    edges,
    texts: texts.map((text, index) => ({
      ...text,
      x: text.align === 'center' ? width / 2 : text.align === 'right' ? width - 48 : 48,
      y: 32 + index * 28,
    })),
    width,
    height,
    direction,
  }
}

/** A live overview of an ontology's root and every declared concept. */
export function layoutOntology(ontology: Ontology, rootId: Identity): SchemeLayout | undefined {
  const root = conceptOf(ontology, rootId)
  if (!root) return undefined
  const conceptIds = ids(root, 'concepts')
  const all = [rootId, ...conceptIds.filter((id) => id !== rootId)]
  const columns = 4
  const gapX = 48
  const gapY = 44
  const startX = 48
  const startY = 64
  const boxes = all.flatMap((id, index) => {
    const instance = conceptOf(ontology, id)
    if (!instance) return []
    const column = index % columns
    const row = Math.floor(index / columns)
    return [{
      id,
      content: instanceName(instance) ?? id,
      denotatum: id,
      color: 'rgb(var(--v-theme-on-surface))',
      backgroundColor: 'rgb(var(--v-theme-surface))',
      borderColor: index === 0 ? 'rgb(var(--v-theme-primary))' : 'rgb(var(--v-theme-outline))',
      padding: 14,
      x: startX + column * (BOX_WIDTH + gapX),
      y: startY + row * (BOX_HEIGHT + gapY),
    }]
  })
  const rows = Math.max(1, Math.ceil(boxes.length / columns))
  const width = startX * 2 + columns * BOX_WIDTH + (columns - 1) * gapX
  const height = startY + rows * BOX_HEIGHT + Math.max(0, rows - 1) * gapY + 48
  return {
    boxes,
    edges: [],
    texts: [{ id: `${rootId}:caption`, content: 'Ontology concepts', align: 'center', x: width / 2, y: 32 }],
    width,
    height,
    direction: 'leftToRight',
  }
}

export function schemeReference(property: { value: Identity | Identity[] }): Identity | undefined {
  return Array.isArray(property.value) ? property.value[0] : property.value || undefined
}
