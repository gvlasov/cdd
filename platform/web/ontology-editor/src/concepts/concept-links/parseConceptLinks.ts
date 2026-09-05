import type { Identity } from '@/concepts/identity/Identity'

// Text may contain:
//   [Label](cdd.attribute)     → link to the concept `cdd.attribute`
//   [Attribute](.attribute)    → leading dot means "this ontology": the
//                                target is `<rootSlug>.attribute`
//   [Label](https://example)   → external link, opened in the same window
//   `git commit`                → inline monospace code
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

export interface ExternalLinkSegment {
  kind: 'external-link'
  label: string
  /** The URL as written. */
  href: string
}

export interface CodeSegment {
  kind: 'code'
  text: string
}

export type Segment = TextSegment | LinkSegment | ExternalLinkSegment | CodeSegment

const EXTERNAL_URL = /^[a-z][a-z0-9+.-]*:\/\//i

// One combined scanner: a concept link, or an inline-code span.
const TOKEN = /\[([^\]]+)\]\(([^)]+)\)|`([^`]+)`/g

/**
 * Split `text` into plain, link, external-link and code segments. `rootSlug`
 * resolves a leading-dot link target (`.attribute` → `<rootSlug>.attribute`);
 * when omitted such a target is left as written minus the dot. A target
 * written as an absolute URL (`https://…`) becomes an external link instead
 * of a concept link.
 */
export function parseConceptLinks(text: string, rootSlug?: string): Segment[] {
  const segments: Segment[] = []
  let last = 0

  for (const match of text.matchAll(TOKEN)) {
    const [whole, label, rawTarget, code] = match
    const start = match.index ?? 0
    if (start > last) segments.push({ kind: 'text', text: text.slice(last, start) })

    if (code !== undefined) {
      segments.push({ kind: 'code', text: code })
    } else if (EXTERNAL_URL.test(rawTarget)) {
      segments.push({ kind: 'external-link', label, href: rawTarget })
    } else {
      const target = rawTarget.startsWith('.')
        ? rootSlug
          ? `${rootSlug}${rawTarget}`
          : rawTarget.slice(1)
        : rawTarget
      segments.push({ kind: 'link', label, target })
    }
    last = start + whole.length
  }

  if (last < text.length) segments.push({ kind: 'text', text: text.slice(last) })
  return segments
}
