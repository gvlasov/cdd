# Concept-Driven Design

CDD is a way to organize software so developers can find the right code by meaning, not by framework trivia.

```bash
git clone https://github.com/gvlasov/cdd.git
cd cdd
./install

cdd help
cdd print
```

`./install` installs CDD support for the tools available on this machine.

`cdd help` shows the project command language.
`cdd print` prints the indexed source tree so you can read the whole project as context.

## Why it exists

Most codebases scatter one feature across technical directories:

- model in one place
- tests in another
- UI in another
- docs somewhere else
- runtime wiring split again

That makes ordinary work expensive:

- one change turns into directory hopping
- onboarding requires learning framework storage rules
- it is hard to answer "where does this file go?"
- LLMs have to reconstruct context from fragments

CDD reduces that friction by grouping files by the thing they mean.

## What CDD gives you

Open the concept, stakeholder, or process that matters and the whole picture is nearby:

```text
/concepts/orders/
  Order.php
  Order.vue
  OrderRepository.php
  SettleOrders.php
  README.md

/stakeholders/
/processes/
/platform/
/commands/
```

This makes a project easier to:

- navigate
- explain
- extend
- hand to another developer
- feed to an LLM as context

## The basic model

- `concepts` holds the problem-domain concepts and their reflections.
- `stakeholders` holds people and groups who care about the project.
- `processes` holds workflows and ordered changes over time.
- `platform` holds tools, runtime support, and integration code.
- `commands` holds project actions developers are meant to run.

The filesystem stops being a tool dump and starts reading like an ontology of the project.

## Good fits

CDD is useful when you want:

- a stable place for every feature-related file
- a command vocabulary that matches what developers actually do
- better context for LLM-assisted development
- less cleanup after a feature crosses frontend, backend, docs, and automation

## Honest trade-offs

- It is not a framework with a turnkey app scaffold.
- It works best when you are willing to structure the project around meaning.
- Retrofitting an already messy repository can take real effort.

## Browse the concepts

The repository is its own vocabulary. Browse `/concepts` to see the method explained through its own terms.

## Inspiration

CDD borrows from Wikipedia-style cross-linking, screaming architecture, and feature-sliced thinking, but pushes the boundary further toward meaning-first file placement.
