#!/usr/bin/env bash
set -euo pipefail

cd "$(git rev-parse --show-toplevel)"

cat <<'EOF'
---
name: concept_driven_design
description: Apply CDD methodology when generating or organizing code. Use when creating files, structuring projects, deciding where code belongs, or reasoning about concepts, stakeholders, reflections, subjects, processes, attributes, and platform boundaries.
---

<!-- references/concepts.md -->
# CDD

CDD stands for {concept,cohesion,cli,convenience}-driven design

Use this skill when a task benefits from organizing code by concepts rather than by technical layers.

## Workflow

1. Identify the concept, stakeholder, or process the requested change is about.
2. Place each file with the concept, stakeholder, or process whose meaning it represents. Runtime mechanism is secondary.
3. Treat classes, controllers, views, commands, tables, jobs, docs, and images as reflections of concepts.
4. Keep platform and tool concerns separate from domain concepts when they do not express a domain meaning.
5. Prefer existing concept directories and naming patterns before adding new structure.

EOF

echo
echo
./concepts/agent-skills/build-concepts-reference
