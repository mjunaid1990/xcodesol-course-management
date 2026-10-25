import React from 'react'
import Link from 'next/link'
import { FileText, Plus, Search, Calendar, User, Clock, ArrowRight } from 'lucide-react'
import { formatDate } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function AdminPostsPage() {
  const samplePosts = [
    {
      id: 'post-1',
      title: 'Why We Architected Our LMS Without Bloated Monolithic CMS Frameworks',
      slug: 'why-we-chose-native-nextjs-architecture',
      excerpt: 'Discover why choosing native Next.js 15 App Router and direct PostgreSQL gives you sub-50ms TTFB and complete developer freedom.',
      category: 'Full-Stack Engineering',
      author: 'Sarah Jenkins',
      status: 'published',
      published_at: '2026-02-20T10:00:00Z',
      reading_time_minutes: 6,
    },
    {
      id: 'post-2',
      title: 'The Blueprint for High-Scale PostgreSQL Connection Pooling in Serverless',
      slug: 'high-scale-postgresql-connection-pooling',
      excerpt: 'How to prevent connection exhaustion, configure transaction poolers, and ensure zero-downtime database migrations on Vercel.',
      category: 'Database & Data Systems',
      author: 'Sarah Jenkins',
      status: 'draft',
      published_at: null,
      reading_time_minutes: 8,
    },
  ]

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Blog & Article Management
            </h1>
            <span className="rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-semibold text-blue-400 border border-blue-500/20">
              {samplePosts.length} Articles
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-400">
            Publish educational articles, engineering fieldnotes, and platform updates.
          </p>
        </div>

        <button className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 active:scale-95 transition-all">
          <Plus className="h-4 w-4" />
          <span>New Article</span>
        </button>
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {samplePosts.map((post) => (
          <div
            key={post.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-[#0e1424] p-5 shadow-sm hover:border-slate-700 transition-all group"
          >
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-blue-400">{post.category}</span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    post.status === 'published'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}
                >
                  {post.status}
                </span>
              </div>
              <h2 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors">
                {post.title}
              </h2>
              <p className="text-xs text-slate-400 line-clamp-1">{post.excerpt}</p>
              <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-1">
                <span className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {post.author}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {post.reading_time_minutes} min read
                </span>
                {post.published_at && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(post.published_at)}
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 self-end sm:self-center">
              <button className="rounded-xl border border-slate-700 bg-slate-800/80 px-3.5 py-2 text-xs font-medium text-slate-200 hover:bg-slate-700 transition-colors">
                Edit Draft
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
