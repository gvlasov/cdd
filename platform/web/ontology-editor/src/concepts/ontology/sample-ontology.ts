import type { Ontology } from './Ontology'

// Static fixture used by the demo app and as a viewer smoke test.
export const sampleOntology: Ontology = {
  nodes: [
    { id: 'concept', name: 'Concept', kind: 'concept', description: 'A cohesion unit: the unifying principle of representations held together by meaning.' },
    { id: 'reflection', name: 'Reflection', kind: 'concept', description: 'A way for a concept to exist. Has a name, a definition and 0+ instances.' },
    { id: 'stakeholder', name: 'Stakeholder', kind: 'stakeholder', description: 'A person or group concerned about a project.' },
    { id: 'process', name: 'Process', kind: 'process', description: 'An ordered change in state that propagates forward in time until termination.' },
    { id: 'transaction', name: 'Transaction', kind: 'concept', description: 'The path data traces through a write operation, scoped so the whole path appears atomic.' },
  ],
  edges: [
    { id: 'e1', from: 'reflection', to: 'concept', relation: 'reflects' },
    { id: 'e2', from: 'stakeholder', to: 'reflection', relation: 'views concept through' },
    { id: 'e3', from: 'transaction', to: 'concept', relation: 'changes real volume of' },
    { id: 'e4', from: 'process', to: 'concept', relation: 'relates instances of' },
  ],
}
