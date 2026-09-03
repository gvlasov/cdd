import type { Property } from '@/concepts/properties/Property'

// An instance is anything the ontology holds: a collection of properties
// addressed by a unique identity. A concept is an instance that also has an
// `attributes` property declaring what properties its own instances may have.
export type Instance = Property[]
