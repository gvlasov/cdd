// Static browsable reflection of AgentSkill.
export default [
  [
    {
      "kind": "identity",
      "value": "cdd.agentSkill"
    },
    {
      "kind": "concept",
      "value": "cdd.concept"
    },
    {
      "kind": "slug",
      "value": "agentSkill"
    },
    {
      "kind": "name",
      "value": "AgentSkill"
    },
    {
      "kind": "definition",
      "value": "You are generating code for a CDD project. Follow these rules precisely."
    },
    {
      "kind": "details",
      "value": "The unit of analysis is the expression, not the file\n\nBefore writing any expression — a class, method, property, function, constant, or configuration value — identify which concept it reflects. A traditional class that touches multiple concepts must be split, even if frameworks or conventions would keep it together. There is no obligation to preserve units that mix concepts.\n\nFile placement follows from concept membership\n\nOnce you know what concept an expression belongs to, its file lives in `/concepts/{concept-name}/`. If it reflects a specific stakeholder, it lives in `/stakeholders/{stakeholder-name}/`. If it describes how multiple concept instances evolve together in time, it lives in `/processes/{process-name}/`. If it reflects no domain concept and instead configures a framework, runtime, or tool, it lives in `/platform/`. If it is a developer or operator script, it lives in `/commands/`.\n\nDon't organize files by technical role in `/concepts/`. There is no `/concepts/models/`, `/concepts/jobs/`, `/concepts/views/`, `/concepts/tests/`, `/concepts/services/`, `/concepts/helpers/`, `/concepts/utils/`, unless we're building a tool that works with these things. A test for `Order` lives in `/concepts/orders/`. A queue job that processes orders lives in `/concepts/orders/`. A search indexer for orders lives in `/concepts/orders/`.\n\nNaming\n\nName files and classes after what they reflect, not how they run. The runtime mechanism is not part of the name.\n\n- `OrderSearch.php` not `ElasticsearchOrderIndexer.php`\n- `OrderSettlement.php` not `SettleOrdersJob.php`\n\nCollections\n\nEvery concept with persistent instances gets a Collection class named as the plural of the concept — `Orders`, `Trees`, `Users`. This is the primary interface for querying and mutating that concept's data. Inject it via constructor injection. Never instantiate it inside a method.\n\nDependencies\n\nAll stateful dependencies come via constructor injection. Never instantiate repositories, collections, or framework services inside a method body.\n\nWhen concept membership is ambiguous\n\nIf an expression could plausibly belong to more than one concept, or no existing concept cleanly covers it, stop and ask the user before proceeding. Present:\n\n- What the expression does\n- Which concepts it might belong to and why\n- Your tentative recommendation\n\nWait for a decision. Do not resolve concept boundary ambiguity silently.\n\nOnly escalate genuine ambiguity. If the concept is clear after consulting `/concepts/README.md`, proceed without asking.\n\nIf a user request would require violating the methodology — for example, placing concept-specific code in a framework-dictated location — do not silently comply. Instead, stop and surface the contradiction: describe what the framework expects, what the methodology requires, and why they conflict. The methodology takes precedence, but the conflict itself may indicate the methodology needs refinement. Present it to the user for resolution before proceeding."
    }
  ]
]
