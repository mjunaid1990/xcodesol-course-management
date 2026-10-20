# Project: Course Platform with Built-in CMS (Next.js + PostgreSQL, deployed on Vercel)

## 1. Goal
Build a teaching website and learning platform with a full CMS, so I (the instructor) can create and edit everything myself: course content, marketing pages, blog posts, media, navigation, and SEO. All of this happens from a visual admin panel with no code changes or redeploys. Students browse, enroll, and learn through a clean, responsive front end.

## 2. Tech Stack (required)
- **Framework:** Next.js 15 (App Router) + TypeScript, single repo
- **CMS:** Payload CMS 3, installed inside the Next.js app and served at `/admin`. If you recommend a different option, justify it.
- **Database:** PostgreSQL (Neon or Vercel Postgres) via Payload's Postgres adapter, with migrations committed to the repo
- **Media storage:** Vercel Blob (via Payload's storage adapter); video via Mux, Bunny, or Cloudflare Stream
- **Styling/UI:** Tailwind CSS + shadcn/ui + Lucide icons; Framer Motion for subtle motion
- **Auth:** Payload auth for users, with roles: `admin`, `editor`, `student`. Optional Google login.
- **Payments:** Stripe Checkout + webhooks, behind a small provider abstraction (manual enrollment also supported)
- **Email:** Resend (welcome, enrollment, password reset)
- **Forms/Validation:** Zod + React Hook Form
- **Hosting:** Vercel (serverless-safe, pooled DB connections, no local file writes)

## 3. CMS Requirements

### Content types (collections)
- **Courses:** title, slug, summary, rich-text description, thumbnail, promo video, category, level, language, price/currency, status (draft/scheduled/published), SEO fields, "what you'll learn" list, requirements, FAQs
- **Sections and Lessons:** ordered and drag-and-drop reorderable; lesson types: video, text (rich text), PDF/resource, quiz (stretch); free-preview toggle; duration; attached downloads
- **Categories and Tags**
- **Pages:** block-based page builder for Home, About, Contact, landing pages, and legal pages
- **Blog/Articles:** rich text, cover image, author, categories, reading time, SEO
- **Testimonials, FAQs, Instructors**
- **Media library:** upload, crop, alt-text field (required), automatic responsive sizes, folders/tags
- **Users, Enrollments, Orders, Reviews, Coupons** (students are managed in the CMS too)

### Page builder blocks (reusable, editor-selectable)
Hero, Course Grid (manual or auto-filtered), Featured Course, Rich Text, Image + Text, Testimonials, FAQ accordion, Pricing/CTA banner, Instructor Bio, Stats/Logos, Newsletter Signup, Video Embed, Contact Form. Every block must have live preview in the editor.

### Globals (site-wide settings)
Site name/logo/favicon, header and footer navigation (editable menus), social links, default SEO and Open Graph image, announcement bar, brand colors and theme tokens (primary color, radius), analytics IDs, payment and currency settings.

### Editor experience
- **Live preview** and draft preview links before publishing
- **Versions/autosave** with restore, plus scheduled publishing
- **Role-based permissions:** admin (everything), editor (content only, no payments/users), student (no CMS access)
- **Rich text editor** (Lexical) with headings, images, code blocks, callouts, embeds, tables
- **Auto-generated SEO:** meta title/description, OG images, sitemap.xml, robots.txt, JSON-LD (Course schema), with manual override per page
- **On-demand revalidation:** publishing in the CMS refreshes the live page immediately (ISR + `revalidateTag`), with no rebuild needed
- **Bulk actions:** duplicate a course, bulk publish/unpublish, import/export CSV for students and courses
- **Audit trail:** who changed what and when

## 4. Public Site Features
- **Home and marketing pages:** composed entirely from CMS blocks
- **Course catalog:** cards, search, filters (category, level, price), sorting
- **Course detail page:** overview, curriculum accordion with free-preview lessons, reviews, sticky enroll card, SEO and OG tags
- **Blog** with categories, search, and related posts
- About, Contact, Terms, Privacy (CMS-managed)

## 5. Student Experience
- Sign up, log in, reset password, profile settings
- Free one-click enrollment or paid checkout; access is granted automatically after a verified webhook
- **My Learning dashboard:** enrolled courses, progress bars, "Continue where you left off"
- **Course player:** video/text lessons, collapsible sidebar (slide-over drawer on mobile), mark complete, next/previous, downloadable resources, per-lesson notes
- Progress tracking per lesson and course; reviews for enrolled students; certificate PDF (stretch)

## 6. Access Control and Security
- Lesson content and files are protected **server-side**: check enrollment on every lesson and file request
- Payload access-control functions per collection and field; students can never read unpublished or unpurchased content through the API
- Signed, expiring URLs for paid videos and files
- Verify Stripe webhook signatures; idempotent handlers
- Rate-limit auth routes, secure password hashing, input sanitization, secure cookies

## 7. UI/UX Requirements
- **Style:** modern, minimal, trustworthy; generous whitespace, 8px spacing scale, rounded-xl cards, soft shadows
- **Typography:** one display font plus Inter, via `next/font`
- **Color:** calm primary brand color driven by CMS theme settings; WCAG AA contrast
- **Dark mode** toggle (respects system preference)
- **Mobile-first:** works from 360px up, 44px touch targets, hamburger or bottom navigation
- **Feedback:** skeleton loaders, helpful empty states, toasts, inline form errors
- **Accessibility:** semantic HTML, keyboard navigation, focus rings, required alt text, reduced-motion support
- **Performance:** Lighthouse 90+, `next/image`, server components by default, Suspense streaming, static generation with on-demand revalidation
- **Branded CMS admin:** custom logo and colors in the `/admin` panel so it feels like my own product

## 8. Data Model Notes
- Relations: Course → Sections → Lessons → Resources; User ↔ Course via Enrollment; LessonProgress per user/lesson
- Unique (user, course) on Enrollment; indexes on slug, status, category, and publish date
- Seed script: sample categories, 2 courses with sections and lessons, a home page built from blocks, an admin user, and an editor user

## 9. Project Structure
```
/src
  /app
    (frontend)/       home, courses, blog, [slug] pages, dashboard, learn
    (payload)/admin   CMS admin (Payload)
    api/              webhooks, revalidate, uploads
  /collections        Courses, Lessons, Pages, Posts, Media, Users, Enrollments...
  /globals            SiteSettings, Header, Footer
  /blocks             page-builder blocks (config + React component)
  /components  /lib  /emails
payload.config.ts
```

## 10. Deliverables
1. Clean, commented source code in a Git repo
2. `README.md` covering local setup, env vars, migrations, seeding, Stripe webhook setup, and Vercel deployment
3. `.env.example` with every variable
4. Live Vercel deployment (preview + production)
5. **Editor guide** (short doc or video) showing how to: add a course, build a page from blocks, publish a blog post, edit the menu, and manage students

## 11. Build Order
1. Project setup, Payload config, design system, layout, navigation
2. Collections, globals, access control, seed data
3. Page-builder blocks and front-end rendering
4. Course catalog, detail pages, and blog
5. Auth, enrollment, and payments
6. Student dashboard and course player with progress
7. Live preview, versions, scheduled publishing, revalidation, SEO
8. Emails, accessibility and performance pass, deployment, editor guide

## 12. For Freelancers: Please Include in Your Reply
- 2 to 3 links to similar projects (LMS, CMS-driven site, or marketplace) and your role in each
- Your approach to CMS architecture, content protection, and payments
- Estimated timeline, milestones, and cost
- What you'd ship first for an MVP