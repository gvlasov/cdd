Project directory structure that is dictated by the tools rather than by the conceptual structure. An opposite of [[Concept-driven directory structure]].

Tools want files grouped *by the tool* that uses them: 
- tests ran with PHPUnit in /tests, 
- source code compiled with esbuild in /src/resources/typescript. 


Tool-driven directory structure has its advantages over CDDS:

- Supported out of the box by every major tool
- Developers are generally are more familiar with it

Tool-driven directory structure is considered bad by concept-driven methodology because:

- It promotes splitting conceptually cohesive module groups by tool in favor of tool setup simplicity
- It doesn't provide you a standardized way to store platform configuration
- 