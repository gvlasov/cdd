import type { Identity } from '@/concepts/identity/Identity'
import type { Instance } from '@/concepts/instances/Instance'
import type { Ontology } from '@/concepts/ontology/Ontology'
import { conceptOf } from '@/concepts/ontology/Ontology'
import { firstOfKind, propertiesOfKind } from '@/concepts/properties/Property'
import { instanceName } from '@/concepts/instances/Instance'

// A CDD transaction on a concept: how the concept's real volume changes. Every
// concept has at least a constructor transaction (`create`) — an OOP-style
// constructor that spawns a new instance into the reality.
//
// A transaction is itself an instance in the ontology, keyed by
// `<conceptId>:<name>` (e.g. `cdd.reflection:create`). It carries:
//  - `name`   the transaction name (the part after `:`)
//  - `effect` JavaScript source, run as new Function('input','reality','ontology', effect)
//  - `params` names of the inputs the effect expects (rendered as a form)
//
// A concept references its transactions through a `transactions` property.

export type TransactionId = Identity

export function transactionId(conceptId: Identity, name: string): TransactionId {
  return `${conceptId}:${name}`
}

export function conceptOfTransaction(id: TransactionId): Identity {
  const i = id.lastIndexOf(':')
  return i === -1 ? id : id.slice(0, i)
}

export function transactionName(id: TransactionId, instance?: Instance): string {
  if (instance) {
    const named = instanceName(instance)
    if (named) return named
  }
  const i = id.lastIndexOf(':')
  return i === -1 ? id : id.slice(i + 1)
}

/** The transaction identities a concept exposes. */
export function conceptTransactions(concept: Instance): TransactionId[] {
  return propertiesOfKind(concept, 'transactions')
    .map((p) => (Array.isArray(p.value) ? p.value : [p.value]))
    .flat()
}

export function transactionEffect(transaction: Instance): string {
  const p = firstOfKind(transaction, 'effect')
  if (!p) return ''
  return Array.isArray(p.value) ? p.value.join('\n') : p.value
}

export function transactionParams(transaction: Instance): string[] {
  const p = firstOfKind(transaction, 'params')
  if (!p) return []
  return Array.isArray(p.value) ? p.value : [p.value]
}

export function transactionOf(
  ontology: Ontology,
  id: TransactionId,
): Instance | undefined {
  return conceptOf(ontology, id)
}
