Platform is the infrastructure that is required to run the project

All code for it is stored in `./platform/` directory in CDD

It includes
- Infrastructure-as-code
- Tools configs
- Dependency management
- Language
- Framework and its infrastructure configs

So imagine the levels of an application:

- Electrons in physical processor
- CPU
- Kernel
- Virtualization/containerization
- Operating system
- Language
- Framework
- Toolkits, libraries

When a tool has configurable output directories, they must be configured to be in `platform/$tool`, e.g. playwright output dir

All this is infrastructure - the material to simulate some [reality](/concepts/reality/Reality.md).

And higher levels are simulating the reality:
- Concepts
- Their sets
- Read and write operations
- Their representations for user and intermediate systems
- Explanation of their purpose

So if some framework configuration concerns some particular concept - for example, if all people photos must be stored in file system, and all vehicle photos must be stored in S3, then those particular config parts must be stored in `./concepts` and linked into the configs as `./platform` somehow, e.g. with PHP's `require/include`.