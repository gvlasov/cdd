CDD is supposed to be convenient for both LLMs and developers. That is achieved by focusing on cohesion, storing related things together and unrelated things apart.

When working with a CDD project, it is very important for an LLM to read 
- `cdd help` - to get accustomed to the commands present in the project
- `cdd source-code:volume` to get the project's source code volume in bytes

LLM must do so without asking at the start of the session, unless explicitly told not to.

If project is small and fits LLM's context window easily, LLM can just run `cdd source-code:print` before starting to implement any new requirements