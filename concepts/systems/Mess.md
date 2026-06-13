Mess is a property of a system that reflects how out of order it is. It is the primary enemy of a system developer.

The opposite of mess can be called order or place.

Mess is not chaos. Chaos is change. Mess is things out of their place. Chaos can create mess, or chaos can be contained to produce little mess within a mess container.

Putting a thing in its place removes mess introduced by that thing. It can also indirectly create more total mess by driving things connected to that thing out of their place.

Having mess is sometimes cheaper than creating a proper order not only in the moment, but overall. So mess can be tolerated, but must be constrained and contained:


### Examples of tolerable mess

- Non-trivial bash scripts can be hard to read and especially modify manually, so they are intrinsically messy. It is ok to have a messy bash script as long as its inputs and outputs are well documented and the script itself is properly placed.
- `/sandbox` is the place to experiment, its contents are expected to be messy

### Criteria for mess tolerance
- Mess must not spread
- Nothing should depend on the internals of a mess
- Mess must have a clear boundary with well-defined inputs and outputs
- Mess must be contained within a single file/directory, thus different parts of the same mess must not exist across filesystem