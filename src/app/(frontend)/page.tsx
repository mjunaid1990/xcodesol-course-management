import { draftMode } from 'next/headers'
import type { Metadata } from 'next'
import { RenderBlocks } from '@/components/RenderBlocks'
import { PreviewBanner } from '@/components/PreviewBanner'
import { getPayloadClient } from '@/lib/payload'

const highlights = [
  { number: '01', title: 'Learn at your pace', text: 'Focused lessons fit around real life, with lifetime access to every course.' },
  { number: '02', title: 'Make it practical', text: 'Build useful skills through clear guidance and projects you can put to work.' },
  { number: '03', title: 'Keep growing', text: 'A thoughtful library of courses that grows alongside your ambitions.' },
]

export async function generateMetadata(): Promise<Metadata> {
  try {
    const payload = await getPayloadClient()
    const { isEnabled } = await draftMode()
    const result = await payload.find({ collection: 'pages', where: { slug: { equals: 'home' }, ...(!isEnabled ? { _status: { equals: 'published' as const } } : {}) }, limit: 1, draft: isEnabled, overrideAccess: isEnabled })
    const seo = result.docs[0]?.seo as { title?: string; description?: string } | undefined
    if (seo?.title || seo?.description) return { title: seo.title, description: seo.description }
  } catch {
    return {}
  }
  return {}
}

export default async function HomePage() {
  try {
    const payload = await getPayloadClient()
    const { isEnabled } = await draftMode()
    const page = await payload.find({
      collection: 'pages',
      where: { slug: { equals: 'home' }, ...(!isEnabled ? { _status: { equals: 'published' as const } } : {}) },
      limit: 1,
      depth: 2,
      draft: isEnabled,
      overrideAccess: isEnabled,
    }).then((result) => result.docs[0])
    if (page) return <><PreviewBanner enabled={isEnabled} /><main className="cms-page"><RenderBlocks blocks={(page.layout || []) as never[]} /></main></>
  } catch {
    return <HomeDesign />
  }
  return <HomeDesign />
}

function HomeDesign() {
  return (
    <main>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow"><span className="eyebrow-dot" /> A calmer way to learn</p>
          <h1>Good work starts<br />with <em>curiosity.</em></h1>
          <p className="hero-intro">Practical, beautifully considered courses to help you do your best work — and enjoy getting there.</p>
          <div className="hero-actions"><a className="button button-primary" href="/courses">Explore courses <span aria-hidden="true">↗</span></a><a className="text-link" href="/about">Our approach <span aria-hidden="true">→</span></a></div>
          <div className="hero-proof"><div className="avatar-stack" aria-hidden="true"><i>J</i><i>M</i><i>A</i></div><span><strong>2,400+</strong> curious minds learning</span></div>
        </div>
        <div className="hero-art" aria-label="A sunlit reading nook with books and a leafy plant" role="img">
          <div className="art-window"><div className="window-sun" /><div className="window-plant"><i /><i /><i /><i /><b /></div></div>
          <div className="art-shelf"><span /><span /><span /><span /><span /></div>
          <div className="art-chair"><div className="chair-back" /><div className="chair-seat" /><div className="chair-leg left" /><div className="chair-leg right" /><div className="chair-cushion" /></div>
          <div className="art-table"><div className="table-top" /><div className="table-leg" /><div className="coffee"><i /></div><div className="book"><span>THE ART OF<br />NOTICING</span></div></div>
          <div className="art-note"><span className="note-star">✳</span><span>A little time<br />for yourself.</span></div>
          <span className="art-caption">A good place to begin <span>✳</span></span>
        </div>
        <span className="hero-index">01 / 03</span>
      </section>
      <section className="trust-strip"><span>MAKE ROOM FOR</span><div><i>✳</i> New ideas</div><div><i>↗</i> Better questions</div><div><i>◌</i> Lasting skills</div></section>
      <section className="intro-section"><div><p className="eyebrow">THE FIELDNOTES WAY</p><h2>Room to think.<br /><em>Space to grow.</em></h2></div><p className="intro-body">The internet has no shortage of information. What’s harder to find is the right guidance, at the right pace, when you need it. That’s what we’re here for.</p></section>
      <section className="highlights">{highlights.map((item) => <article key={item.number}><span className="highlight-number">{item.number}</span><h3>{item.title}</h3><p>{item.text}</p><a href="/courses" aria-label={`Explore: ${item.title}`}>↗</a></article>)}</section>
      <section className="closing-cta"><span className="cta-flower">✳</span><p className="eyebrow">YOUR NEXT CHAPTER</p><h2>Start with one<br /><em>good thing.</em></h2><a className="button button-light" href="/courses">Find your course <span aria-hidden="true">↗</span></a></section>
    </main>
  )
}
