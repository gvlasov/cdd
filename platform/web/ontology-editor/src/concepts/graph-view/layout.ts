import type { Ontology } from '@/concepts/ontology/Ontology'

export interface NodePosition {
  id: string
  x: number
  y: number
}

export interface GraphLayout {
  positions: Record<string, NodePosition>
  width: number
  height: number
}

// Deterministic circular layout. No physics, no dependencies — enough to
// render a readable first-cut view; a force layout can replace this later.
export function circularLayout(ontology: Ontology, radius = 220): GraphLayout {
  const n = ontology.nodes.length
  const cx = radius + 120
  const cy = radius + 120
  const positions: Record<string, NodePosition> = {}

  ontology.nodes.forEach((node, i) => {
    const angle = n === 0 ? 0 : (i / n) * Math.PI * 2 - Math.PI / 2
    positions[node.id] = {
      id: node.id,
      x: cx + Math.cos(angle) * radius,
      y: cy + Math.sin(angle) * radius,
    }
  })

  return { positions, width: cx + radius + 120, height: cy + radius + 120 }
}
