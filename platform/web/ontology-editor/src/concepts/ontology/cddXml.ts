import type { Identity } from '@/concepts/identity/Identity'
import type { Instance } from '@/concepts/instances/Instance'
import type { Ontology } from './Ontology'
import type { Property, PropertyKindName } from '@/concepts/properties/Property'

/** The current, uncompressed XML interchange format for `.cdd` files. */
export const CDD_XML_VERSION = '1'

/** An error whose message is safe to show to a person opening a `.cdd` file. */
export class CddXmlError extends Error {
  constructor(message: string) {
    super(`Invalid .cdd file: ${message}`)
    this.name = 'CddXmlError'
  }
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

/**
 * Serializes the complete addressable ontology store into a standalone `.cdd`
 * XML document. Values are represented as either `<string>` or `<list>` so an
 * empty string cannot be confused with an empty list.
 */
export function serializeCdd(ontology: Ontology): string {
  const lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    `<cdd version="${CDD_XML_VERSION}" root="${escapeXml(ontology.root)}">`,
    '  <instances>',
  ]

  for (const [identity, instance] of Object.entries(ontology.instances).sort(([a], [b]) =>
    a.localeCompare(b),
  )) {
    lines.push(`    <instance identity="${escapeXml(identity)}">`)
    for (const property of instance) {
      lines.push(`      <property kind="${escapeXml(property.kind)}">`)
      if (Array.isArray(property.value)) {
        lines.push('        <list>')
        for (const item of property.value) lines.push(`          <item>${escapeXml(item)}</item>`)
        lines.push('        </list>')
      } else {
        lines.push(`        <string>${escapeXml(property.value)}</string>`)
      }
      lines.push('      </property>')
    }
    lines.push('    </instance>')
  }

  lines.push('  </instances>', '</cdd>', '')
  return lines.join('\n')
}

function childElements(element: Element): Element[] {
  return Array.from(element.children)
}

function exactlyOneChild(element: Element, name: string, context: string): Element {
  const children = childElements(element)
  if (children.length !== 1 || children[0].tagName !== name) {
    throw new CddXmlError(`${context} must contain exactly one <${name}> element`)
  }
  return children[0]
}

function requiredAttribute(element: Element, name: string, context: string): string {
  const value = element.getAttribute(name)
  if (value === null || value === '') throw new CddXmlError(`${context} needs a non-empty ${name} attribute`)
  return value
}

function parseProperty(element: Element, instanceId: Identity): Property {
  if (element.tagName !== 'property') throw new CddXmlError(`instance ${instanceId} may contain only <property> elements`)
  const kind = requiredAttribute(element, 'kind', `property in ${instanceId}`) as PropertyKindName
  const value = childElements(element)
  if (value.length !== 1) throw new CddXmlError(`property ${kind} in ${instanceId} needs one value`)

  if (value[0].tagName === 'string') {
    if (childElements(value[0]).length) throw new CddXmlError(`string value of ${kind} in ${instanceId} cannot contain elements`)
    return { kind, value: value[0].textContent ?? '' }
  }
  if (value[0].tagName === 'list') {
    const items = childElements(value[0])
    if (items.some((item) => item.tagName !== 'item' || childElements(item).length)) {
      throw new CddXmlError(`list value of ${kind} in ${instanceId} may contain only text <item> elements`)
    }
    return { kind, value: items.map((item) => item.textContent ?? '') }
  }
  throw new CddXmlError(`property ${kind} in ${instanceId} must contain <string> or <list>`)
}

/** Parses a complete standalone `.cdd` XML document into the editor model. */
export function parseCdd(xml: string): Ontology {
  const document = new DOMParser().parseFromString(xml, 'application/xml')
  const parserError = document.querySelector('parsererror')
  if (parserError) throw new CddXmlError('XML is not well-formed')

  const root = document.documentElement
  if (root.tagName !== 'cdd') throw new CddXmlError('document root must be <cdd>')
  if (root.getAttribute('version') !== CDD_XML_VERSION) {
    throw new CddXmlError(`unsupported version ${root.getAttribute('version') ?? '(missing)'}`)
  }
  const rootIdentity = requiredAttribute(root, 'root', '<cdd>')
  const instancesElement = exactlyOneChild(root, 'instances', '<cdd>')
  const instances: Record<Identity, Instance> = {}

  for (const element of childElements(instancesElement)) {
    if (element.tagName !== 'instance') throw new CddXmlError('<instances> may contain only <instance> elements')
    const identity = requiredAttribute(element, 'identity', '<instance>')
    if (instances[identity]) throw new CddXmlError(`duplicate instance identity ${identity}`)
    instances[identity] = childElements(element).map((property) => parseProperty(property, identity))
  }

  if (!instances[rootIdentity]) throw new CddXmlError(`root instance ${rootIdentity} is absent`)
  return { root: rootIdentity, instances }
}
