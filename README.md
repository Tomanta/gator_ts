# gator_ts
boot.dev blog aggregator project - Typescript

## Requirements

Create a `.gatorconfig.json` file in ~home:

```
{
  "db_url": "postgres://postgres:postgres@localhost:5432/gatorts?sslmode=disable",
  "current_user_name": "bob"
}
```

## Requires: Postgres

To start database: `sudo service postgresql start`

## Requires: Drizzle

Drizzle is for the database migrations

https://orm.drizzle.team/docs/overview

```bash
npm i drizzle-orm postgres
npm i -D drizzle-kit
```

## Requires: fast-xml-parser

`npm i fast-xml-parser`