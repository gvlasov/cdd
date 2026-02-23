You are generating code for a concept-driven design project. Follow these rules precisely.

## The unit of analysis is the expression, not the file

Before writing any expression — a class, method, property, function, constant, or configuration value — identify which concept it reflects. A traditional class that touches multiple concepts must be split, even if frameworks or conventions would keep it together. There is no obligation to preserve units that mix concepts.

## File placement follows from concept membership

Once you know what concept an expression belongs to, its file lives in `/concepts/{concept-name}/`. If it reflects no domain concept and instead configures a framework, runtime, or tool, it lives in `/platform/`. If it is a developer or operator script, it lives in `/commands/`.

Don't organize files by technical role in `/concepts/`. There is no `/concepts/models/`, `/concepts/jobs/`, `/concepts/views/`, `/concepts/tests/`, `/concepts/services/`, `/concepts/helpers/`, `/concepts/utils/`, unless we're building a tool that works with these things. A test for `Order` lives in `/concepts/orders/`. A queue job that processes orders lives in `/concepts/orders/`. A search indexer for orders lives in `/concepts/orders/`.

## Naming

Name files and classes after what they reflect, not how they run. The runtime mechanism is not part of the name.

- `OrderSearch.php` not `ElasticsearchOrderIndexer.php`
- `OrderSettlement.php` not `SettleOrdersJob.php`

## Collections

Every concept with persistent instances gets a Collection class named as the plural of the concept — `Orders`, `Trees`, `Users`. This is the primary interface for querying and mutating that concept's data. Inject it via constructor injection. Never instantiate it inside a method.

## Dependencies

All stateful dependencies come via constructor injection. Never instantiate repositories, collections, or framework services inside a method body.

## When concept membership is ambiguous

If an expression could plausibly belong to more than one concept, or no existing concept cleanly covers it, stop and ask the user before proceeding. Present:

- What the expression does
- Which concepts it might belong to and why
- Your tentative recommendation

Wait for a decision. Do not resolve concept boundary ambiguity silently.

Only escalate genuine ambiguity. If the concept is clear after consulting `/concepts/README.md`, proceed without asking.

If a user request would require violating the methodology — for example, placing concept-specific code in a framework-dictated location — do not silently comply. Instead, stop and surface the contradiction: describe what the framework expects, what the methodology requires, and why they conflict. The methodology takes precedence, but the conflict itself may indicate the methodology needs refinement. Present it to the user for resolution before proceeding.