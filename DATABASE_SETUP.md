# Production database setup

Payload's Postgres adapter receives `DATABASE_URL` from the environment. In development, Payload can push the configured schema automatically. Production does not do that: a database connection string alone does not create the tables. The initial schema and later schema changes must be represented by Payload migrations.

## Bootstrap the initial schema

1. In Supabase, open **Connect** and copy a database connection string. Use a direct connection when the machine can reach Supabase over IPv6; otherwise use the **Session pooler** connection. Avoid the transaction pooler for migration work. Keep the password private.
2. Set `DATABASE_URL` locally to the target database connection string. Do not put it in a committed file.
3. Generate the initial migration from this project configuration:

   ```sh
   npm run migrate:create
   ```

   Give it a name such as `initial_schema` when prompted. Review the generated SQL in `src/migrations`.
4. Commit the generated migration files and push them to GitHub. Vercel's normal `npm run build` now checks that a migration exists, runs `payload migrate`, and only then builds Next.js. The deployment fails if migration application fails.
5. Confirm the deployment succeeds and check the migration status if needed:

   ```sh
   npm run migrate:status
   ```

For later collection or field changes, generate and review a new migration, commit it, and deploy. Vercel applies pending migrations during that build.

Payload's [Postgres migration guide](https://payloadcms.com/docs/database/migrations) describes this workflow. Supabase recommends a direct connection for migrations, with session mode as an IPv4-compatible alternative ([connection options](https://supabase.com/docs/guides/database/connecting-to-postgres)).

## Seed starter content

Run the seed command only after the schema migration has been applied:

```sh
npm run seed
```

The seeder requires `SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD`, `SEED_EDITOR_EMAIL`, and `SEED_EDITOR_PASSWORD`. Use unique email addresses and passwords of at least 12 characters. It is safe to run again: existing seeded records are kept, and only missing starter records are created.

The seed creates administrator and editor accounts, course categories, an instructor, two published starter courses with lesson text, a journal post, site navigation, and a CMS homepage. It does not create default passwords or replace existing page and settings content.

## Vercel environment

Set `DATABASE_URL` and `PAYLOAD_SECRET` for the Vercel Production environment. The build migration step uses `DATABASE_URL`, so it must point to the intended Postgres database and its database user must be allowed to create and alter tables. Run the seed command once against the same database if you want the sample content and staff accounts. Do not add database passwords or seed passwords to Git.
