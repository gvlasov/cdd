import type { Ontology } from './Ontology'

// Static fixture used by the demo app. Concepts drawn from CDD's own ontology;
// edges read "from has attribute to".
export const sampleOntology: Ontology = {
  nodes: [
    { id: 'project', name: 'Project', description: 'A reflection of a conceptual system in source code.' },
    { id: 'concept', name: 'Concept', description: 'A cohesion unit: the unifying principle of representations held together by meaning.' },
    { id: 'name', name: 'Name', description: 'A string of symbols that uniquely identifies a concept or a reflection.' },
    { id: 'attribute', name: 'Attribute', description: 'Something that has an immediate relation to an instance.' },
    { id: 'reflection', name: 'Reflection', description: 'A way for a concept to exist. Has a name, a definition and 0+ instances.' },
    { id: 'instance', name: 'Instance', description: 'A particular appearance of a reflection within a state.' },
    { id: 'description', description: 'Markdown or plain text explaining what a concept is.' },
  ],
  edges: [
    { id: 'e1', from: 'project', to: 'concept', relation: 'is composed of' },
    { id: 'e2', from: 'project', to: 'name' },
    { id: 'e3', from: 'concept', to: 'name' },
    { id: 'e4', from: 'concept', to: 'attribute' },
    { id: 'e5', from: 'concept', to: 'reflection' },
    { id: 'e6', from: 'concept', to: 'description' },
    { id: 'e7', from: 'reflection', to: 'name' },
    { id: 'e8', from: 'reflection', to: 'instance' },
  ],
}
