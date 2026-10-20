import { getPayload } from 'payload'
import config from '@payload-config'

const required = (name: string) => {
  const value = process.env[name]
  if (!value) throw new Error(`${name} must be set before running the seed script.`)
  return value
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

  for (const [role, prefix] of [['admin', 'SEED_ADMIN'], ['editor', 'SEED_EDITOR']]) {
    const email = required(`${prefix}_EMAIL`).toLowerCase()
    const password = required(`${prefix}_PASSWORD`)
    if (password.length < 12) throw new Error(`${prefix}_PASSWORD must be at least 12 characters.`)
    if (!await findBy(payload, 'users', 'email', email)) {
      await payload.create({
        collection: 'users',
        data: { email, password, name: role === 'admin' ? 'Course Administrator' : 'Course Editor', role },
        overrideAccess: true,
      })
    }
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
      lessons: ['How the web works', 'Structure a page with HTML', 'Style a responsive layout'],
    },
    {
      title: 'Product Design Foundations', slug: 'product-design-foundations', summary: 'Practice user flows, visual hierarchy, and interface decisions.', category: categories[1], level: 'beginner', price: 49,
      lessons: ['Understand the user problem', 'Map a simple user flow', 'Create a clear interface'],
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
          learningOutcomes: [{ item: 'Understand the core concepts' }, { item: 'Build a practical project' }],
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
      const title = item.lessons[index]
      if (!await findBy(payload, 'lessons', 'title', title)) {
        await payload.create({
          collection: 'lessons',
          data: {
            title,
            section: section.id,
            order: index + 1,
            type: 'text',
            freePreview: index === 0,
            durationMinutes: 8,
          },
          overrideAccess: true,
        })
      }
    }
    courses.push(course)
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
          { blockType: 'courseGrid', heading: 'Start learning', intro: 'Explore our featured courses.', courses: courses.map((course) => course.id), limit: 2 },
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
