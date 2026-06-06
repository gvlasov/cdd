# Concept-Driven Design

**A code organization methodology that puts developer experience at the heart of any software project.**

---

Most codebases are arcane spellbooks — files scattered by the tools that consume them, not by the ideas they express. CDD turns a project into an **ordered encyclopedia**: every file has a principled place, every concept has a home.

## Core idea

CDD organises source code around the **concepts of your problem domain**, not around frameworks or tools.

```
/concepts/orders/          ← everything about orders lives here
  Order.php
  Order.vue
  OrderRepository.php
  SettleOrders.php          ← even the job that settles them
  README.md

/platform/                 ← framework wiring, docker, build tools
/stakeholders/             ← people and groups concerned with the project
/processes/                ← ordered changes and workflows over time
/commands/                 ← scripts for dev, CI/CD, production
```

Three axioms underpin this:

1. Software exists to reflect some reality to a user.
2. Any reality consists of **concepts**.
3. Every software system consists of concept **reflections**, **stakeholders**, **processes**, a software **platform**, and a command **shell**.

## What you get

| Problem | CDD answer |
|---|---|
| Shotgun surgery across `/src`, `/tests`, `/resources` | One concept directory — all its reflections together |
| "Where does this file go?" | If it reflects a concept, it goes in that concept's directory |
| Onboarding friction | Directory structure reads like a glossary of the domain |
| LLM-assisted development drift | Specifications and code share the same vocabulary; outputs are more deterministic |

## Who it's for

- Developers who don't believe pragmatism requires messiness
- Solo developers or small teams who want a strong, flexible base
- Anyone with a compulsion to keep things in their place

## Honest trade-offs

- **No turnkey setup.** You'll need to adapt CDD to your stack yourself.
- **Legacy migration is expensive.** Retrofitting an existing codebase is rarely worth the time.

## Concepts in this repository

Browse `/concepts` to explore the full vocabulary of the methodology — each concept has its own directory with a definition and examples.

---

*Inspired by Wikipedia's flat cross-linked organisation, Bob Martin's screaming architecture, and feature-sliced design.*
