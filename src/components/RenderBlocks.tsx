import Image from 'next/image'
import Link from 'next/link'
import { Fragment } from 'react'
import { RichText } from '@payloadcms/richtext-lexical/react'

type Block = Record<string, unknown> & { blockType: string; id?: string }

export function RenderBlocks({ blocks = [] }: { blocks?: Block[] }) {
  return <>{blocks.map((block, index) => {
    const key = block.id || `${block.blockType}-${index}`
    switch (block.blockType) {
      case 'hero':
        return <section className="content-hero" key={key}><div>{Boolean(block.eyebrow) && <p className="eyebrow">{String(block.eyebrow)}</p>}<h1>{String(block.heading || '')}</h1>{Boolean(block.body) && <p>{String(block.body)}</p>}{Boolean(block.buttonLabel) && Boolean(block.buttonLink) && <Link className="button button-primary" href={String(block.buttonLink)}>{String(block.buttonLabel)} ↗</Link>}</div>{typeof block.image === 'object' && block.image !== null && <Image className="block-image" src={String((block.image as Record<string, unknown>).url)} alt={String((block.image as Record<string, unknown>).alt || '')} width={900} height={650} />}</section>
      case 'richText':
        return <section className="rich-text-block" key={key}><RichText data={block.content as never} /></section>
      case 'courseGrid':
        return <section className="course-grid-block" key={key}><div className="section-heading"><div>{Boolean(block.heading) && <h2>{String(block.heading)}</h2>}{Boolean(block.intro) && <p>{String(block.intro)}</p>}</div><Link href="/courses">All courses ↗</Link></div><CourseCards courses={Array.isArray(block.courses) ? block.courses : []} /></section>
      case 'testimonials':
        return <section className="testimonial-block" key={key}>{Boolean(block.heading) && <h2>{String(block.heading)}</h2>}<div className="testimonial-grid">{Array.isArray(block.items) && block.items.map((item, itemIndex) => { const testimonial = item as Record<string, unknown>; return <blockquote key={itemIndex}><p>“{String(testimonial.quote || '')}”</p><footer><strong>{String(testimonial.name || '')}</strong>{Boolean(testimonial.detail) && <span>{String(testimonial.detail)}</span>}</footer></blockquote> })}</div></section>
      case 'faq':
        return <section className="faq-block" key={key}>{Boolean(block.heading) && <h2>{String(block.heading)}</h2>}{Array.isArray(block.items) && block.items.map((item, itemIndex) => { const faq = item as Record<string, unknown>; return <details key={itemIndex}><summary>{String(faq.question || '')}</summary><p>{String(faq.answer || '')}</p></details> })}</section>
      case 'imageText':
        return <section className={`image-text-block ${block.imageSide === 'right' ? 'image-right' : ''}`} key={key}>{typeof block.image === 'object' && block.image !== null && <Image src={String((block.image as Record<string, unknown>).url)} alt={String((block.image as Record<string, unknown>).alt || '')} width={800} height={600} />}<div><h2>{String(block.heading || '')}</h2><p>{String(block.body || '')}</p></div></section>
      case 'cta':
        return <section className="closing-cta" key={key}><p className="eyebrow">A GOOD PLACE TO BEGIN</p><h2>{String(block.heading)}</h2>{Boolean(block.body) && <p>{String(block.body)}</p>}<Link className="button button-light" href={String(block.buttonLink)}>{String(block.buttonLabel)} ↗</Link></section>
      case 'videoEmbed':
        return <section className="video-block" key={key}>{Boolean(block.heading) && <h2>{String(block.heading)}</h2>}<iframe src={String(block.url)} title={String(block.heading || 'Embedded video')} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />{Boolean(block.caption) && <p>{String(block.caption)}</p>}</section>
      case 'featuredCourse': {
        const course = typeof block.course === 'object' && block.course !== null ? block.course as Record<string, unknown> : null
        return course ? <section className="course-grid-block" key={key}><p className="eyebrow">{String(block.eyebrow || 'FEATURED COURSE')}</p><CourseCards courses={[course]} /></section> : <Fragment key={key} />
      }
      case 'instructorBio': {
        const instructor = typeof block.instructor === 'object' && block.instructor !== null ? block.instructor as Record<string, unknown> : null
        const portrait = instructor?.portrait && typeof instructor.portrait === 'object' ? instructor.portrait as Record<string, unknown> : null
        return instructor ? <section className="instructor-block" key={key}>{Boolean(portrait?.url) && <Image src={String(portrait?.url)} alt={String(portrait?.alt || '')} width={240} height={240} />}<div><p className="eyebrow">{String(block.heading || 'MEET YOUR INSTRUCTOR')}</p><h2>{String(instructor.name || '')}</h2>{Boolean(instructor.title) && <p>{String(instructor.title)}</p>}{Boolean(instructor.bio) && <RichText data={instructor.bio as never} />}</div></section> : <Fragment key={key} />
      }
      case 'stats':
        return <section className="stats-block" key={key}>{Boolean(block.heading) && <h2>{String(block.heading)}</h2>}<div>{Array.isArray(block.items) && block.items.map((item, itemIndex) => { const stat = item as Record<string, unknown>; return <article key={itemIndex}><strong>{String(stat.value || '')}</strong><span>{String(stat.label || '')}</span></article> })}</div></section>
      case 'newsletter':
        return <section className="newsletter-block" key={key}><div><p className="eyebrow">NOTES FOR THE CURIOUS</p><h2>{String(block.heading)}</h2>{Boolean(block.body) && <p>{String(block.body)}</p>}</div><p className="newsletter-note">Newsletter sign-up will be available when email delivery is configured.</p></section>
      case 'contactForm':
        return <section className="contact-block" key={key}><p className="eyebrow">GET IN TOUCH</p><h2>{String(block.heading)}</h2>{Boolean(block.intro) && <p>{String(block.intro)}</p>}{Boolean(block.recipientEmail) && <a className="button button-primary" href={`mailto:${encodeURIComponent(String(block.recipientEmail))}`}>Send us a note ↗</a>}</section>
      default:
        return <Fragment key={key} />
    }
  })}</>
}

export function CourseCards({ courses }: { courses: unknown[] }) {
  if (!courses.length) return <p className="empty-courses">New courses are on the way. Check back soon.</p>
  return <div className="course-cards">{courses.map((value, index) => {
    const course = value as Record<string, unknown>
    const slug = String(course.slug || '')
    const category = course.category && typeof course.category === 'object' ? String((course.category as Record<string, unknown>).name || '') : ''
    const thumbnail = course.thumbnail && typeof course.thumbnail === 'object' ? course.thumbnail as Record<string, unknown> : null
    return <Link className="course-card" href={`/courses/${slug}`} key={String(course.id || index)}>
      {thumbnail?.url ? <Image src={String(thumbnail.url)} alt={String(thumbnail.alt || '')} width={700} height={450} /> : <div className="course-card-art"><span>✳</span></div>}
      <div className="course-card-content"><span className="course-category">{category || String(course.level || 'Course')}</span><h3>{String(course.title || 'Untitled course')}</h3><p>{String(course.summary || '')}</p><div className="course-card-meta"><span>{String(course.level || 'Self-paced')}</span><span className="course-price">{Number(course.price) > 0 ? `${String(course.currency || 'USD')} ${Number(course.price).toFixed(0)}` : 'Free'}</span></div><span className="course-card-cta">Explore course <span aria-hidden="true">↗</span></span></div>
    </Link>
  })}</div>
}
