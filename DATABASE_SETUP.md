# Production Database & Migration Setup

This platform runs natively on **Next.js 15 (App Router)** and **PostgreSQL** (Neon, Supabase, Vercel Postgres, or standard PostgreSQL).

## Database Architecture

- Database driver: Pure JavaScript `postgres` (postgres.js) with connection pooling and SSL support.
- Schema definition: `src/lib/db/migrations/0001_initial_schema.sql`
- Migration runner: `scripts/run-migrations.mjs`
- Seeder: `scripts/seed.mjs`

### Tables Included
1. `_migrations` - Tracks applied migrations and execution timestamps
2. `users` - Admin, editor, and student accounts with secure password hashes
3. `categories` - Course categories and tracks
4. `courses` - Course metadata, pricing, summaries, level, SEO, and status
5. `sections` - Course modules/chapters
6. `lessons` - Video, text, PDF, and quiz lessons with free-preview toggles
7. `course_resources` - Lesson attachments and downloadable files
8. `enrollments` - Student course registrations
9. `lesson_progress` - Per-lesson completion tracking and notes
10. `reviews` - Student ratings and admin approval workflows
11. `orders` - Stripe checkout transactions
12. `coupons` - Promotional codes and discount values
13. `pages` - Block-based CMS pages
14. `posts` - Blog articles and engineering guides
15. `testimonials` - Student testimonials
16. `media` - Media library uploads
17. `site_settings` - Global branding, navigation, announcement bar, and Stripe settings

## How Migrations Work on Vercel

When deployed to Vercel, the build command in `package.json` executes:

```json
"build": "node scripts/run-migrations.mjs && next build"
```

1. `scripts/run-migrations.mjs` automatically inspects `process.env.DATABASE_URL`.
2. If `DATABASE_URL` is set:
   - It connects to the Postgres database with SSL (`rejectUnauthorized: false` for pooled connections like Supabase/Neon).
   - Creates `_migrations` if not already present.
   - Discovers all `.sql` files in `src/lib/db/migrations/`.
   - Executes pending migrations within an atomic transaction.
   - Logs status and exits cleanly.
3. If `DATABASE_URL` is not set (e.g. preview environment without DB):
   - It gracefully logs a notice and allows the build to continue.

## Local Database Setup

1. Copy `.env.example` to `.env.local`:
   ```sh
   cp .env.example .env.local
   ```
2. Set your `DATABASE_URL` connection string:
   ```env
   DATABASE_URL=postgres://postgres:password@localhost:5432/course_platform
   ```
3. Run the migration script:
   ```sh
   npm run migrate
   ```
4. Seed starter courses and admin accounts:
   ```sh
   npm run seed
   ```
5. Start development:
   ```sh
   npm run dev
   ```
