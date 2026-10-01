<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import type { Property } from '@/concepts/properties/Property'
import type { Instance } from '@/concepts/instances/Instance'
import { nameText } from '@/concepts/ontology/Ontology'
import { useOntology } from '@/concepts/ontology/useOntology'
import { layoutOntology, layoutScheme, schemeReference, type SchemeLayout } from './Scheme'

const props = defineProps<{ property: Property; instance: Instance }>()
const { ontology, navigate } = useOntology()
const hoveredBoxId = ref<string>()
const hoveredMilestoneId = ref<string>()
const schemeCanvas = ref<SVGSVGElement>()
const scheme = ref<HTMLElement>()
const scrollContainer = ref<HTMLElement>()
const scrollContainerOverlay = ref({ left: 0, bottom: 0 })
const focusedTaskId = ref<string>()
const roadmapFullscreen = ref(false)
const boxOffsets = ref(new Map<string, Point>())
const boxTransitioning = ref(false)
let longPressTimer: ReturnType<typeof setTimeout> | undefined
let boxTransitionTimer: ReturnType<typeof setTimeout> | undefined
let suppressNextBoxClick = false
const BOX_WIDTH = 220
const BOX_HEIGHT = 135
const ROADMAP_MAX_BOX_WIDTH = 340
const ROADMAP_FONT_SIZE = 30
const ROADMAP_LINE_HEIGHT = 40
const roadmapTextWidths = new Map<string, number>()
const roadmapBoxSizes = new Map<string, { width: number; height: number }>()
let roadmapTextContext: CanvasRenderingContext2D | undefined
const ITEM_LAYER_GAP = 100
const MILESTONE_GAP = 160
const EDGE_CLEARANCE = 16
const MILESTONE_SIDE_PADDING = 24
const MILESTONE_TOP_PADDING = 40
const MILESTONE_BOTTOM_PADDING = 24
// Milestone bands leave 96 SVG units between their visible boundaries:
// 160px row gap minus their 40px top and 24px bottom padding. Route an edge
// halfway through that space, matching the centered inter-level lanes.
const MILESTONE_EDGE_CLEARANCE = (MILESTONE_GAP - MILESTONE_TOP_PADDING - MILESTONE_BOTTOM_PADDING) / 2
const FOCUSED_MILESTONE_GAP = 64
const FOCUSED_ROW_GAP = 160
const MILESTONE_LABEL_HEIGHT = 56
const MILESTONE_LABEL_INSET = 12
const VIEWPORT_MARGIN = 24
const ROADMAP_TOP_PADDING = MILESTONE_TOP_PADDING + VIEWPORT_MARGIN + MILESTONE_LABEL_HEIGHT / 2
const visibleViewport = ref<{ left: number; top: number; right: number; bottom: number; marginLeft: number; marginTop: number; marginRight: number; marginBottom: number }>({
  left: 0,
  top: 0,
  right: Number.POSITIVE_INFINITY,
  bottom: Number.POSITIVE_INFINITY,
  marginLeft: VIEWPORT_MARGIN,
  marginTop: VIEWPORT_MARGIN,
  marginRight: VIEWPORT_MARGIN,
  marginBottom: VIEWPORT_MARGIN,
})
let scrollParent: HTMLElement | undefined
let resizeObserver: ResizeObserver | undefined
const isRoadmap = computed(() => props.instance.some((property) =>
  property.kind === 'concept' && property.value === 'cdd.roadmap',
))

function boxContent(box: { content: string; denotatum?: string }): string {
  if (!isRoadmap.value || !box.denotatum) return box.content
  const step = ontology().instances[box.denotatum]
  const kind = step?.find((property) => property.kind === 'kind')?.value
  const emoji = typeof kind === 'string' ? ({ task: '📝', goal: '🎯', problem: '🤔' }[kind]) : undefined
  if (!emoji) return box.content
  return `${emoji} ${box.content.replace(/^(Task|Goal|Problem)\s+/, '')}`
}

function measureRoadmapText(value: string): number {
  const cached = roadmapTextWidths.get(value)
  if (cached !== undefined) return cached
  roadmapTextContext ??= document.createElement('canvas').getContext('2d') ?? undefined
  if (!roadmapTextContext) return value.length * ROADMAP_FONT_SIZE * .55
  roadmapTextContext.font = `${ROADMAP_FONT_SIZE}px ui-sans-serif, system-ui, sans-serif`
  const width = roadmapTextContext.measureText(value).width
  roadmapTextWidths.set(value, width)
  return width
}

function roadmapBoxSize(box: { content: string; padding: number; denotatum?: string }): { width: number; height: number } {
  const content = boxContent(box)
  const key = `${box.padding}:${content}`
  const cached = roadmapBoxSizes.get(key)
  if (cached) return cached
  const width = Math.min(ROADMAP_MAX_BOX_WIDTH, Math.max(1, measureRoadmapText(content)) + box.padding * 2)
  const textWidth = Math.max(1, width - box.padding * 2)
  let lines = 1
  let line = ''
  for (const word of content.split(/\s+/)) {
    const candidate = line ? `${line} ${word}` : word
    if (line && measureRoadmapText(candidate) > textWidth) {
      lines += 1
      line = word
    } else {
      line = candidate
    }
  }
  const size = { width, height: lines * ROADMAP_LINE_HEIGHT + box.padding * 2 }
  roadmapBoxSizes.set(key, size)
  return size
}

function boxWidth(box: { content: string; padding: number; denotatum?: string }): number {
  return isRoadmap.value ? roadmapBoxSize(box).width : BOX_WIDTH
}

function boxHeight(box: { content: string; padding: number; denotatum?: string }): number {
  return isRoadmap.value ? roadmapBoxSize(box).height : BOX_HEIGHT
}

function boxX(box: { x: number; content: string; padding: number }): number {
  return box.x + (BOX_WIDTH - boxWidth(box)) / 2
}
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
    const label = typeof name === 'string' ? nameText(ontology(), name) ?? name : id
    return [{ id, name: label, stepIds }]
  })
})

function separateMilestoneBands(base: SchemeLayout): SchemeLayout {
  const yByBox = new Map<string, number>()
  // Keep the first milestone's top boundary far enough inside the SVG for its
  // default top-side label and the viewport safety margin to fit above it.
  let nextY = ROADMAP_TOP_PADDING
  for (const milestone of [...roadmapMilestones.value].reverse()) {
    const stepIds = new Set(milestone.stepIds)
    const boxes = base.boxes.filter((box) => box.denotatum && stepIds.has(box.denotatum))
    const levels = [...new Set(boxes.map((box) => box.y))].sort((a, b) => a - b)
    let bandHeight = 0
    for (const level of levels) {
      const levelBoxes = boxes.filter((box) => box.y === level)
      for (const box of levelBoxes) yByBox.set(box.id, nextY + bandHeight)
      bandHeight += Math.max(...levelBoxes.map(boxHeight)) + ITEM_LAYER_GAP
    }
    if (levels.length) {
      nextY += bandHeight - ITEM_LAYER_GAP + MILESTONE_GAP
    }
  }
  const unassigned = base.boxes.filter((box) => !yByBox.has(box.id))
  const unassignedLevels = [...new Set(unassigned.map((box) => box.y))].sort((a, b) => a - b)
  let unassignedHeight = 0
  for (const level of unassignedLevels) {
    const levelBoxes = unassigned.filter((box) => box.y === level)
    for (const box of levelBoxes) yByBox.set(box.id, nextY + unassignedHeight)
    unassignedHeight += Math.max(...levelBoxes.map(boxHeight)) + ITEM_LAYER_GAP
  }
  const boxes = base.boxes.map((box) => ({ ...box, y: yByBox.get(box.id) ?? box.y }))
  return {
    ...base,
    boxes,
    height: Math.max(225, Math.max(...boxes.map((box) => box.y + boxHeight(box)), 0) + 48),
  }
}

const layout = computed(() => {
  const base = props.property.kind === 'ontologyDiagram'
    ? layoutOntology(ontology(), schemeReference(props.property) ?? 'cdd')
    : (() => {
      const id = schemeReference(props.property)
      return id ? layoutScheme(ontology(), id) : undefined
    })()
  const roadmap = base && isRoadmap.value ? separateMilestoneBands(base) : base
  return roadmap && focusedTaskId.value ? focusedRoadmapLayout(roadmap, focusedTaskId.value).layout : roadmap
})
const displayEdgeLabels = computed(() => !isRoadmap.value)
const byId = computed(() => new Map(layout.value?.boxes.map((box) => [box.id, box]) ?? []))
const textById = computed(() => new Map(layout.value?.texts.map((text) => [text.id, text]) ?? []))
const unlinkedBoxes = computed(() => {
  if (!isRoadmap.value || focusedTaskId.value) return []
  const linked = new Set((layout.value?.edges ?? []).flatMap((edge) => [edge.source, edge.target]))
  return (layout.value?.boxes ?? [])
    .filter((box) => !linked.has(box.id))
    .sort((left, right) => left.y - right.y || left.x - right.x)
})

type MilestoneGroup = { id: string; milestoneId: string; name: string; boxIds: string[]; x: number; y: number; width: number; height: number }

function groupsForBoxes(boxes: SchemeLayout['boxes'], prefix = ''): MilestoneGroup[] {
  if (!isRoadmap.value || !layout.value) return []
  return roadmapMilestones.value.flatMap((milestone) => {
    const stepIds = new Set(milestone.stepIds)
    const boxes = layout.value!.boxes.filter((box) => box.denotatum && stepIds.has(box.denotatum))
    if (!boxes.length) return []
    const minY = Math.min(...boxes.map((box) => box.y))
    const minX = Math.min(...boxes.map((box) => boxX(box)))
    const maxX = Math.max(...boxes.map((box) => boxX(box) + boxWidth(box)))
    const maxY = Math.max(...boxes.map((box) => box.y + boxHeight(box)))
    return [{
      id: `${prefix}${milestone.id}`,
      milestoneId: milestone.id,
      name: milestone.name,
      boxIds: boxes.map((box) => box.id),
      x: minX - MILESTONE_SIDE_PADDING,
      y: minY - MILESTONE_TOP_PADDING,
      width: maxX - minX + MILESTONE_SIDE_PADDING * 2,
      height: maxY - minY + MILESTONE_TOP_PADDING + MILESTONE_BOTTOM_PADDING,
    }]
  })
}

const focusedMilestoneGroups = computed(() => {
  const focusedId = focusedTaskId.value
  const current = layout.value
  if (!focusedId || !current) return undefined
  const mainBox = current.boxes.find((box) => box.denotatum === focusedId)
  if (!mainBox) return []
  const rowStep = BOX_HEIGHT + FOCUSED_ROW_GAP
  const groupForRow = (y: number, row: string) => groupsForBoxes(current.boxes.filter((box) => box.y === y), `${row}:`)
  return [
    ...groupForRow(mainBox.y - rowStep, 'dependents'),
    ...groupForRow(mainBox.y, 'task'),
    ...groupForRow(mainBox.y + rowStep, 'dependencies'),
  ]
})

const milestoneGroups = computed(() => focusedMilestoneGroups.value ?? groupsForBoxes(layout.value?.boxes ?? []))

function focusedRoadmapLayout(base: SchemeLayout, taskId: string): { layout: SchemeLayout } {
  const task = base.boxes.find((box) => box.denotatum === taskId)
  if (!task) return { layout: base }
  const boxesById = new Map(base.boxes.map((box) => [box.id, box]))
  const dependentIds = base.edges
    .filter((edge) => edge.source === task.id)
    .map((edge) => edge.target)
    .filter((id) => boxesById.has(id) && id !== task.id)
  const dependencyIds = base.edges
    .filter((edge) => edge.target === task.id)
    .map((edge) => edge.source)
    .filter((id) => boxesById.has(id) && id !== task.id)
  const dependents = [...new Set(dependentIds)].flatMap((id) => boxesById.get(id) ?? [])
  const dependencies = [...new Set(dependencyIds)].flatMap((id) => boxesById.get(id) ?? [])
  const rowBoxes = [dependents, [task], dependencies]
  const milestoneFor = (box: typeof base.boxes[number]) => roadmapMilestones.value.find((milestone) => milestone.stepIds.includes(box.denotatum ?? ''))?.id
  const groupsForRow = (boxes: typeof base.boxes) => {
    const groups = new Map<string, typeof base.boxes>()
    for (const box of boxes) {
      const key = milestoneFor(box) ?? `unassigned:${box.id}`
      groups.set(key, [...(groups.get(key) ?? []), box])
    }
    return [...groups.entries()]
      .sort(([left], [right]) => {
        const leftIndex = roadmapMilestones.value.findIndex((milestone) => milestone.id === left)
        const rightIndex = roadmapMilestones.value.findIndex((milestone) => milestone.id === right)
        return (leftIndex < 0 ? Number.MAX_SAFE_INTEGER : leftIndex) - (rightIndex < 0 ? Number.MAX_SAFE_INTEGER : rightIndex)
      })
      .map(([, group]) => [...group].sort((left, right) => left.x - right.x))
  }
  const groupedRows = rowBoxes.map(groupsForRow)
  const groupWidth = (group: typeof base.boxes) =>
    group.reduce((width, box) => width + boxWidth(box), 0)
    + Math.max(0, group.length - 1) * 24
    + MILESTONE_SIDE_PADDING * 2
  const rowWidths = groupedRows.map((groups) => Math.max(0, groups.reduce((sum, group) => sum + groupWidth(group), 0) + Math.max(0, groups.length - 1) * FOCUSED_MILESTONE_GAP))
  const width = Math.max(360, base.width, ...rowWidths.map((rowWidth) => rowWidth + 96))
  const yByRow = [
    ROADMAP_TOP_PADDING,
    ROADMAP_TOP_PADDING + BOX_HEIGHT + FOCUSED_ROW_GAP,
    ROADMAP_TOP_PADDING + (BOX_HEIGHT + FOCUSED_ROW_GAP) * 2,
  ]
  const positionRow = (groups: Array<typeof base.boxes>, y: number) => {
    const rowWidth = groups.reduce((sum, group) => sum + groupWidth(group), 0) + Math.max(0, groups.length - 1) * FOCUSED_MILESTONE_GAP
    let x = (width - rowWidth) / 2
    return groups.flatMap((group) => {
      const positioned = group.map((box) => {
        const width = boxWidth(box)
        const positionedBox = { ...box, x: x + MILESTONE_SIDE_PADDING + width / 2 - BOX_WIDTH / 2, y }
        x += width + 24
        return positionedBox
      })
      x += MILESTONE_SIDE_PADDING * 2 - 24 + FOCUSED_MILESTONE_GAP
      return positioned
    })
  }
  const boxes = groupedRows.flatMap((groups, row) => positionRow(groups, yByRow[row]))
  const boxIds = new Set(boxes.map((box) => box.id))
  return {
    layout: {
      ...base,
      boxes,
      edges: base.edges.filter((edge) => boxIds.has(edge.source) && boxIds.has(edge.target)),
      texts: [],
      width,
      height: yByRow[2] + BOX_HEIGHT + 48,
    },
  }
}

function updateVisibleViewport(): void {
  const canvas = schemeCanvas.value
  if (!canvas || !layout.value) return
  const canvasRect = canvas.getBoundingClientRect()
  const fullscreen = document.fullscreenElement === scheme.value
  const viewportRect = (fullscreen ? scheme.value : scrollParent)?.getBoundingClientRect() ?? canvasRect
  if (scrollParent) {
    scrollContainerOverlay.value = {
      left: viewportRect.left,
      bottom: Math.max(0, window.innerHeight - viewportRect.bottom),
    }
  }
  if (!canvasRect.width || !canvasRect.height) return
  const scaleX = layout.value.width / canvasRect.width
  const scaleY = layout.value.height / canvasRect.height
  const left = Math.max(0, viewportRect.left - canvasRect.left) * scaleX
  const top = Math.max(0, viewportRect.top - canvasRect.top) * scaleY
  const right = Math.min(canvasRect.width, viewportRect.right - canvasRect.left) * scaleX
  const bottom = Math.min(canvasRect.height, viewportRect.bottom - canvasRect.top) * scaleY
  const safeLeft = Math.max(0, viewportRect.left + VIEWPORT_MARGIN - canvasRect.left) * scaleX
  const safeTop = Math.max(0, viewportRect.top + VIEWPORT_MARGIN - canvasRect.top) * scaleY
  const safeRight = Math.min(canvasRect.width, viewportRect.right - VIEWPORT_MARGIN - canvasRect.left) * scaleX
  const safeBottom = Math.min(canvasRect.height, viewportRect.bottom - VIEWPORT_MARGIN - canvasRect.top) * scaleY
  visibleViewport.value = {
    left,
    top,
    right,
    bottom,
    marginLeft: Math.max(0, safeLeft - left),
    marginTop: Math.max(0, safeTop - top),
    marginRight: Math.max(0, right - safeRight),
    marginBottom: Math.max(0, bottom - safeBottom),
  }
}

onMounted(() => nextTick(() => {
  scrollParent = schemeCanvas.value?.closest<HTMLElement>('.scroll-region') ?? undefined
  scrollContainer.value = scrollParent
  scrollParent?.addEventListener('scroll', updateVisibleViewport, { passive: true })
  scheme.value?.addEventListener('scroll', updateVisibleViewport, { passive: true })
  window.addEventListener('resize', updateVisibleViewport, { passive: true })
  window.addEventListener('keydown', handleKeydown)
  document.addEventListener('fullscreenchange', syncRoadmapFullscreen)
  resizeObserver = new ResizeObserver(updateVisibleViewport)
  if (schemeCanvas.value) resizeObserver.observe(schemeCanvas.value)
  if (scrollParent) resizeObserver.observe(scrollParent)
  updateVisibleViewport()
}))

function syncRoadmapFullscreen(): void {
  roadmapFullscreen.value = document.fullscreenElement === scheme.value
  void nextTick(updateVisibleViewport)
}

async function toggleRoadmapFullscreen(): Promise<void> {
  if (!isRoadmap.value || !scheme.value) return
  if (document.fullscreenElement === scheme.value) {
    await document.exitFullscreen()
    return
  }
  await scheme.value.requestFullscreen()
}

onBeforeUnmount(() => {
  scrollParent?.removeEventListener('scroll', updateVisibleViewport)
  scheme.value?.removeEventListener('scroll', updateVisibleViewport)
  window.removeEventListener('resize', updateVisibleViewport)
  window.removeEventListener('keydown', handleKeydown)
  document.removeEventListener('fullscreenchange', syncRoadmapFullscreen)
  resizeObserver?.disconnect()
  if (longPressTimer) clearTimeout(longPressTimer)
  if (boxTransitionTimer) clearTimeout(boxTransitionTimer)
})

function handleKeydown(event: KeyboardEvent): void {
  if (event.key !== 'Escape' || !focusedTaskId.value) return
  event.preventDefault()
  focusedTaskId.value = undefined
  boxOffsets.value = new Map()
}

function boxTransform(box: { id: string }): string | undefined {
  const offset = boxOffsets.value.get(box.id)
  return offset ? `translate(${offset.x} ${offset.y})` : undefined
}

function centerFocusedTask(): void {
  const canvas = schemeCanvas.value
  const focused = focusedTaskId.value && layout.value?.boxes.find((box) => box.denotatum === focusedTaskId.value)
  if (!canvas || !focused) return
  const parent = scrollParent
  if (!parent) {
    canvas.scrollIntoView({ block: 'center', behavior: 'smooth' })
    return
  }
  const canvasRect = canvas.getBoundingClientRect()
  const scaleY = canvasRect.height / (layout.value?.height ?? 1)
  const taskCenter = canvasRect.top - parent.getBoundingClientRect().top + (focused.y + BOX_HEIGHT / 2) * scaleY
  parent.scrollTo({ top: parent.scrollTop + taskCenter - parent.clientHeight / 2, behavior: 'smooth' })
}

function scrollToUnlinkedTasks(): void {
  const canvas = schemeCanvas.value
  const first = unlinkedBoxes.value[0]
  if (!canvas || !first) return
  const canvasRect = canvas.getBoundingClientRect()
  const scaleY = canvasRect.height / (layout.value?.height ?? 1)
  // The instance viewer may grow with the document instead of owning an
  // internal scrollbar. In that layout, scrolling `.scroll-region` is a
  // no-op; move the document page to the first unlinked task instead.
  if (!scrollParent || scrollParent.scrollHeight <= scrollParent.clientHeight) {
    window.scrollTo({
      top: Math.max(0, window.scrollY + canvasRect.top + first.y * scaleY - 24),
      behavior: 'smooth',
    })
    return
  }
  const parentRect = scrollParent.getBoundingClientRect()
  const top = scrollParent.scrollTop + canvasRect.top - parentRect.top + first.y * scaleY - 24
  const start = scrollParent.scrollTop
  const target = Math.max(0, top)
  const startedAt = performance.now()
  const step = (now: number) => {
    const progress = Math.min(1, (now - startedAt) / 180)
    scrollParent!.scrollTop = start + (target - start) * (1 - (1 - progress) ** 3)
    if (progress < 1) requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
}

async function focusTask(taskId: string): Promise<void> {
  if (!isRoadmap.value) return
  if (boxTransitionTimer) clearTimeout(boxTransitionTimer)
  boxTransitioning.value = false
  const previousPositions = new Map((layout.value?.boxes ?? []).map((box) => [box.id, { x: box.x, y: box.y }]))
  const nextFocusedTaskId = focusedTaskId.value === taskId ? undefined : taskId
  focusedTaskId.value = nextFocusedTaskId
  await nextTick()
  const offsets = new Map<string, Point>()
  for (const box of layout.value?.boxes ?? []) {
    const previous = previousPositions.get(box.id)
    if (previous) offsets.set(box.id, { x: previous.x - box.x, y: previous.y - box.y })
  }
  boxOffsets.value = offsets
  await nextTick()
  schemeCanvas.value?.getBoundingClientRect()
  boxTransitioning.value = true
  boxOffsets.value = new Map()
  if (nextFocusedTaskId) centerFocusedTask()
  boxTransitionTimer = setTimeout(() => { boxTransitioning.value = false }, 160)
}

function startLongPress(taskId: string | undefined, event: PointerEvent): void {
  if (!isRoadmap.value || !taskId || event.button !== 0) return
  longPressTimer = setTimeout(() => {
    suppressNextBoxClick = true
    void focusTask(taskId)
  }, 250)
}

function cancelLongPress(): void {
  if (!longPressTimer) return
  clearTimeout(longPressTimer)
  longPressTimer = undefined
}

function clickBox(id?: string): void {
  if (suppressNextBoxClick) {
    suppressNextBoxClick = false
    return
  }
  navigateTo(id)
}

function boxLineCount(padding: number): number {
  // The box is 135 SVG units high; label line-height is 0.9375 × 16px.
  // Clamp only after all lines that physically fit inside its content area.
  return Math.max(1, Math.floor((135 - padding * 2) / 18.75))
}

function arrowMarkerId(edge: { id: string }, position: 'start' | 'end'): string {
  return `edge-${position}-arrow-${edge.id.replace(/[^a-zA-Z0-9_-]/g, '-')}`
}
function marker(edge: DrawnEdge & { id: string }, head: string, position: 'start' | 'end'): string | undefined {
  if (head === 'none') return undefined
  return head === 'arrow' ? `url(#${arrowMarkerId(edge, position)})` : `url(#${position}-${head})`
}
function endMarker(edge: DrawnEdge & { id: string; endHead: string }): string | undefined {
  return marker(edge, edge.endHead, 'end')
}
function dash(style: string): string | undefined {
  if (style === 'dashed') return '10 7'
  if (style === 'dotted') return '2 6'
  return undefined
}
function strokeWidth(boldness: string): number {
  return boldness === 'thin' ? 1 : boldness === 'bold' ? 4 : 2
}
function boxBackground(backgroundColor: string, borderColor: string): string {
  if (!isRoadmap.value) return backgroundColor
  return `color-mix(in srgb, ${borderColor} 16%, rgb(var(--v-theme-surface)))`
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
    return { x: boxX(box) + boxWidth(box) / 2, y: box.y + (otherY < box.y ? 0 : boxHeight(box)) }
  }
  const otherX = otherBox?.x ?? otherText!.x
  const toRight = otherX >= box.x
  // Every endpoint sits on the side that faces the other element. The rule is
  // identical for a source and a target; reversing it at the target sends a
  // left-to-right edge through the far side of its destination box.
  return { x: boxX(box) + (toRight ? boxWidth(box) : 0), y: box.y + boxHeight(box) / 2 }
}
type Point = { x: number; y: number }
type DrawnEdge = { source: string; target: string; routing: string }

function edgeGradientId(edge: { id: string }): string {
  return `edge-flow-${edge.id.replace(/[^a-zA-Z0-9_-]/g, '-')}`
}

function gradientPoint(edge: DrawnEdge & { id: string }, position: 0 | 1): Point {
  return renderedEdge(edge)?.endpoints?.[position] ?? { x: 0, y: 0 }
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

function arrowColor(edge: DrawnEdge & { color: string }): string {
  return edgeIsHighlighted(edge) ? 'rgb(var(--v-theme-primary))' : edge.color
}

function edgeIsHighlighted(edge: DrawnEdge): boolean {
  return hoveredBoxId.value !== undefined
    && (edge.source === hoveredBoxId.value || edge.target === hoveredBoxId.value)
}

const orderedEdges = computed(() => {
  const edges = layout.value?.edges ?? []
  const ordered = !hoveredBoxId.value ? edges : [
    ...edges.filter((edge) => !edgeIsHighlighted(edge)),
    ...edges.filter(edgeIsHighlighted),
  ]
  return ordered.map((edge) => ({ ...edge, rendering: edgeRenderings.value.get(edge.id) }))
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
      || !overlaps(x1, x2, boxX(box) - EDGE_CLEARANCE, boxX(box) + boxWidth(box) + EDGE_CLEARANCE)
      || y <= box.y - EDGE_CLEARANCE
      || y >= box.y + BOX_HEIGHT + EDGE_CLEARANCE,
    ))
    .sort((a, b) => Math.abs(preferred - a) - Math.abs(preferred - b))[0]
    ?? preferred
}

function interMilestoneLanes(edge: DrawnEdge): { source: number; target: number } | undefined {
  const milestoneFor = (boxId: string) => {
    return milestoneGroups.value.find((group) => group.boxIds.includes(boxId))
  }
  const sourceMilestone = milestoneFor(edge.source)
  const targetMilestone = milestoneFor(edge.target)
  if (!sourceMilestone || !targetMilestone || sourceMilestone.id === targetMilestone.id) return undefined
  const rows = [...milestoneGroups.value]
    .sort((left, right) => left.y - right.y)
    .reduce<Array<{ groups: MilestoneGroup[]; top: number; bottom: number }>>((rows, group) => {
      const row = rows.at(-1)
      if (row && Math.abs(row.top - group.y) < 1) {
        row.groups.push(group)
        row.bottom = Math.max(row.bottom, group.y + group.height)
      } else {
        rows.push({ groups: [group], top: group.y, bottom: group.y + group.height })
      }
      return rows
    }, [])
  const sourceIndex = rows.findIndex((row) => row.groups.some((group) => group.id === sourceMilestone.id))
  const targetIndex = rows.findIndex((row) => row.groups.some((group) => group.id === targetMilestone.id))
  if (sourceIndex === targetIndex || sourceIndex < 0 || targetIndex < 0) return undefined
  const laneBetween = (upperIndex: number) => {
    const upper = rows[upperIndex]
    const lower = rows[upperIndex + 1]
    return (upper.bottom + lower.top) / 2
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
      ...(obstacles.flatMap((box) => [boxX(box) - EDGE_CLEARANCE, boxX(box) + boxWidth(box) + EDGE_CLEARANCE])),
      ...(milestoneSides.flatMap((x) => [x - MILESTONE_EDGE_CLEARANCE, x + MILESTONE_EDGE_CLEARANCE])),
      EDGE_CLEARANCE,
      (layout.value?.width ?? 0) - EDGE_CLEARANCE,
    ]
    const corridorX = candidates
      .filter((x) => obstacles.every((box) => x <= boxX(box) - EDGE_CLEARANCE || x >= boxX(box) + boxWidth(box) + EDGE_CLEARANCE))
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

type LabelPlacement = { x: number; y: number; width: number; height: number; rotation: 0 | 90 }

function segmentIntersectsRect(segment: [Point, Point], rect: { left: number; top: number; right: number; bottom: number }): boolean {
  const [from, to] = segment
  if (from.x === to.x) {
    return from.x >= rect.left && from.x <= rect.right && overlaps(from.y, to.y, rect.top, rect.bottom)
  }
  if (from.y === to.y) {
    return from.y >= rect.top && from.y <= rect.bottom && overlaps(from.x, to.x, rect.left, rect.right)
  }
  return false
}

function labelIntersectsEdge(x: number, y: number, visualWidth: number, visualHeight: number): boolean {
  const clearance = 6
  const rect = {
    left: x - visualWidth / 2 - clearance,
    top: y - visualHeight / 2 - clearance,
    right: x + visualWidth / 2 + clearance,
    bottom: y + visualHeight / 2 + clearance,
  }
  return (layout.value?.edges ?? []).some((edge) => edgeSegments(edge).some((segment) => segmentIntersectsRect(segment, rect)))
}

function candidateCenters(minimum: number, maximum: number, ideal: number): number[] {
  if (minimum > maximum) return []
  const center = Math.max(minimum, Math.min(maximum, ideal))
  const values = [center]
  for (let offset = 16; center - offset >= minimum || center + offset <= maximum; offset += 16) {
    if (center - offset >= minimum) values.push(center - offset)
    if (center + offset <= maximum) values.push(center + offset)
  }
  return values
}

const milestoneLabels = computed(() => {
  const viewport = Number.isFinite(visibleViewport.value.right)
    ? visibleViewport.value
    : { left: 0, top: 0, right: layout.value?.width ?? 0, bottom: layout.value?.height ?? 0, marginLeft: VIEWPORT_MARGIN, marginTop: VIEWPORT_MARGIN, marginRight: VIEWPORT_MARGIN, marginBottom: VIEWPORT_MARGIN }
  return milestoneGroups.value
    .filter((milestone) =>
      milestone.x < viewport.right
      && milestone.x + milestone.width > viewport.left
      && milestone.y < viewport.bottom
      && milestone.y + milestone.height > viewport.top,
    )
    .map((milestone): LabelPlacement & { id: string; name: string } => {
      const width = Math.max(96, measureRoadmapText(milestone.name) + 32)
      const horizontal = (side: 0 | 1, margin: boolean, avoidEdges: boolean): LabelPlacement | undefined => {
        const marginLeft = margin ? viewport.marginLeft : 0
        const marginTop = margin ? viewport.marginTop : 0
        const marginRight = margin ? viewport.marginRight : 0
        const marginBottom = margin ? viewport.marginBottom : 0
        const y = [milestone.y, milestone.y + milestone.height][side]
        if (y < viewport.top + marginTop + MILESTONE_LABEL_HEIGHT / 2) return undefined
        if (y > viewport.bottom - marginBottom - MILESTONE_LABEL_HEIGHT / 2) return undefined
        const minimum = Math.max(milestone.x + width / 2, viewport.left + marginLeft + width / 2)
        const maximum = Math.min(milestone.x + milestone.width - width / 2, viewport.right - marginRight - width / 2)
        const x = candidateCenters(minimum, maximum, milestone.x + MILESTONE_LABEL_INSET + width / 2)
          .find((candidate) => !avoidEdges || !labelIntersectsEdge(candidate, y, width, MILESTONE_LABEL_HEIGHT))
        if (x !== undefined) return { x, y, width, height: MILESTONE_LABEL_HEIGHT, rotation: 0 }
        return undefined
      }
      const vertical = (side: 0 | 1, margin: boolean, avoidEdges: boolean): LabelPlacement | undefined => {
        const marginLeft = margin ? viewport.marginLeft : 0
        const marginTop = margin ? viewport.marginTop : 0
        const marginRight = margin ? viewport.marginRight : 0
        const marginBottom = margin ? viewport.marginBottom : 0
        const x = [milestone.x, milestone.x + milestone.width][side]
        if (x < viewport.left + marginLeft + MILESTONE_LABEL_HEIGHT / 2) return undefined
        if (x > viewport.right - marginRight - MILESTONE_LABEL_HEIGHT / 2) return undefined
        const minimum = Math.max(milestone.y + width / 2, viewport.top + marginTop + width / 2)
        const maximum = Math.min(milestone.y + milestone.height - width / 2, viewport.bottom - marginBottom - width / 2)
        const y = candidateCenters(minimum, maximum, milestone.y + MILESTONE_LABEL_INSET + width / 2)
          .find((candidate) => !avoidEdges || !labelIntersectsEdge(x, candidate, MILESTONE_LABEL_HEIGHT, width))
        if (y !== undefined) return { x, y, width, height: MILESTONE_LABEL_HEIGHT, rotation: 90 }
        return undefined
      }
      const placement = horizontal(0, true, true)
        ?? horizontal(0, false, true)
        ?? horizontal(0, false, false)
        ?? horizontal(1, true, true)
        ?? horizontal(1, false, true)
        ?? vertical(0, true, true)
        ?? vertical(0, false, true)
        ?? vertical(1, true, true)
        ?? vertical(1, false, true)
        ?? horizontal(1, false, false)
        ?? vertical(0, false, false)
        ?? vertical(1, false, false)
        ?? { x: milestone.x, y: milestone.y, width, height: MILESTONE_LABEL_HEIGHT, rotation: 0 as const }
      return { id: milestone.id, name: milestone.name, ...placement }
    })
})

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
type EdgeRendering = {
  path: string | undefined
  label: { x: number; y: number; transform: string } | undefined
  endpoints: [Point, Point] | undefined
}
const edgeRenderings = computed(() => new Map<string, EdgeRendering>((layout.value?.edges ?? []).map((edge) => [
  edge.id,
  { path: edgePath(edge), label: edgeLabel(edge), endpoints: edgeEndpoints(edge) },
])))

function renderedEdge(edge: { id: string }): EdgeRendering | undefined {
  return edgeRenderings.value.get(edge.id)
}
function navigateTo(id?: string) { if (id) navigate(id) }
</script>

<template>
  <section ref="scheme" v-if="layout" class="scheme" :class="{ roadmap: isRoadmap }" :aria-label="`${property.kind} scheme`">
    <v-btn
      v-if="isRoadmap"
      class="roadmap-fullscreen-button"
      :aria-label="roadmapFullscreen ? 'Exit roadmap fullscreen' : 'Show roadmap fullscreen'"
      :title="roadmapFullscreen ? 'Exit fullscreen' : 'Fullscreen'"
      icon
      variant="text"
      @click.stop="toggleRoadmapFullscreen"
    >
      <v-icon :icon="roadmapFullscreen ? 'mdi-fullscreen-exit' : 'mdi-fullscreen'" />
    </v-btn>
    <svg
      ref="schemeCanvas"
      class="scheme-canvas"
      :viewBox="`0 0 ${layout.width} ${layout.height}`"
      :width="layout.width"
      :height="layout.height"
      role="img"
    >
      <defs>
        <marker id="end-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M 0 0 L 10 5 L 0 10 z" fill="context-stroke" /></marker>
        <marker id="end-arrow-focus" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="270"><path d="M 0 0 L 10 5 L 0 10 z" fill="context-stroke" /></marker>
        <marker id="start-arrow" viewBox="0 0 10 10" refX="1" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M 10 0 L 0 5 L 10 10 z" fill="context-stroke" /></marker>
        <marker v-for="edge in layout.edges" :id="arrowMarkerId(edge, 'start')" :key="arrowMarkerId(edge, 'start')" viewBox="0 0 10 10" refX="1" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M 10 0 L 0 5 L 10 10 z" :fill="arrowColor(edge)" /></marker>
        <marker v-for="edge in layout.edges" :id="arrowMarkerId(edge, 'end')" :key="arrowMarkerId(edge, 'end')" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" :orient="focusedTaskId ? 270 : 'auto'"><path d="M 0 0 L 10 5 L 0 10 z" :fill="arrowColor(edge)" /></marker>
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
      <g
        v-for="milestone in milestoneGroups"
        :key="milestone.id"
        class="milestone clickable"
        :class="{ highlighted: hoveredMilestoneId === milestone.id }"
        @mouseenter="hoveredMilestoneId = milestone.id"
        @mouseleave="hoveredMilestoneId = undefined"
        @click="navigateTo(milestone.id)"
      >
        <rect class="milestone-boundary" :x="milestone.x" :y="milestone.y" :width="milestone.width" :height="milestone.height" rx="12" />
      </g>
      <g v-for="edge in orderedEdges" :key="edge.id" class="edge" :class="{ clickable: edge.denotatum, highlighted: edgeIsHighlighted(edge) }" @click="navigateTo(edge.denotatum)">
        <path v-if="edge.rendering?.path" class="edge-base" :d="edge.rendering.path" fill="none" :stroke="edge.color" :stroke-width="strokeWidth(edge.boldness)" :stroke-dasharray="dash(edge.lineStyle)" />
        <path v-if="edge.rendering?.path" class="edge-flow" :d="edge.rendering.path" pathLength="100" fill="none" :stroke="`url(#${edgeGradientId(edge)})`" :stroke-width="strokeWidth(edge.boldness)" />
        <text v-if="displayEdgeLabels && edge.content && edge.rendering?.label" class="edge-label" :x="edge.rendering.label.x" :y="edge.rendering.label.y" :transform="edge.rendering.label.transform" text-anchor="middle">{{ edge.content }}</text>
      </g>
      <g
        v-for="box in layout.boxes"
        :key="box.id"
        class="box"
        :class="{ clickable: box.denotatum, highlighted: hoveredBoxId === box.id, focused: box.denotatum === focusedTaskId, transitioning: boxTransitioning }"
        :transform="boxTransform(box)"
        @mouseenter="hoveredBoxId = box.id"
        @mouseleave="hoveredBoxId = undefined"
        @pointerdown="startLongPress(box.denotatum, $event)"
        @pointerup="cancelLongPress"
        @pointerleave="cancelLongPress"
        @pointercancel="cancelLongPress"
        @contextmenu.prevent
        @click="clickBox(box.denotatum)"
      >
        <rect class="box-underlay" :x="boxX(box)" :y="box.y" :width="boxWidth(box)" :height="boxHeight(box)" rx="8" />
        <rect class="box-face" :x="boxX(box)" :y="box.y" :width="boxWidth(box)" :height="boxHeight(box)" rx="8" :fill="boxBackground(box.backgroundColor, box.borderColor)" :stroke="box.borderColor" stroke-width="2" />
        <foreignObject :x="boxX(box)" :y="box.y" :width="boxWidth(box)" :height="boxHeight(box)">
          <div
            xmlns="http://www.w3.org/1999/xhtml"
            class="box-content"
            :class="{ 'roadmap-box-content': isRoadmap }"
            :style="{ color: box.color, padding: `${box.padding}px`, '--box-lines': boxLineCount(box.padding) }"
          ><span class="box-content-text">{{ boxContent(box) }}</span></div>
        </foreignObject>
      </g>
      <template v-for="edge in orderedEdges" :key="`${edge.id}:heads`">
        <path
          v-if="edge.rendering?.path"
          class="edge-heads"
          :d="edge.rendering.path"
          pathLength="100"
          fill="none"
          :stroke="edge.color"
          :stroke-width="strokeWidth(edge.boldness)"
          stroke-dasharray="0 1000"
          :marker-start="marker(edge, edge.startHead, 'start')"
          :marker-end="endMarker(edge)"
        />
      </template>
      <text v-for="text in layout.texts" :key="text.id" :x="text.x" :y="text.y" class="free-text" :text-anchor="text.align === 'center' ? 'middle' : 'start'" :class="{ clickable: text.denotatum }" @click="navigateTo(text.denotatum)">{{ text.content }}</text>
      <g
        v-for="label in milestoneLabels"
        :key="label.id"
        class="milestone-label clickable"
        :class="{ highlighted: hoveredMilestoneId === label.id }"
        :transform="`translate(${label.x} ${label.y}) rotate(${label.rotation})`"
        @mouseenter="hoveredMilestoneId = label.id"
        @mouseleave="hoveredMilestoneId = undefined"
        @click="navigateTo(label.id)"
      >
        <rect :x="-label.width / 2" :y="-label.height / 2" :width="label.width" :height="label.height" rx="15" />
        <text text-anchor="middle" dominant-baseline="central">{{ label.name }}</text>
      </g>
    </svg>
  </section>
  <Teleport v-if="scrollContainer && unlinkedBoxes.length" :to="scrollContainer">
    <v-btn class="unlinked-items-button" variant="flat" rounded="0" elevation="0" :style="{ left: `${scrollContainerOverlay.left}px`, bottom: `${scrollContainerOverlay.bottom}px` }" @click="scrollToUnlinkedTasks">
      {{ unlinkedBoxes.length }} items not linked in
    </v-btn>
  </Teleport>
  <div v-else class="text-caption text-medium-emphasis">No scheme selected.</div>
</template>

<style scoped>
.scheme { position: relative; flex: 0 0 auto; width: 100%; min-width: 0; border: 1px solid rgb(var(--v-theme-outline)); border-radius: 8px; background: transparent; color: rgb(var(--v-theme-on-surface)); overflow: hidden; }
.scheme.roadmap { align-self: stretch; }
.scheme-canvas { width: 100%; height: auto; min-height: 180px; display: block; }
.scheme:fullscreen { width: 100vw; height: 100vh; border: 0; border-radius: 0; background: rgb(var(--v-theme-surface)); overflow: auto; }
.roadmap-fullscreen-button { position: absolute; z-index: 1; top: 8px; right: 8px; background: color-mix(in srgb, rgb(var(--v-theme-surface)) 86%, transparent); }
.clickable { cursor: pointer; } .clickable:hover { opacity: .72; }
.edge-base { transition: stroke .18s ease, stroke-width .18s ease; }
.edge-flow { pointer-events: none; stroke-linecap: round; stroke-dasharray: 18 12; opacity: .52; filter: drop-shadow(0 0 1px rgb(var(--v-theme-primary))) drop-shadow(0 0 3px rgb(var(--v-theme-primary))); animation: edge-flow 4s linear infinite; transition: opacity .18s ease; }
.edge-heads { pointer-events: none; }
.edge.highlighted .edge-base, .edge.highlighted .edge-heads { stroke: rgb(var(--v-theme-primary)); filter: drop-shadow(0 0 3px rgb(var(--v-theme-primary))); }
.edge.highlighted .edge-flow { opacity: .78; }
.box.transitioning { transition: transform .16s cubic-bezier(.2, .85, .4, 1); }
.box.highlighted { opacity: 1; }
.box-underlay { fill: rgb(var(--v-theme-surface)); }
.box.clickable:hover { opacity: 1; }
.box.highlighted .box-face { stroke-width: 4px; filter: drop-shadow(0 0 5px rgb(var(--v-theme-primary))); }
.box.focused .box-face { stroke-width: 4px; filter: drop-shadow(0 0 7px rgb(var(--v-theme-primary))); }
.box-content { box-sizing: border-box; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; padding: 0; font: 0.9375rem/1.25 ui-sans-serif, system-ui, sans-serif; text-align: center; }
.roadmap-box-content { font-size: 1.875rem; line-height: 1.333; }
.box-content-text { display: -webkit-box; min-width: 0; width: 100%; overflow: hidden; white-space: normal; text-overflow: ellipsis; -webkit-box-orient: vertical; -webkit-line-clamp: var(--box-lines); }
.milestone-boundary, .milestone-label rect { fill: color-mix(in srgb, rgb(var(--v-theme-surface-variant)) 8%, rgb(var(--v-theme-surface))); stroke: rgb(var(--v-theme-outline)); stroke-width: 2px; }
.milestone-boundary { stroke-dasharray: 8 6; }
.milestone-label text { font: 700 1.875rem/1.333 ui-sans-serif, system-ui, sans-serif; fill: currentColor; }
.milestone.highlighted .milestone-boundary, .milestone-label.highlighted rect { fill: color-mix(in srgb, rgb(var(--v-theme-primary)) 12%, rgb(var(--v-theme-surface))); }
.milestone.clickable:hover, .milestone-label.clickable:hover { opacity: 1; }
.edge-label { font: 0.9375rem/1.25 ui-sans-serif, system-ui, sans-serif; fill: currentColor; paint-order: stroke; stroke-width: 4px; stroke-linejoin: round; }
.free-text { font: 0.9375rem/1.25 ui-sans-serif, system-ui, sans-serif; fill: currentColor; }
.unlinked-items-button { position: fixed; z-index: 1; min-width: 0; border: 0; border-radius: 0 8px 0 0; background: rgb(var(--v-theme-surface)); color: inherit; padding: 8px 12px; font: .875rem/1.25 ui-sans-serif, system-ui, sans-serif; text-transform: none; cursor: pointer; }
@keyframes edge-flow { from { stroke-dashoffset: 30; } to { stroke-dashoffset: 0; } }
@media (prefers-reduced-motion: reduce) { .edge-flow { animation: none; } .box.transitioning { transition: none; } }
</style>
