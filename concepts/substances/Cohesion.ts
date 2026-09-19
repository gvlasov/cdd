// Static browsable reflection of Cohesion.
export default [
  [
    {
      "kind": "identity",
      "value": "cdd.cohesion"
    },
    {
      "kind": "concept",
      "value": "cdd.concept"
    },
    {
      "kind": "slug",
      "value": "cohesion"
    },
    {
      "kind": "name",
      "value": "Cohesion"
    },
    {
      "kind": "definition",
      "value": "Cohesion is a [substance](cdd.substances): the principle — and degree — to which things related by meaning stay together. It is quantified qualitatively (good/poor cohesion, or how tightly a unit's reflections belong together) and is an attribute of a cohesion unit — an expression, function, concept, process, stakeholder, tool, or project."
    },
    {
      "kind": "details",
      "value": "Cohesion is the most important principle of organizing a codebase. Code should be grouped by what it is about, not by incidental technical shape. If two things participate in the same meaning, they should be close to each other. If two things express different meanings, they should be separated even if a framework, file type, or habit suggests putting them together.\n\nLevels\n\nCohesion applies at every level of code organization:\n\n- Expressions should belong to the same immediate idea.\n- Statements should form one meaningful step.\n- Functions should do one coherent action or calculation.\n- Files, classes, and modules should reflect one concept or one tightly bound representation of a concept.\n- Directories should group files by concept, stakeholder, process, tool, or platform concern.\n- A project should contain a coherent conceptual system.\n\nThe same rule repeats at every scale: related by meaning means kept together; unrelated by meaning means split apart.\n\nHierarchy\n\nA codebase is a hierarchy of cohesion units.\n\nCode-level cohesion units:\n\n- A statement is a cohesion unit of expressions that belong together.\n- A function is a cohesion unit of statements that belong together.\n- A properly designed class or module is a cohesion unit of functions, state, and definitions that belong together.\n\nConcept-level cohesion units:\n\n- A concept is a cohesion unit of representations that belong together by meaning.\n- A concept directory groups the concept's reflections: code, tests, views, commands, documentation, assets, and other representations of that concept.\n\nSub-concept-level cohesion units:\n\n- A [transaction](cdd.transaction) is a cohesion unit below the concept: it gathers everything that implements one state change to a concept's real volume — input constraints, transport, persistence, caching — into one place, spanning whichever application layers the change's path passes through.\n\nProcess-level cohesion units:\n\n- An individual [process](cdd.process) is a cohesion unit of representations that describe or implement that process.\n- Process documentation, process commands, process diagrams, and process scripts belong together when they are about the same process.\n\nStakeholder-level cohesion units:\n\n- A [stakeholder](cdd.stakeholder) is a cohesion unit for representations of a person or group concerned with the project.\n- Stakeholder documentation, goals, constraints, expectations, and research belong together when they are about the same stakeholder.\n\nPlatform-level cohesion units:\n\n- A [tool](cdd.tool) is a cohesion unit for its configuration, wrappers, support files, and sometimes its generated outputs.\n- Composer can have its configuration and `vendor` output grouped as a Composer/tool concern.\n- NPM can have its configuration and `node_modules` output grouped as an NPM/tool concern.\n- A [lifecycle phase](cdd.lifecyclePhase) is also a platform-level cohesion unit: testing, linting, CLI, compilation, deployment, and similar concerns group the tool setup needed to run the project.\n\nProject-level cohesion unit:\n\n- A [project](cdd.project) is a cohesion unit composed of concepts, stakeholders, processes, and platform.\n\nThe hierarchy is not only about nesting files. It is about preserving meaning at every scale, from an expression inside a statement to the structure of the whole project.\n\nMeaning over shape\n\nTechnical similarity is not enough for cohesion.\n\nFiles are not cohesive because they are all controllers, models, tests, jobs, migrations, views, or components. They are cohesive when they describe the same part of reality or the same tool concern.\n\nExamples:\n\n- An order model, order view, order test, order import command, and order settlement job are cohesive because they are about orders.\n- A Docker compose file, Docker helper script, and Docker documentation are cohesive because they are about Docker as a platform tool.\n- All tests in one `/tests` directory are *not* cohesive by meaning; they are only similar by technical role.\n\nRelation to concepts\n\nA [concept](cdd.concept) is a unit of cohesion in a project.\n\nA concept directory exists because its reflections belong together by meaning. A concept can contain classes, views, tests, commands, documentation, assets, fixtures, and any other reflections that are about that concept.\n\nRepresentations of a concept inside one concept directory are highly cohesive. They can be passed to an LLM by referencing the whole directory, and the LLM can understand the concept in its entirety because the directory contains the concept's related reflections instead of scattered technical fragments.\n\nThis is why [concept-driven directory structure](cdd.conceptDrivenDirectoryStructure) matters: it makes cohesion visible in the filesystem.\n\nSigns of good cohesion\n\n- A change to one idea usually happens in one place.\n- A developer can find related code by thinking about the domain concept.\n- File placement can be explained by meaning.\n- Names inside a unit share the same subject.\n- Dependencies flow between distinct meanings rather than mixing them together.\n\nSigns of poor cohesion\n\n- A single change requires editing many technical-role directories.\n- A file contains expressions that are about several unrelated concepts.\n- A function mixes multiple reasons to change.\n- A directory groups things only because they use the same framework mechanism.\n- A developer has to know the framework's storage conventions before they can find conceptually related code.\n\nPoor cohesion creates [mess](cdd.mess): things are out of place, and the developer has to spend attention reassembling meaning from scattered fragments."
    },
    {
      "kind": "examples",
      "value": [
        "cdd.cohesion:examples:1",
        "cdd.cohesion:examples:2",
        "cdd.cohesion:examples:3"
      ]
    }
  ],
  [
    {
      "kind": "identity",
      "value": "cdd.cohesion:examples:1"
    },
    {
      "kind": "concept",
      "value": "cdd.example"
    },
    {
      "kind": "description",
      "value": "An order model, order view, order test, order import command, and order settlement job are cohesive because they are about orders."
    }
  ],
  [
    {
      "kind": "identity",
      "value": "cdd.cohesion:examples:2"
    },
    {
      "kind": "concept",
      "value": "cdd.example"
    },
    {
      "kind": "description",
      "value": "A Docker compose file, Docker helper script, and Docker documentation are cohesive because they are about Docker as a platform tool."
    }
  ],
  [
    {
      "kind": "identity",
      "value": "cdd.cohesion:examples:3"
    },
    {
      "kind": "concept",
      "value": "cdd.example"
    },
    {
      "kind": "description",
      "value": "All tests in one `/tests` directory are *not* cohesive by meaning; they are only similar by technical role."
    }
  ]
]
