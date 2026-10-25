# Fieldnotes Course Platform & Studio

A modern course management and e-learning platform built with **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS**, and **PostgreSQL**.

## Features

- **Modern Admin Dashboard:**
  - KPI overview metrics (Revenue, Students, Courses, Satisfaction)
  - Interactive Course Management (create, edit, publish/draft)
  - Curriculum Builder with modular sections and lessons
  - Free preview access switches and duration controls
  - Student directory & enrollment tracker
  - Stripe sales ledger & order status
  - Review moderation with one-click live approval
  - Category and taxonomy manager
  - Blog & article publisher
  - Global site settings (branding colors, announcements, navigation menus, Stripe)
- **Database & Migrations for Vercel:**
  - Pure JavaScript PostgreSQL driver (`postgres.js`)
  - Serverless connection pooling with SSL support for Neon, Supabase, and Vercel Postgres
  - Automatic migration runner (`node scripts/run-migrations.mjs`) executing on every Vercel build
  - Starter seeder (`npm run seed`)

## Tech Stack

- **Framework:** Next.js 15 + React 19 + TypeScript
- **Styling:** Tailwind CSS + Lucide Icons + Google Fonts (Inter)
- **Database:** PostgreSQL (Neon / Supabase / Vercel Postgres)
- **Payments:** Stripe Checkout & Webhook verification
- **Deployment:** Vercel

## Local Development

1. Install dependencies:
   ```sh
   npm install
   ```
2. Configure environment variables:
   ```sh
   cp .env.example .env.local
   ```
3. Run database migrations:
   ```sh
   npm run migrate
   ```
4. Seed starter courses and admin accounts:
   ```sh
   npm run seed
   ```
5. Start dev server:
   ```sh
   npm run dev
   ```
6. Open [http://localhost:3000](http://localhost:3000) for the public showcase or [http://localhost:3000/admin](http://localhost:3000/admin) for the visual Admin Dashboard.
