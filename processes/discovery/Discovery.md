How the system implementor learns about the existince of some part of the system

Discoverability is a property of a good [[Reflection|reflection]].

**Examples:**

- To know that the system processes orders and not just stores it, you would have to locate the ProcessOrders command. It helps if it is stored close to the Order entity and not in some `/app/jobs/` directory alongside other commands.
- To discover the list of assets for a game entity, you'd rather store the assets in the entity concept and not in some `/src/resources/assets/` directory.

**Discovery channels:**

- By concept. You think what concept the functionality applies to and check its directory.
- Search by file name. This is very prominent in Jetbrains IDEs or something with. Good reflections must be discoverable by file name. That's why a concept name must be a part of the reflection name.
- By content. Last resort.