import { getPayload } from 'payload'
import config from '@payload-config'

const richText = (...paragraphs: string[]) => ({
  root: {
    type: 'root',
    format: '',
    indent: 0,
    version: 1,
    children: paragraphs.map((text) => ({
      type: 'paragraph',
      format: '',
      indent: 0,
      version: 1,
      children: [{ detail: 0, format: 0, mode: 'normal', style: '', text, type: 'text', version: 1 }],
    })),
  },
})

const getEnv = (name: string, fallback: string) => {
  return process.env[name] || fallback
}

const findBy = async (payload: any, collection: string, field: string, value: string) => {
  const result = await payload.find({
    collection,
    where: { [field]: { equals: value } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })
  return result.docs[0] || null
}

const seed = async () => {
  const payload: any = await getPayload({ config })
  const seededUsers: Record<string, any> = {}

  for (const [role, prefix, defaultEmail, defaultPassword] of [
    ['admin', 'SEED_ADMIN', 'admin@example.com', 'Admin123456!'],
    ['editor', 'SEED_EDITOR', 'editor@example.com', 'Editor123456!'],
  ]) {
    const email = getEnv(`${prefix}_EMAIL`, defaultEmail).toLowerCase()
    const password = getEnv(`${prefix}_PASSWORD`, defaultPassword)
    if (password.length < 12) throw new Error(`${prefix}_PASSWORD must be at least 12 characters.`)
    let user = await findBy(payload, 'users', 'email', email)
    if (!user) {
      user = await payload.create({
        collection: 'users',
        data: { email, password, name: role === 'admin' ? 'Course Administrator' : 'Course Editor', role },
        context: { seed: true },
        overrideAccess: true,
      })
    }
    seededUsers[role] = user
  }
  if (seededUsers.admin.id === seededUsers.editor.id) {
    throw new Error('SEED_ADMIN_EMAIL and SEED_EDITOR_EMAIL must belong to different accounts.')
  }

  const categorySeeds = [
    { name: 'Web Development', slug: 'web-development', description: 'Build and ship modern web applications.' },
    { name: 'Design', slug: 'design', description: 'Practical foundations for digital product design.' },
  ]
  const categories = []
  for (const data of categorySeeds) {
    categories.push(await findBy(payload, 'categories', 'slug', data.slug) || await payload.create({ collection: 'categories', data, overrideAccess: true }))
  }

  let instructor = await findBy(payload, 'instructors', 'name', 'Alex Morgan')
  if (!instructor) instructor = await payload.create({
    collection: 'instructors',
    data: { name: 'Alex Morgan', title: 'Instructor', socialLinks: [] },
    overrideAccess: true,
  })

  const courseSeeds = [
    {
      title: 'Build Your First Website', slug: 'build-your-first-website', summary: 'Learn the foundations of HTML, CSS, and responsive layouts.', category: categories[0], level: 'beginner', price: 0,
      description: ['A friendly, project-based introduction to the building blocks of the web.', 'By the end, you will have a responsive personal page and a clear path for continuing your web development journey.'],
      outcomes: ['Explain how browsers load a website', 'Structure clear pages with semantic HTML', 'Create a responsive layout with CSS'],
      lessons: [
        { title: 'How the web works', duration: 6, body: 'A website is a set of files that a browser requests from a server. In this lesson, follow a request from a link click to the page appearing on screen.' },
        { title: 'Structure a page with HTML', duration: 9, body: 'HTML gives content meaning and structure. Start with a page landmark, add a clear heading, and group related information into sections.' },
        { title: 'Style a responsive layout', duration: 12, body: 'CSS controls the visual presentation. Build a flexible layout that adjusts naturally from a narrow phone screen to a wide desktop.' },
      ],
    },
    {
      title: 'Product Design Foundations', slug: 'product-design-foundations', summary: 'Practice user flows, visual hierarchy, and interface decisions.', category: categories[1], level: 'beginner', price: 49,
      description: ['Learn a practical process for turning a user need into a clear, usable interface.', 'You will work through a small product challenge and leave with a user flow and a tested screen concept.'],
      outcomes: ['Frame a problem around a real user need', 'Map a focused task flow', 'Use hierarchy to make an interface easier to scan'],
      lessons: [
        { title: 'Understand the user problem', duration: 8, body: 'Good design starts with understanding the person and task. Separate what you observed from what you assumed, then write a concise problem statement.' },
        { title: 'Map a simple user flow', duration: 10, body: 'A user flow shows the steps someone takes to finish a task. Keep the main path visible and remove decisions that do not help the user move forward.' },
        { title: 'Create a clear interface', duration: 14, body: 'Use spacing, contrast, and type size to guide attention. Give each screen one clear purpose and make the next action easy to find.' },
      ],
    },
  ]

  const courses = []
  for (const item of courseSeeds) {
    let course = await findBy(payload, 'courses', 'slug', item.slug)
    if (!course) {
      course = await payload.create({
        collection: 'courses',
        data: {
          title: item.title,
          slug: item.slug,
          summary: item.summary,
          category: item.category.id,
          instructor: instructor.id,
          level: item.level,
          language: 'English',
          price: item.price,
          currency: 'USD',
          description: richText(...item.description),
          learningOutcomes: item.outcomes.map((outcome: string) => ({ item: outcome })),
          requirements: [{ item: 'No prior experience required' }],
          faqs: [],
          seo: { title: item.title, description: item.summary },
          _status: 'published',
        },
        overrideAccess: true,
      })
    }

    let section = await findBy(payload, 'sections', 'title', `${item.title} - Getting Started`)
    if (!section) section = await payload.create({
      collection: 'sections',
      data: { title: `${item.title} - Getting Started`, course: course.id, order: 1 },
      overrideAccess: true,
    })

    for (let index = 0; index < item.lessons.length; index += 1) {
      const lesson = item.lessons[index]
      const title = lesson.title
      if (!await findBy(payload, 'lessons', 'title', title)) {
        await payload.create({
          collection: 'lessons',
          data: {
            title,
            section: section.id,
            order: index + 1,
            type: 'text',
            freePreview: index === 0,
            durationMinutes: lesson.duration,
            content: richText(lesson.body),
          },
          overrideAccess: true,
        })
      }
    }
    courses.push(course)
  }

  const settings = await payload.findGlobal({ slug: 'site-settings', overrideAccess: true })
  if (!Array.isArray(settings.navigation) || settings.navigation.length === 0) {
    await payload.updateGlobal({
      slug: 'site-settings',
      data: {
        ...(!settings.siteName ? { siteName: 'Fieldnotes' } : {}),
        navigation: [{ label: 'Courses', url: '/courses' }, { label: 'About', url: '/about' }, { label: 'Journal', url: '/blog' }],
        ...(!Array.isArray(settings.footerNavigation) || settings.footerNavigation.length === 0
          ? { footerNavigation: [{ label: 'Courses', url: '/courses' }, { label: 'Journal', url: '/blog' }] }
          : {}),
      },
      overrideAccess: true,
    })
  }

  if (!await findBy(payload, 'posts', 'slug', 'start-with-small-steps')) {
    await payload.create({
      collection: 'posts',
      data: {
        title: 'Start with small steps',
        slug: 'start-with-small-steps',
        excerpt: 'A practical note on making room for steady progress when you are learning something new.',
        content: richText(
          'Learning something new can feel like a large project before you have even begun. Shrink the first step until it is easy to start.',
          'Choose one question to answer, one small exercise to finish, or one idea to explain in your own words. A short, focused session gives you something useful to build on.',
          'Return to the work regularly. Progress becomes easier to see when you keep a record of what you tried and what you learned.',
        ),
        readingTime: 2,
        publishedAt: new Date().toISOString(),
        author: seededUsers.admin.id,
        categories: [categories[0].id],
        seo: { title: 'Start with small steps', description: 'A practical note on steady progress while learning.' },
        _status: 'published',
      },
      overrideAccess: true,
    })
  }

  let home = await findBy(payload, 'pages', 'slug', 'home')
  if (!home) {
    await payload.create({
      collection: 'pages',
      data: {
        title: 'Home',
        slug: 'home',
        _status: 'published',
        layout: [
          {
            blockType: 'hero',
            eyebrow: 'FIELDNOTES COURSE PLATFORM',
            heading: 'Learn by building something real.',
            body: 'Practical courses to help you move from an idea to a finished project.',
            buttonLabel: 'Explore courses',
            buttonLink: '/courses',
          },
          { blockType: 'courseGrid', heading: 'Start learning', intro: 'Choose a course and make your next idea practical.', courses: courses.map((course) => course.id), limit: 2 },
          { blockType: 'stats', heading: 'Learning, made practical', items: [{ value: '3', label: 'Focused lessons per course' }, { value: '100%', label: 'Learn at your own pace' }] },
          { blockType: 'testimonials', heading: 'A thoughtful way to learn', items: [{ quote: 'Clear, practical lessons made it easy to keep going and finish a project I am proud of.', name: 'Jamie R.', detail: 'Web development student' }, { quote: 'The course helped me turn a vague idea into a simple flow I could share with my team.', name: 'Morgan L.', detail: 'Product design student' }] },
          { blockType: 'cta', heading: 'Make room for your next idea.', buttonLabel: 'Browse courses', buttonLink: '/courses' },
        ],
      },
      overrideAccess: true,
    })
  }

  payload.logger.info('Seed complete. Existing records were kept; missing sample records were created.')
  process.exit(0)
}

seed().catch((error) => {
  console.error(error)
  process.exit(1)
})
