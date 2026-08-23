Something that can start [processes](/concepts/processes/Process.md)

Subject may have the ability to consume the output of a process to drive its decisions

**Heuristic:**

Something is a subject when it is natural to narrate its behavior with an action verb that ascribes it agency — e.g. "systemd killed my service." When the natural narration instead credits whoever configured or wrote it — e.g. a script that merely calls `grep` is not what "filtered the text," its author is — the thing is a mechanism, not a subject. This is why not every process-starter qualifies: see [User](/concepts/users/User.md)'s counterexample of a program calling `grep`.

**Examples:**

- A systemd daemon on a host is a subject
- Any [User](/concepts/users/User.md) is a subject
- A multithreaded scheduler is a subject
- A browser is a subject when talking to backend over REST API
- Backend is a subject when talking to browser