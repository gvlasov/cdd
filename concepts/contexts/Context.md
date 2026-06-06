Context is all information about something available at a given time

CDD project is designed to be a single big context that structures the whole project in a predictable manner which is easy for both developers and LLMs to digest.

### Examples of context pieces:
- Problem statements
- Representations of concepts
- Platform tools configurations
- Requirements documentation

Both developers and LLMs need context to build a project. 

CDD solves a problem of rapid context building. During development, developer gets new pieces of context. It is important to have as much unique context available as possible to solve problems  efficiently. Thus any new piece of context must be quickly documented - put in its place. CDD makes that easy.

CDD gives you a quick answer for any new piece of context - "where do I put it?" with a simple algorithm

- you definitely put it into the project directory
- determine which subdirectory
- is it a reflection of any single specific concept? then it is `/concepts` directory
  - does it reflect an existing concept? if not, create a new directory for it
- otherwise, is it a reflection of any specific stakeholder?  then it goes  to `/stakeholders` directory
- is it related to how multiple concept instances evolve together in time? then it goes to `/processes` directory
- is it related to the tools or runtime environment that run the project? then it goes to `/platform` directory
- if you don't know where it should go, then it goes to `/sandbox` directory until you decide where it belongs
