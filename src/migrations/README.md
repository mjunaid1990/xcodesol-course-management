# Payload database migrations

Generated Payload migration files belong in this directory. Create the initial schema migration with `npm run migrate:create` after setting `DATABASE_URL` to the intended Postgres database. Review and commit the generated timestamped migration and migration index; Vercel applies committed migrations during the build.

This README is only a placeholder to keep the directory in Git. It does not create database tables or count as a migration.
