import type { Identity } from '@/concepts/identity/Identity'

// Text may contain markdown-style links to other concepts:
//   [Label](cdd.attribute)      → link to the concept `cdd.attribute`
//   [Attribute](.attribute)     → leading dot means "this ontology": the
//                                 target is `<rootSlug>.attribute`
//
// Everything else is plain text.

export interface TextSegment {
  kind: 'text'
  text: string
}

export interface LinkSegment {
  kind: 'link'
  label: string
  /** Resolved concept identity. */
  target: Identity
}

export type Segment = TextSegment | LinkSegment

const LINK = /\[([^\]]+)\]\(([^)]+)\)/g

/**
 * Split `text` into plain and link segments. `rootSlug` resolves a leading-dot
 * target (`.attribute` → `<rootSlug>.attribute`); when omitted such a target is
 * left as written minus the dot.
 */
export function parseConceptLinks(text: string, rootSlug?: string): Segment[] {
  const segments: Segment[] = []
  let last = 0

  for (const match of text.matchAll(LINK)) {
    const [whole, label, rawTarget] = match
    const start = match.index ?? 0
    if (start > last) segments.push({ kind: 'text', text: text.slice(last, start) })

    const target = rawTarget.startsWith('.')
      ? rootSlug
        ? `${rootSlug}${rawTarget}`
        : rawTarget.slice(1)
      : rawTarget
    segments.push({ kind: 'link', label, target })
    last = start + whole.length
  }

  if (last < text.length) segments.push({ kind: 'text', text: text.slice(last) })
  return segments
}
