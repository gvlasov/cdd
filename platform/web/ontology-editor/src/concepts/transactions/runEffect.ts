import type { Identity } from '@/concepts/identity/Identity'
import type { Instance } from '@/concepts/instances/Instance'
import type { Ontology } from '@/concepts/ontology/Ontology'
import type { Reality } from '@/concepts/reality/Reality'

// The `reality` API handed to a transaction's effect. All mutations are applied
// to a working copy; runEffect returns the new Reality.
export interface RealityApi {
  /** Spawn a new instance of `conceptId`; returns its identity. */
  add(conceptId: Identity, props?: Record<string, unknown>): Identity
  get(id: Identity): Instance | undefined
  all(conceptId: Identity): Instance[]
  update(id: Identity, props: Record<string, unknown>): void
  remove(id: Identity): void
}

let counter = 0
function freshId(conceptId: Identity): Identity {
  counter += 1
  return `${conceptId}#${Date.now().toString(36)}${counter}`
}

function propsToProperties(
  conceptId: Identity,
  props: Record<string, unknown>,
): Instance {
  const instance: Instance = [{ kind: 'concept', value: conceptId }]
  for (const [key, value] of Object.entries(props)) {
    if (value == null) continue
    instance.push({ kind: key as Instance[number]['kind'], value: String(value) })
  }
  return instance
}

/**
 * Run a transaction effect against a copy of `reality`. `effect` is a JS
 * function body with `input`, `reality` (RealityApi) and `ontology` in scope.
 * Returns the resulting Reality and whatever the effect returned.
 */
export function runEffect(
  effect: string,
  input: unknown,
  reality: Reality,
  ontology: Ontology,
): { reality: Reality; result: unknown } {
  const instances: Record<Identity, Instance> = {}
  for (const [id, instance] of Object.entries(reality.instances)) {
    instances[id] = instance.map((p) => ({ ...p }))
  }

  const api: RealityApi = {
    add(conceptId, props = {}) {
      const id = freshId(conceptId)
      instances[id] = [
        { kind: 'identity', value: id },
        ...propsToProperties(conceptId, props),
      ]
      return id
    },
    get: (id) => instances[id],
    all: (conceptId) =>
      Object.values(instances).filter((i) =>
        i.some((p) => p.kind === 'concept' && p.value === conceptId),
      ),
    update(id, props) {
      const instance = instances[id]
      if (!instance) return
      for (const [key, value] of Object.entries(props)) {
        const i = instance.findIndex((p) => p.kind === key)
        const prop = { kind: key as Instance[number]['kind'], value: String(value) }
        if (i === -1) instance.push(prop)
        else instance[i] = prop
      }
    },
    remove(id) {
      delete instances[id]
    },
  }

  // eslint-disable-next-line @typescript-eslint/no-implied-eval
  const fn = new Function('input', 'reality', 'ontology', effect) as (
    input: unknown,
    reality: RealityApi,
    ontology: Ontology,
  ) => unknown
  const result = fn(input, api, ontology)

  return { reality: { instances }, result }
}
