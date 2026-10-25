import React from 'react'
import { Star } from 'lucide-react'
import { getReviewsList } from '@/lib/db/queries'
import { ReviewsModeratorClient } from '@/components/admin/ReviewsModeratorClient'

export const dynamic = 'force-dynamic'

export default async function AdminReviewsPage() {
  const reviews = await getReviewsList()

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Student Reviews & Testimonials
          </h1>
          <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-400 border border-amber-500/20">
            Ratings & Feedback
          </span>
        </div>
        <p className="mt-1 text-sm text-slate-400">
          Review, moderate, and approve student feedback before displaying publicly on course pages.
        </p>
      </div>

      <ReviewsModeratorClient initialReviews={reviews} />
    </div>
  )
}
