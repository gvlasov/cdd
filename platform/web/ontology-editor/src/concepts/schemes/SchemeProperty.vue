<script setup lang="ts">
import { computed } from 'vue'
import type { Property } from '@/concepts/properties/Property'
import type { Instance } from '@/concepts/instances/Instance'
import { useOntology } from '@/concepts/ontology/useOntology'
import { layoutOntology, layoutScheme, schemeReference } from './Scheme'

const props = defineProps<{ property: Property; instance: Instance }>()
const { ontology, navigate } = useOntology()
const layout = computed(() => {
  if (props.property.kind === 'ontologyDiagram') return layoutOntology(ontology(), schemeReference(props.property) ?? 'cdd')
  const id = schemeReference(props.property)
  return id ? layoutScheme(ontology(), id) : undefined
})
const byId = computed(() => new Map(layout.value?.boxes.map((box) => [box.id, box]) ?? []))
const textById = computed(() => new Map(layout.value?.texts.map((text) => [text.id, text]) ?? []))

function boxLineCount(padding: number): number {
  // The box is 90 SVG units high; label line-height is 1.25 × 20px.
  // Clamp only after all lines that physically fit inside its content area.
  return Math.max(1, Math.floor((90 - padding * 2) / 25))
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
  const otherX = otherBox?.x ?? otherText!.x
  const toRight = otherX >= box.x
  // Every endpoint sits on the side that faces the other element. The rule is
  // identical for a source and a target; reversing it at the target sends a
  // left-to-right edge through the far side of its destination box.
  return { x: box.x + (toRight ? 220 : 0), y: box.y + 45 }
}
type Point = { x: number; y: number }
type DrawnEdge = { source: string; target: string; routing: string }

function edgeEndpoints(edge: DrawnEdge): [Point, Point] | undefined {
  const from = point(edge.source, edge.target)
  const to = point(edge.target, edge.source)
  return from && to ? [from, to] : undefined
}
function edgeSegments(edge: DrawnEdge): Array<[Point, Point]> {
  const endpoints = edgeEndpoints(edge)
  if (!endpoints) return []
  const [from, to] = endpoints
  if (edge.routing !== 'orthogonal' || from.y === to.y) return [[from, to]]
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
      </defs>
      <g v-for="edge in layout.edges" :key="edge.id" class="edge" :class="{ clickable: edge.denotatum }" @click="navigateTo(edge.denotatum)">
        <path v-if="edgePath(edge)" :d="edgePath(edge)" fill="none" :stroke="edge.color" :stroke-width="strokeWidth(edge.boldness)" :stroke-dasharray="dash(edge.lineStyle)" :marker-start="marker(edge.startHead, 'start')" :marker-end="marker(edge.endHead, 'end')" />
        <text v-if="edge.content && edgeLabel(edge)" class="edge-label" :x="edgeLabel(edge)!.x" :y="edgeLabel(edge)!.y" :transform="edgeLabel(edge)!.transform" text-anchor="middle">{{ edge.content }}</text>
      </g>
      <g v-for="box in layout.boxes" :key="box.id" class="box" :class="{ clickable: box.denotatum }" @click="navigateTo(box.denotatum)">
        <rect :x="box.x" :y="box.y" width="220" height="90" rx="8" :fill="box.backgroundColor" :stroke="box.borderColor" stroke-width="2" />
        <foreignObject :x="box.x" :y="box.y" width="220" height="90">
          <div
            xmlns="http://www.w3.org/1999/xhtml"
            class="box-content"
            :style="{ color: box.color, padding: `${box.padding}px`, '--box-lines': boxLineCount(box.padding) }"
            :title="box.content"
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
.box-content { box-sizing: border-box; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; padding: 0; font: 1.25rem/1.25 ui-sans-serif, system-ui, sans-serif; text-align: center; }
.box-content-text { display: -webkit-box; min-width: 0; width: 100%; overflow: hidden; white-space: normal; text-overflow: ellipsis; -webkit-box-orient: vertical; -webkit-line-clamp: var(--box-lines); }
.edge-label { font: 1.25rem/1.25 ui-sans-serif, system-ui, sans-serif; fill: currentColor; paint-order: stroke; stroke: rgb(var(--v-theme-surface)); stroke-width: 4px; stroke-linejoin: round; }
.free-text { font: 1.25rem/1.25 ui-sans-serif, system-ui, sans-serif; fill: currentColor; }
</style>
