import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import postgres from 'postgres'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return
  try {
    const content = fs.readFileSync(filePath, 'utf-8')
    for (const line of content.split('\n')) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      const eqIdx = trimmed.indexOf('=')
      if (eqIdx > 0) {
        const key = trimmed.slice(0, eqIdx).trim()
        let val = trimmed.slice(eqIdx + 1).trim()
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1)
        }
        if (!process.env[key]) {
          process.env[key] = val
        }
      }
    }
  } catch (err) {
    console.warn(`[Seed] Could not read ${filePath}:`, err.message)
  }
}

loadEnvFile(path.join(rootDir, '.env'))
loadEnvFile(path.join(rootDir, '.env.local'))

const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
  console.log('[Seed] ❌ DATABASE_URL is not set. Please set DATABASE_URL in your .env file.')
  process.exit(1)
}

const needsSsl =
  process.env.NODE_ENV === 'production' ||
  databaseUrl.includes('neon.tech') ||
  databaseUrl.includes('supabase.co') ||
  databaseUrl.includes('vercel-storage.com') ||
  databaseUrl.includes('pooler.supabase.com')

const sql = postgres(databaseUrl, {
  max: 1,
  ssl: needsSsl ? { rejectUnauthorized: false } : undefined,
})

async function seed() {
  console.log('🌱 Starting database seeding...')

  try {
    // 1. Create or ensure Admin User
    const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@fieldnotes.dev'
    const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'AdminPass123!@#'

    const [adminUser] = await sql`
      INSERT INTO users (name, email, password_hash, role, headline, bio)
      VALUES (
        'Sarah Jenkins',
        ${adminEmail},
        ${adminPassword},
        'admin',
        'Lead Systems Architect & Educator',
        'Senior Software Engineer with 12+ years experience building scalable distributed web architectures.'
      )
      ON CONFLICT (email) DO UPDATE
      SET role = 'admin', name = EXCLUDED.name
      RETURNING id, name, email;
    `
    console.log(`  ✓ Admin user: ${adminUser.email} (${adminUser.name})`)

    // 2. Insert Categories
    const categoriesData = [
      { name: 'Full-Stack Engineering', slug: 'full-stack', description: 'Modern web development with Next.js, React, Node, and PostgreSQL.', icon: 'Layers' },
      { name: 'Cloud Architecture & DevOps', slug: 'devops-cloud', description: 'Docker, Kubernetes, AWS, Vercel, and CI/CD pipelines.', icon: 'Cloud' },
      { name: 'UI/UX & Design Systems', slug: 'ui-ux-design', description: 'Tailwind CSS, Figma, design tokens, and high-performance micro-interactions.', icon: 'Palette' },
      { name: 'Database & Data Systems', slug: 'databases', description: 'PostgreSQL, Redis, vector search, indexing, and high-throughput query optimization.', icon: 'Database' },
    ]

    const categoryMap = new Map()
    for (const cat of categoriesData) {
      const [inserted] = await sql`
        INSERT INTO categories (name, slug, description, icon)
        VALUES (${cat.name}, ${cat.slug}, ${cat.description}, ${cat.icon})
        ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description
        RETURNING id, slug;
      `
      categoryMap.set(inserted.slug, inserted.id)
    }
    console.log(`  ✓ Categories seeded: ${categoryMap.size}`)

    // 3. Insert Courses
    const fullStackCatId = categoryMap.get('full-stack')
    const uiUxCatId = categoryMap.get('ui-ux-design')

    const [course1] = await sql`
      INSERT INTO courses (
        title, slug, summary, description,
        category_id, instructor_id, level, language,
        price, currency, status, is_featured, published_at,
        what_you_will_learn, requirements, faqs,
        seo_title, seo_description
      )
      VALUES (
        'Production-Grade Next.js 15 & Serverless Architecture',
        'production-grade-nextjs-15',
        'Master the Next.js 15 App Router, React 19 Server Components, PostgreSQL, and cloud deployments with absolute confidence.',
        'This comprehensive course guides you step-by-step from zero to an enterprise-ready web platform. You will build high-traffic architectures with real-world authentication, serverless database pooling, optimistic UI updates, and resilient caching patterns.',
        ${fullStackCatId}, ${adminUser.id}, 'intermediate', 'English',
        149.00, 'USD', 'published', TRUE, NOW(),
        '["Architect Next.js 15 apps with Server Actions & Streaming","Optimize PostgreSQL queries with connection pooling & indexes","Integrate Stripe webhooks with idempotent transactions","Build dynamic, beautiful interfaces using modern Tailwind CSS"]'::jsonb,
        '["Basic understanding of JavaScript and React","A laptop with Node.js 20+ installed"]'::jsonb,
        '[{"question":"Is this course suitable for beginners?","answer":"Basic knowledge of React is recommended. We start with fundamental architecture concepts before moving to advanced server patterns."},{"question":"Do I get lifetime access?","answer":"Yes, once enrolled, you receive lifetime access including future updates and community discussions."}]'::jsonb,
        'Production-Grade Next.js 15 Architecture Course',
        'Learn how to architect, build, and deploy production-grade Next.js 15 web applications with PostgreSQL and Tailwind CSS.'
      )
      ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, price = EXCLUDED.price, status = EXCLUDED.status
      RETURNING id, slug, title;
    `

    const [course2] = await sql`
      INSERT INTO courses (
        title, slug, summary, description,
        category_id, instructor_id, level, language,
        price, currency, status, is_featured, published_at,
        what_you_will_learn, requirements, faqs,
        seo_title, seo_description
      )
      VALUES (
        'Design Systems & Tailwind CSS Mastery',
        'design-systems-tailwind-mastery',
        'Craft world-class user interfaces, design tokens, dark mode systems, and animated component libraries.',
        'Transform your front-end craft. Learn how top tech companies construct consistent, accessible design systems that scale across hundreds of views with flawless performance and aesthetic finesse.',
        ${uiUxCatId}, ${adminUser.id}, 'all', 'English',
        99.00, 'USD', 'published', TRUE, NOW(),
        '["Construct resilient Tailwind CSS design token hierarchies","Master micro-animations, glassmorphism, and responsive layouts","Ensure WCAG AA compliance and accessible keyboard navigation","Build reusable component libraries for scalable teams"]'::jsonb,
        '["Basic knowledge of HTML and CSS"]'::jsonb,
        '[{"question":"Do we build real components?","answer":"Yes! We build a complete 25+ component library with interactive states and variants."}]'::jsonb,
        'Tailwind CSS Mastery & Modern Design Systems Course',
        'Learn modern web design, tokens, micro-interactions, and accessible UI with Tailwind CSS.'
      )
      ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, price = EXCLUDED.price, status = EXCLUDED.status
      RETURNING id, slug, title;
    `
    console.log(`  ✓ Courses seeded: ${course1.title}, ${course2.title}`)

    // 4. Insert Sections and Lessons for Course 1
    const [section1] = await sql`
      INSERT INTO sections (course_id, title, description, sort_order)
      VALUES (${course1.id}, 'Module 1: Foundations & App Router', 'Getting started with Next.js 15, directory structure, and runtime model.', 1)
      RETURNING id;
    `

    const [section2] = await sql`
      INSERT INTO sections (course_id, title, description, sort_order)
      VALUES (${course1.id}, 'Module 2: Database & Data Architecture', 'PostgreSQL schema modeling, connections, migrations, and indexing.', 2)
      RETURNING id;
    `

    await sql`
      INSERT INTO lessons (section_id, course_id, title, slug, lesson_type, content, duration_seconds, is_free_preview, sort_order)
      VALUES
      (
        ${section1.id}, ${course1.id},
        'Welcome & Platform Architecture Overview',
        'welcome-platform-overview',
        'video',
        'In this opening lesson, we explore the architectural blueprint of high-scale Next.js platforms, discussing server vs client execution contexts.',
        720,
        TRUE,
        1
      ),
      (
        ${section1.id}, ${course1.id},
        'App Router Fundamentals & Server Components',
        'app-router-fundamentals',
        'video',
        'Deep dive into React 19 Server Components, streaming with Suspense, and nested layout hierarchies.',
        1140,
        TRUE,
        2
      ),
      (
        ${section2.id}, ${course1.id},
        'PostgreSQL Schemas, Indexes & Migrations',
        'postgresql-schemas-and-indexes',
        'video',
        'Designing relational models for courses, users, and transactions with optimal indexes and zero-downtime migrations.',
        1500,
        FALSE,
        1
      ),
      (
        ${section2.id}, ${course1.id},
        'Server Actions & Safe Mutations',
        'server-actions-mutations',
        'text',
        'Writing secure, validated mutation handlers using Zod and React 19 useActionState.',
        900,
        FALSE,
        2
      )
      ON CONFLICT (section_id, slug) DO NOTHING;
    `
    console.log('  ✓ Sections & lessons seeded for Course 1')

    // 5. Testimonials
    await sql`
      INSERT INTO testimonials (name, role, company, content, rating, is_featured, sort_order)
      VALUES
      ('Alex Rivera', 'Staff Software Engineer', 'Vercel Ecosystem', 'The depth of real-world knowledge in these courses is unmatched. The curriculum bridged the gap between basic tutorials and true enterprise engineering.', 5, TRUE, 1),
      ('Elena Rostova', 'Product Designer & Frontend Dev', 'Stripe Partner', 'The design system and Tailwind patterns completely revamped how our team builds products. Clean, modern, and instantly applicable.', 5, TRUE, 2),
      ('Marcus Vance', 'Founder & CTO', 'TechVentures', 'We trained our entire engineering squad using this platform. The PostgreSQL and serverless insights alone saved us weeks of trial and error.', 5, TRUE, 3);
    `
    console.log('  ✓ Testimonials seeded')

    // 6. Blog Post
    await sql`
      INSERT INTO posts (title, slug, excerpt, content, author_id, category_id, reading_time_minutes, status, published_at, seo_title, seo_description)
      VALUES (
        'Why We Architected Our LMS Without Bloated Monolithic CMS Frameworks',
        'why-we-chose-native-nextjs-architecture',
        'Discover the architectural decisions behind choosing a lightweight, direct Next.js 15 and PostgreSQL architecture over heavy monolithic CMS tooling.',
        'When building high-performance modern web platforms, speed, maintainability, and total developer control reign supreme. In this article, we break down why direct App Router integrations combined with modern PostgreSQL connection pooling deliver unmatched flexibility and blistering sub-50ms TTFB.',
        ${adminUser.id},
        ${fullStackCatId},
        6,
        'published',
        NOW(),
        'Why Native Next.js 15 & PostgreSQL is the Future of Course Platforms',
        'An in-depth technical analysis comparing monolithic CMSs against native Next.js 15 App Router platforms.'
      )
      ON CONFLICT (slug) DO NOTHING;
    `
    console.log('  ✓ Blog post seeded')

    console.log('🎉 Database seeding completed successfully!')
    await sql.end()
    process.exit(0)
  } catch (err) {
    console.error('❌ Seeding failed:', err)
    await sql.end({ timeout: 2 }).catch(() => {})
    process.exit(1)
  }
}

seed()
