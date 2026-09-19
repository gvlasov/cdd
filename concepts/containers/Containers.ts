// Static browsable reflection of Containers.
export default [
  [
    {
      "kind": "identity",
      "value": "cdd.containers"
    },
    {
      "kind": "concept",
      "value": "cdd.concept"
    },
    {
      "kind": "slug",
      "value": "containers"
    },
    {
      "kind": "name",
      "value": "Containers"
    },
    {
      "kind": "definition",
      "value": "CDD is containers first!"
    },
    {
      "kind": "details",
      "value": "Using Docker as the container engine (though you could use any), the guildlines are as follows\n\n- Store services configurations in partial `docker-compose.yml` per tool, e.g.:\n\n```\n$ cat /platform/postgres/postgres.compose.yml\nservices:\n  postgres:\n    image: postgres:16.14\n    environment:\n      POSTGRES_DB: $DB_DATABASE\n      POSTGRES_USER: $DB_USERNAME\n      POSTGRES_PASSWORD: $DB_PASSWORD\n    ports:\n      - \"5432:5432\"\n    volumes:\n      - ../postgres/volume:/var/lib/postgresql/data\n    healthcheck:\n      test: [\"CMD-SHELL\", \"pg_isready -U postgres\"]\n      interval: 10s\n      timeout: 1s\n      retries: 10\n```\n\n- Have a `compose` command that brings all the partial configurations together:\n\n```\n$ cat ./commands/compose\n#!/usr/env/bin bash\ncd $(git rev-parse --show-toplevel)/platform/docker\ndocker compose \\\n    -f ../postgres/postgres.compose.yml \\\n    -f ../php-fpm/php-fpm.compose.yml \\\n    -f ../cli/cli.compose.yml \\\n    -f ../vite/vite.compose.yml \\\n    \"$@\"\n    # Etc\n```\n\n- In order to not mix up paths"
    }
  ]
]
