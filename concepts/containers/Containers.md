CDD is containers first!

Using Docker as the container engine (though you could use any), the guildlines are as follows

- Store services configurations in partial `docker-compose.yml` per tool, e.g.:

```
$ cat /platform/postgres/postgres.compose.yml
services:
  postgres:
    image: postgres:16.14
    environment:
      POSTGRES_DB: $DB_DATABASE
      POSTGRES_USER: $DB_USERNAME
      POSTGRES_PASSWORD: $DB_PASSWORD
    ports:
      - "5432:5432"
    volumes:
      - ../postgres/volume:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 1s
      retries: 10
```

- Have a `compose` command that brings all the partial configurations together:

```
$ cat ./commands/compose
#!/usr/env/bin bash
cd $(git rev-parse --show-toplevel)/platform/docker
docker compose \
    -f ../postgres/postgres.compose.yml \
    -f ../php-fpm/php-fpm.compose.yml \
    -f ../cli/cli.compose.yml \
    -f ../vite/vite.compose.yml \
    "$@"
    # Etc
```

- In order to not mix up paths