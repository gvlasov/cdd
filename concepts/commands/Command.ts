// Static browsable reflection of Command.
export default [
  [
    {
      "kind": "identity",
      "value": "cdd.command"
    },
    {
      "kind": "concept",
      "value": "cdd.concept"
    },
    {
      "kind": "slug",
      "value": "command"
    },
    {
      "kind": "name",
      "value": "Command"
    },
    {
      "kind": "definition",
      "value": "A command is an action a [subject](cdd.subject) can ask a system to perform. The asking subject need not be a person — a [user](cdd.user) is the common case, but a cron job or another process asking a system to do something is a subject too."
    },
    {
      "kind": "details",
      "value": "Commands are how a subject turns intent into effects. A command can change [state](cdd.state), produce feedback, start a [process](cdd.process), or combine these outcomes. The important thing is that the subject is not just asking for information; the subject is asking the system to do something.\n\nExamples:\n\n- `rm file.txt` removes a file.\n- `build` creates a project artifact.\n- `up` starts a local development environment.\n- A \"Delete user\" button removes a user.\n- A \"Send invoice\" button starts an invoicing process.\n- `artisan users:delete -v` changes user state and returns verbose execution feedback.\n\nCommand and query\n\nA command is different from a query.\n\nA query asks for information without intending to change state:\n\n- `ls`\n- \"Show user profile\"\n- \"List failed jobs\"\n\nA command asks the system to perform an action:\n\n- `rm`\n- \"Delete user\"\n- \"Retry failed jobs\"\n\nThis distinction follows Command-Query Separation and Command-Query Responsibility Segregation. In practice, a command may still return feedback, but feedback is not the primary purpose. The primary purpose is the requested action.\n\nA command that changes a concept's [real volume](cdd.realVolume) is a [transaction](cdd.transaction). Every transaction is a command; not every command is a transaction — some only start a [process](cdd.process) or produce feedback.\n\nNaming\n\nWhen naming a command module, prefer a verb phrase that says what action is requested.\n\nExamples:\n\n- `ImportOrder` instead of `OrderImport`\n- `DeleteUser` instead of `UserDeletion`\n- `RetryFailedJobs` instead of `FailedJobRetry`\n\nThis applies to command classes in frameworks such as Laravel as well as to other modules that implement commands. A command name should read like an imperative action, not like a process noun.\n\nNamespacing\n\nCommands often need namespacing because the same action can exist for multiple concepts, tools, or lifecycle phases.\n\nFor example, a project may need import commands for orders, users, and products. A framework such as Laravel Artisan needs a predefined way to name those commands so they are easy to discover and do not collide.\n\nA good namespace prefix is the thing the command belongs to:\n\n- Concept name: `orders:import`, `users:import`, `products:import`\n- Tool name: `composer:install`, `npm:build`, `docker:up`\n- [Lifecycle phase](cdd.lifecyclePhase) name: `test:unit`, `test:e2e`, `build:frontend`, `deploy:production`\n\nThe command module can still be named as a verb phrase, such as `ImportOrder`, while the shell command name can use a namespaced form such as `orders:import`.\n\nReflections\n\nCommands can be reflected in many forms:\n\n- Shell commands\n- Buttons\n- Menu actions\n- HTTP endpoints\n- Queue jobs\n- Scheduled tasks\n\nIf a command reflects a domain concept, its implementation belongs to that concept. If it exists to operate the project or its environment, it belongs with project commands such as [CLI commands](cdd.cliCommand)."
    },
    {
      "kind": "examples",
      "value": [
        "cdd.command:examples:1",
        "cdd.command:examples:2",
        "cdd.command:examples:3",
        "cdd.command:examples:4",
        "cdd.command:examples:5",
        "cdd.command:examples:6"
      ]
    }
  ],
  [
    {
      "kind": "identity",
      "value": "cdd.command:examples:1"
    },
    {
      "kind": "concept",
      "value": "cdd.example"
    },
    {
      "kind": "description",
      "value": "`rm file.txt` removes a file."
    }
  ],
  [
    {
      "kind": "identity",
      "value": "cdd.command:examples:2"
    },
    {
      "kind": "concept",
      "value": "cdd.example"
    },
    {
      "kind": "description",
      "value": "`build` creates a project artifact."
    }
  ],
  [
    {
      "kind": "identity",
      "value": "cdd.command:examples:3"
    },
    {
      "kind": "concept",
      "value": "cdd.example"
    },
    {
      "kind": "description",
      "value": "`up` starts a local development environment."
    }
  ],
  [
    {
      "kind": "identity",
      "value": "cdd.command:examples:4"
    },
    {
      "kind": "concept",
      "value": "cdd.example"
    },
    {
      "kind": "description",
      "value": "A \"Delete user\" button removes a user."
    }
  ],
  [
    {
      "kind": "identity",
      "value": "cdd.command:examples:5"
    },
    {
      "kind": "concept",
      "value": "cdd.example"
    },
    {
      "kind": "description",
      "value": "A \"Send invoice\" button starts an invoicing process."
    }
  ],
  [
    {
      "kind": "identity",
      "value": "cdd.command:examples:6"
    },
    {
      "kind": "concept",
      "value": "cdd.example"
    },
    {
      "kind": "description",
      "value": "`artisan users:delete -v` changes user state and returns verbose execution feedback."
    }
  ]
]
