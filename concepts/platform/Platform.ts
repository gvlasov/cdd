// Static browsable reflection of Platform.
export default [
  [
    {
      "kind": "identity",
      "value": "cdd.platform"
    },
    {
      "kind": "concept",
      "value": "cdd.concept"
    },
    {
      "kind": "slug",
      "value": "platform"
    },
    {
      "kind": "name",
      "value": "Platform"
    },
    {
      "kind": "definition",
      "value": "Platform is the infrastructure that is required to run the project"
    },
    {
      "kind": "details",
      "value": "All code for it is stored in `./platform/` directory in CDD\n\nIt includes\n- Infrastructure-as-code\n- Tools configs\n- Dependency management\n- Language\n- Framework and its infrastructure configs\n\nSo imagine the levels of an application:\n\n- Electrons in physical processor\n- CPU\n- Kernel\n- Virtualization/containerization\n- Operating system\n- Language\n- Framework\n- Toolkits, libraries\n\nWhen a tool has configurable output directories, they must be configured to be in `platform/$tool`, e.g. playwright output dir\n\nAll this is infrastructure - the material to simulate some [reality](cdd.reality).\n\nAnd higher levels are simulating the reality:\n- Concepts\n- Their sets\n- Read and write operations\n- Their representations for user and intermediate systems\n- Explanation of their purpose\n\nSo if some framework configuration concerns some particular concept - for example, if all people photos must be stored in file system, and all vehicle photos must be stored in S3, then those particular config parts must be stored in `./concepts` and linked into the configs as `./platform` somehow, e.g. with PHP's `require/include`."
    }
  ]
]
