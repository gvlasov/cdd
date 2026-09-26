<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Property } from '@/concepts/properties/Property'
import type { Instance } from '@/concepts/instances/Instance'
import { useOntology } from '@/concepts/ontology/useOntology'
import { layoutOntology, layoutScheme, schemeReference, type SchemeLayout } from './Scheme'

const props = defineProps<{ property: Property; instance: Instance }>()
const { ontology, navigate } = useOntology()
const hoveredBoxId = ref<string>()
const BOX_WIDTH = 220
const BOX_HEIGHT = 135
const ITEM_LAYER_GAP = 100
const MILESTONE_GAP = 160
const EDGE_CLEARANCE = 16
const MILESTONE_SIDE_PADDING = 24
const MILESTONE_TOP_PADDING = 40
const MILESTONE_BOTTOM_PADDING = 24
const MILESTONE_EDGE_CLEARANCE = 28
const isRoadmap = computed(() => props.instance.some((property) =>
  property.kind === 'concept' && property.value === 'cdd.roadmap',
))
const roadmapMilestones = computed(() => {
  if (!isRoadmap.value) return []
  const milestoneProperty = props.instance.find((property) => (property.kind as string) === 'milestones')
  const milestoneIds = milestoneProperty
    ? Array.isArray(milestoneProperty.value) ? milestoneProperty.value : [milestoneProperty.value]
    : []
  const assignedSteps = new Set<string>()
  return milestoneIds.flatMap((id) => {
    const milestone = ontology().instances[id]
    if (!milestone) return []
    const stepsProperty = milestone.find((property) => (property.kind as string) === 'steps')
    const declaredSteps = stepsProperty
      ? Array.isArray(stepsProperty.value) ? stepsProperty.value : [stepsProperty.value]
      : []
    // Milestones partition a roadmap: the first declaration owns a step and
    // later duplicate declarations cannot place it in another milestone.
    const stepIds = declaredSteps.filter((stepId) => {
      if (assignedSteps.has(stepId)) return false
      assignedSteps.add(stepId)
      return true
    })
    const name = milestone.find((property) => property.kind === 'name')?.value
    return [{ id, name: typeof name === 'string' ? name : id, stepIds }]
  })
})

function separateMilestoneBands(base: SchemeLayout): SchemeLayout {
  const yByBox = new Map<string, number>()
  let nextY = 48
  for (const milestone of [...roadmapMilestones.value].reverse()) {
    const stepIds = new Set(milestone.stepIds)
    const boxes = base.boxes.filter((box) => box.denotatum && stepIds.has(box.denotatum))
    const levels = [...new Set(boxes.map((box) => box.y))].sort((a, b) => a - b)
    const levelIndex = new Map(levels.map((y, index) => [y, index]))
    for (const box of boxes) yByBox.set(box.id, nextY + (levelIndex.get(box.y) ?? 0) * (BOX_HEIGHT + ITEM_LAYER_GAP))
    if (levels.length) {
      nextY += (levels.length - 1) * (BOX_HEIGHT + ITEM_LAYER_GAP) + BOX_HEIGHT + MILESTONE_GAP
    }
  }
  const unassigned = base.boxes.filter((box) => !yByBox.has(box.id))
  const unassignedLevels = [...new Set(unassigned.map((box) => box.y))].sort((a, b) => a - b)
  const unassignedLevelIndex = new Map(unassignedLevels.map((y, index) => [y, index]))
  for (const box of unassigned) yByBox.set(box.id, nextY + (unassignedLevelIndex.get(box.y) ?? 0) * (BOX_HEIGHT + ITEM_LAYER_GAP))
  const boxes = base.boxes.map((box) => ({ ...box, y: yByBox.get(box.id) ?? box.y }))
  return {
    ...base,
    boxes,
    height: Math.max(225, Math.max(...boxes.map((box) => box.y + BOX_HEIGHT), 0) + 48),
  }
}

const layout = computed(() => {
  const base = props.property.kind === 'ontologyDiagram'
    ? layoutOntology(ontology(), schemeReference(props.property) ?? 'cdd')
    : (() => {
      const id = schemeReference(props.property)
      return id ? layoutScheme(ontology(), id) : undefined
    })()
  return base && isRoadmap.value ? separateMilestoneBands(base) : base
})
const displayEdgeLabels = computed(() => !isRoadmap.value)
const byId = computed(() => new Map(layout.value?.boxes.map((box) => [box.id, box]) ?? []))
const textById = computed(() => new Map(layout.value?.texts.map((text) => [text.id, text]) ?? []))

const milestoneGroups = computed(() => {
  if (!isRoadmap.value || !layout.value) return []
  return roadmapMilestones.value.flatMap((milestone) => {
    const stepIds = new Set(milestone.stepIds)
    const boxes = layout.value!.boxes.filter((box) => box.denotatum && stepIds.has(box.denotatum))
    if (!boxes.length) return []
    const minX = Math.min(...boxes.map((box) => box.x))
    const minY = Math.min(...boxes.map((box) => box.y))
    const maxX = Math.max(...boxes.map((box) => box.x + BOX_WIDTH))
    const maxY = Math.max(...boxes.map((box) => box.y + BOX_HEIGHT))
    return [{
      id: milestone.id,
      name: milestone.name,
      x: minX - MILESTONE_SIDE_PADDING,
      y: minY - MILESTONE_TOP_PADDING,
      width: maxX - minX + MILESTONE_SIDE_PADDING * 2,
      height: maxY - minY + MILESTONE_TOP_PADDING + MILESTONE_BOTTOM_PADDING,
    }]
  })
})

function boxLineCount(padding: number): number {
  // The box is 135 SVG units high; label line-height is 0.9375 × 16px.
  // Clamp only after all lines that physically fit inside its content area.
  return Math.max(1, Math.floor((135 - padding * 2) / 18.75))
}

function marker(head: string, position: 'start' | 'end'): string | undefined {
  return head === 'none' ? undefined : `url(#${position}-${head})`
}
function dash(style: string): string | undefined {
  if (style === 'dashed') return '10 7'
  if (style === 'dotted') return '2 6'
  return undefined
}
function strokeWidth(boldness: string): number {
  return boldness === 'thin' ? 1 : boldness === 'bold' ? 4 : 2
}
function point(id: string, toward: string): { x: number; y: number } | undefined {
  const box = byId.value.get(id)
  const text = textById.value.get(id)
  const otherBox = byId.value.get(toward)
  const otherText = textById.value.get(toward)
  if (!box && !text) return undefined
  if (!otherBox && !otherText) return undefined
  if (!box) return { x: text!.x, y: text!.y - 5 }
  if (layout.value?.direction === 'bottomToTop') {
    const otherY = otherBox?.y ?? otherText!.y
    return { x: box.x + BOX_WIDTH / 2, y: box.y + (otherY < box.y ? 0 : BOX_HEIGHT) }
  }
  const otherX = otherBox?.x ?? otherText!.x
  const toRight = otherX >= box.x
  // Every endpoint sits on the side that faces the other element. The rule is
  // identical for a source and a target; reversing it at the target sends a
  // left-to-right edge through the far side of its destination box.
  return { x: box.x + (toRight ? BOX_WIDTH : 0), y: box.y + BOX_HEIGHT / 2 }
}
type Point = { x: number; y: number }
type DrawnEdge = { source: string; target: string; routing: string }

function edgeGradientId(edge: { id: string }): string {
  return `edge-flow-${edge.id.replace(/[^a-zA-Z0-9_-]/g, '-')}`
}

function gradientPoint(edge: DrawnEdge, position: 0 | 1): Point {
  return edgeEndpoints(edge)?.[position] ?? { x: 0, y: 0 }
}

function gradientColor(edge: DrawnEdge & { color: string }, peak = false): string {
  if (edgeIsHighlighted(edge)) {
    return peak
      ? 'color-mix(in srgb, rgb(var(--v-theme-primary)) 78%, rgb(var(--v-theme-on-primary)))'
      : 'rgb(var(--v-theme-primary))'
  }
  return peak
    ? `color-mix(in srgb, ${edge.color} 78%, rgb(var(--v-theme-on-surface)))`
    : edge.color
}

function edgeIsHighlighted(edge: DrawnEdge): boolean {
  return hoveredBoxId.value !== undefined
    && (edge.source === hoveredBoxId.value || edge.target === hoveredBoxId.value)
}

const orderedEdges = computed(() => {
  const edges = layout.value?.edges ?? []
  if (!hoveredBoxId.value) return edges
  return [
    ...edges.filter((edge) => !edgeIsHighlighted(edge)),
    ...edges.filter(edgeIsHighlighted),
  ]
})

function edgeEndpoints(edge: DrawnEdge): [Point, Point] | undefined {
  const from = point(edge.source, edge.target)
  const to = point(edge.target, edge.source)
  return from && to ? [from, to] : undefined
}

function overlaps(a1: number, a2: number, b1: number, b2: number): boolean {
  return Math.min(a1, a2) < Math.max(b1, b2) && Math.max(a1, a2) > Math.min(b1, b2)
}

function horizontalY(preferred: number, x1: number, x2: number, edge: DrawnEdge): number {
  const boundaries = milestoneGroups.value.flatMap((milestone) => [
    { y: milestone.y, x1: milestone.x, x2: milestone.x + milestone.width },
    { y: milestone.y + milestone.height, x1: milestone.x, x2: milestone.x + milestone.width },
  ])
  const relevant = boundaries.filter((boundary) => overlaps(x1, x2, boundary.x1, boundary.x2))
  const candidates = [
    preferred,
    ...relevant.flatMap((boundary) => [
      boundary.y - MILESTONE_EDGE_CLEARANCE,
      boundary.y + MILESTONE_EDGE_CLEARANCE,
    ]),
  ]
  return candidates
    .filter((y) => relevant.every((boundary) => Math.abs(y - boundary.y) >= MILESTONE_EDGE_CLEARANCE))
    .filter((y) => [...byId.value.values()].every((box) =>
      box.id === edge.source
      || box.id === edge.target
      || !overlaps(x1, x2, box.x - EDGE_CLEARANCE, box.x + BOX_WIDTH + EDGE_CLEARANCE)
      || y <= box.y - EDGE_CLEARANCE
      || y >= box.y + BOX_HEIGHT + EDGE_CLEARANCE,
    ))
    .sort((a, b) => Math.abs(preferred - a) - Math.abs(preferred - b))[0]
    ?? preferred
}

function interMilestoneLanes(edge: DrawnEdge): { source: number; target: number } | undefined {
  const milestoneFor = (boxId: string) => {
    const denotatum = byId.value.get(boxId)?.denotatum
    if (!denotatum) return undefined
    const milestone = roadmapMilestones.value.find((candidate) => candidate.stepIds.includes(denotatum))
    return milestoneGroups.value.find((group) => group.id === milestone?.id)
  }
  const sourceMilestone = milestoneFor(edge.source)
  const targetMilestone = milestoneFor(edge.target)
  if (!sourceMilestone || !targetMilestone || sourceMilestone.id === targetMilestone.id) return undefined
  const ordered = [...milestoneGroups.value].sort((a, b) => a.y - b.y)
  const sourceIndex = ordered.findIndex((milestone) => milestone.id === sourceMilestone.id)
  const targetIndex = ordered.findIndex((milestone) => milestone.id === targetMilestone.id)
  const laneBetween = (upperIndex: number) => {
    const upper = ordered[upperIndex]
    const lower = ordered[upperIndex + 1]
    return (upper.y + upper.height + lower.y) / 2
  }
  if (sourceIndex > targetIndex) {
    return { source: laneBetween(sourceIndex - 1), target: laneBetween(targetIndex) }
  }
  return { source: laneBetween(sourceIndex), target: laneBetween(targetIndex - 1) }
}

function edgeSegments(edge: DrawnEdge): Array<[Point, Point]> {
  const endpoints = edgeEndpoints(edge)
  if (!endpoints) return []
  const [from, to] = endpoints
  if (edge.routing !== 'orthogonal' || from.y === to.y) return [[from, to]]
  if (layout.value?.direction === 'bottomToTop') {
    const upwards = to.y < from.y
    const milestoneLanes = interMilestoneLanes(edge)
    const preferredSourceBendY = milestoneLanes?.source ?? from.y + (upwards ? -50 : 50)
    const preferredTargetBendY = milestoneLanes?.target ?? to.y + (upwards ? 50 : -50)
    const minY = Math.min(preferredSourceBendY, preferredTargetBendY)
    const maxY = Math.max(preferredSourceBendY, preferredTargetBendY)
    const obstacles = [...byId.value.values()].filter((box) =>
      box.id !== edge.source
      && box.id !== edge.target
      && box.y < maxY
      && box.y + BOX_HEIGHT > minY,
    )
    const milestoneSides = milestoneGroups.value
      .filter((milestone) => milestone.y < maxY && milestone.y + milestone.height > minY)
      .flatMap((milestone) => [milestone.x, milestone.x + milestone.width])
    const candidates = [
      to.x,
      from.x,
      ...(obstacles.flatMap((box) => [box.x - EDGE_CLEARANCE, box.x + BOX_WIDTH + EDGE_CLEARANCE])),
      ...(milestoneSides.flatMap((x) => [x - MILESTONE_EDGE_CLEARANCE, x + MILESTONE_EDGE_CLEARANCE])),
      EDGE_CLEARANCE,
      (layout.value?.width ?? 0) - EDGE_CLEARANCE,
    ]
    const corridorX = candidates
      .filter((x) => obstacles.every((box) => x <= box.x - EDGE_CLEARANCE || x >= box.x + BOX_WIDTH + EDGE_CLEARANCE))
      .filter((x) => milestoneSides.every((side) => Math.abs(x - side) >= MILESTONE_EDGE_CLEARANCE))
      .sort((a, b) => Math.abs(from.x - a) + Math.abs(to.x - a) - Math.abs(from.x - b) - Math.abs(to.x - b))[0]
      ?? from.x
    const sourceBendY = horizontalY(preferredSourceBendY, from.x, corridorX, edge)
    const targetBendY = horizontalY(preferredTargetBendY, corridorX, to.x, edge)
    const points = [
      from,
      { x: from.x, y: sourceBendY },
      { x: corridorX, y: sourceBendY },
      { x: corridorX, y: targetBendY },
      { x: to.x, y: targetBendY },
      to,
    ]
    return points.slice(1).map((point, index) => [points[index], point])
  }
  const middleX = (from.x + to.x) / 2
  return [[from, { x: middleX, y: from.y }], [{ x: middleX, y: from.y }, { x: middleX, y: to.y }], [{ x: middleX, y: to.y }, to]]
}
function edgePath(edge: DrawnEdge): string | undefined {
  const segments = edgeSegments(edge)
  if (!segments.length) return undefined
  return `M ${segments[0][0].x} ${segments[0][0].y} ${segments.slice(1).reduce((path, [, to]) => `${path} L ${to.x} ${to.y}`, `L ${segments[0][1].x} ${segments[0][1].y}`)}`
}
function edgeLabel(edge: DrawnEdge): { x: number; y: number; transform: string } | undefined {
  const segments = edgeSegments(edge)
  if (!segments.length) return undefined
  const [from, to] = segments.reduce((longest, segment) => {
    const length = Math.hypot(segment[1].x - segment[0].x, segment[1].y - segment[0].y)
    const longestLength = Math.hypot(longest[1].x - longest[0].x, longest[1].y - longest[0].y)
    return length > longestLength ? segment : longest
  })
  const x = (from.x + to.x) / 2
  const y = (from.y + to.y) / 2
  if (layout.value?.direction === 'bottomToTop') return { x, y: y - 9, transform: '' }
  let degrees = Math.atan2(to.y - from.y, to.x - from.x) * 180 / Math.PI
  // Keep labels legible regardless of which way the edge was declared.
  if (degrees > 90 || degrees < -90) degrees += 180
  return { x, y: y - 9, transform: `rotate(${degrees} ${x} ${y})` }
}
function navigateTo(id?: string) { if (id) navigate(id) }
</script>

<template>
  <section v-if="layout" class="scheme" :aria-label="`${property.kind} scheme`">
    <svg
      class="scheme-canvas"
      :viewBox="`0 0 ${layout.width} ${layout.height}`"
      :width="layout.width"
      :height="layout.height"
      role="img"
    >
      <defs>
        <marker id="end-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M 0 0 L 10 5 L 0 10 z" fill="context-stroke" /></marker>
        <marker id="start-arrow" viewBox="0 0 10 10" refX="1" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M 10 0 L 0 5 L 10 10 z" fill="context-stroke" /></marker>
        <marker v-for="position in ['start', 'end']" :id="`${position}-circle`" :key="`${position}-circle`" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="7" markerHeight="7"><circle cx="5" cy="5" r="3.5" fill="white" stroke="context-stroke" /></marker>
        <marker v-for="position in ['start', 'end']" :id="`${position}-diamond`" :key="`${position}-diamond`" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="8" markerHeight="8"><path d="M 5 0 L 10 5 L 5 10 L 0 5 z" fill="white" stroke="context-stroke" /></marker>
        <linearGradient
          v-for="edge in layout.edges"
          :id="edgeGradientId(edge)"
          :key="edgeGradientId(edge)"
          gradientUnits="userSpaceOnUse"
          :x1="gradientPoint(edge, 0).x"
          :y1="gradientPoint(edge, 0).y"
          :x2="gradientPoint(edge, 1).x"
          :y2="gradientPoint(edge, 1).y"
        >
          <stop offset="0" :stop-color="gradientColor(edge)" />
          <stop offset="0.48" :stop-color="gradientColor(edge, true)" />
          <stop offset="1" :stop-color="gradientColor(edge)" />
        </linearGradient>
      </defs>
      <g v-for="milestone in milestoneGroups" :key="milestone.id" class="milestone clickable" @click="navigateTo(milestone.id)">
        <rect class="milestone-boundary" :x="milestone.x" :y="milestone.y" :width="milestone.width" :height="milestone.height" rx="12" />
        <text class="milestone-label" :x="milestone.x + 12" :y="milestone.y + 24">{{ milestone.name }}</text>
      </g>
      <g v-for="edge in orderedEdges" :key="edge.id" class="edge" :class="{ clickable: edge.denotatum, highlighted: edgeIsHighlighted(edge) }" @click="navigateTo(edge.denotatum)">
        <path v-if="edgePath(edge)" class="edge-base" :d="edgePath(edge)" fill="none" :stroke="edge.color" :stroke-width="strokeWidth(edge.boldness)" :stroke-dasharray="dash(edge.lineStyle)" />
        <path v-if="edgePath(edge)" class="edge-flow" :d="edgePath(edge)" pathLength="100" fill="none" :stroke="`url(#${edgeGradientId(edge)})`" :stroke-width="strokeWidth(edge.boldness)" />
        <path v-if="edgePath(edge)" class="edge-heads" :d="edgePath(edge)" pathLength="100" fill="none" :stroke="edge.color" :stroke-width="strokeWidth(edge.boldness)" stroke-dasharray="0 1000" :marker-start="marker(edge.startHead, 'start')" :marker-end="marker(edge.endHead, 'end')" />
        <text v-if="displayEdgeLabels && edge.content && edgeLabel(edge)" class="edge-label" :x="edgeLabel(edge)!.x" :y="edgeLabel(edge)!.y" :transform="edgeLabel(edge)!.transform" text-anchor="middle">{{ edge.content }}</text>
      </g>
      <g
        v-for="box in layout.boxes"
        :key="box.id"
        class="box"
        :class="{ clickable: box.denotatum, highlighted: hoveredBoxId === box.id }"
        @mouseenter="hoveredBoxId = box.id"
        @mouseleave="hoveredBoxId = undefined"
        @click="navigateTo(box.denotatum)"
      >
        <rect :x="box.x" :y="box.y" width="220" height="135" rx="8" :fill="box.backgroundColor" :stroke="box.borderColor" stroke-width="2" />
        <foreignObject :x="box.x" :y="box.y" width="220" height="135">
          <div
            xmlns="http://www.w3.org/1999/xhtml"
            class="box-content"
            :style="{ color: box.color, padding: `${box.padding}px`, '--box-lines': boxLineCount(box.padding) }"
          ><span class="box-content-text">{{ box.content }}</span></div>
        </foreignObject>
      </g>
      <text v-for="text in layout.texts" :key="text.id" :x="text.x" :y="text.y" class="free-text" :text-anchor="text.align === 'center' ? 'middle' : 'start'" :class="{ clickable: text.denotatum }" @click="navigateTo(text.denotatum)">{{ text.content }}</text>
    </svg>
  </section>
  <div v-else class="text-caption text-medium-emphasis">No scheme selected.</div>
</template>

<style scoped>
.scheme { flex: 0 0 auto; width: 100%; min-width: 0; border: 1px solid rgb(var(--v-theme-outline)); border-radius: 8px; background: transparent; color: rgb(var(--v-theme-on-surface)); overflow: hidden; }
.scheme-canvas { width: 100%; height: auto; min-height: 180px; display: block; }
.clickable { cursor: pointer; } .clickable:hover { opacity: .72; }
.edge-base { transition: stroke .18s ease, stroke-width .18s ease; }
.edge-flow { pointer-events: none; stroke-linecap: round; stroke-dasharray: 18 12; opacity: .52; filter: drop-shadow(0 0 1px rgb(var(--v-theme-primary))) drop-shadow(0 0 3px rgb(var(--v-theme-primary))); animation: edge-flow 4s linear infinite; transition: opacity .18s ease; }
.edge-heads { pointer-events: none; }
.edge.highlighted .edge-base, .edge.highlighted .edge-heads { stroke: rgb(var(--v-theme-primary)); filter: drop-shadow(0 0 3px rgb(var(--v-theme-primary))); }
.edge.highlighted .edge-flow { opacity: .78; }
.box.highlighted { opacity: 1; }
.box.highlighted rect { stroke-width: 4px; filter: drop-shadow(0 0 5px rgb(var(--v-theme-primary))); }
.box-content { box-sizing: border-box; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; padding: 0; font: 0.9375rem/1.25 ui-sans-serif, system-ui, sans-serif; text-align: center; }
.box-content-text { display: -webkit-box; min-width: 0; width: 100%; overflow: hidden; white-space: normal; text-overflow: ellipsis; -webkit-box-orient: vertical; -webkit-line-clamp: var(--box-lines); }
.milestone-boundary { fill: rgb(var(--v-theme-surface-variant)); fill-opacity: .08; stroke: rgb(var(--v-theme-outline)); stroke-width: 2px; stroke-dasharray: 8 6; }
.milestone-label { font: 0.875rem/1.25 ui-sans-serif, system-ui, sans-serif; fill: currentColor; }
.edge-label { font: 0.9375rem/1.25 ui-sans-serif, system-ui, sans-serif; fill: currentColor; paint-order: stroke; stroke-width: 4px; stroke-linejoin: round; }
.free-text { font: 0.9375rem/1.25 ui-sans-serif, system-ui, sans-serif; fill: currentColor; }
@keyframes edge-flow { from { stroke-dashoffset: 30; } to { stroke-dashoffset: 0; } }
@media (prefers-reduced-motion: reduce) { .edge-flow { animation: none; } }
</style>
