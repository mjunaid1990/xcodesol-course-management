'use client'

import React, { useState, useTransition } from 'react'
import { Star, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { Review } from '@/lib/db/queries'
import { formatDate } from '@/lib/utils'
import { showToast } from '@/lib/toast'
import { moderateReviewAction } from '@/app/actions/admin-actions'

interface Props {
  initialReviews: Review[]
}

export function ReviewsModeratorClient({ initialReviews }: Props) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews)
  const [isPending, startTransition] = useTransition()

  const toggleApproval = (reviewId: string, currentStatus: boolean, studentName: string) => {
    const nextStatus = !currentStatus

    // Optimistic UI update
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, is_approved: nextStatus } : r))
    )

    startTransition(async () => {
      const res = await moderateReviewAction(reviewId, nextStatus)
      if (res.success) {
        showToast.success(
          nextStatus ? 'Review Approved Live' : 'Review Unpublished',
          nextStatus
            ? `Review by ${studentName} is now visible on public course page.`
            : `Review by ${studentName} has been hidden from public.`
        )
      } else {
        showToast.error('Action Failed', res.error)
      }
    })
  }

  const pendingCount = reviews.filter((r) => !r.is_approved).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-300">
            {pendingCount} Pending Moderation
          </span>
          {pendingCount > 0 && (
            <span className="flex h-2 w-2 rounded-full bg-amber-400 animate-ping" />
          )}
        </div>
      </div>

      {reviews.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-[#0e1424] p-12 text-center">
          <Star className="h-10 w-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-white">No reviews submitted yet</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            When students complete course lessons and submit feedback ratings, they will appear here for publication review.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((rev) => (
          <div
            key={rev.id}
            className={`rounded-2xl border p-5 transition-all ${
              rev.is_approved
                ? 'border-slate-800 bg-[#0e1424]'
                : 'border-amber-500/30 bg-amber-500/5'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 font-bold text-white text-xs">
                  {rev.user_name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{rev.user_name}</span>
                    <span className="text-xs text-slate-400">• on {rev.course_title}</span>
                  </div>
                  <div className="flex items-center gap-1 mt-0.5 text-amber-400 text-xs">
                    {'★'.repeat(rev.rating)}
                    {'☆'.repeat(5 - rev.rating)}
                    <span className="ml-1 text-[11px] text-slate-400">
                      ({rev.rating}.0) • {formatDate(rev.created_at)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Approval status & Action */}
              <div className="flex items-center gap-3 self-end sm:self-center">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    rev.is_approved
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}
                >
                  {rev.is_approved ? 'Published Live' : 'Pending Approval'}
                </span>

                <button
                  onClick={() => toggleApproval(rev.id, rev.is_approved, rev.user_name)}
                  disabled={isPending}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    rev.is_approved
                      ? 'border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700'
                      : 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 hover:bg-emerald-500'
                  }`}
                >
                  {rev.is_approved ? (
                    <>
                      <XCircle className="h-3.5 w-3.5 text-slate-400" />
                      <span>Unpublish</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-3.5 w-3.5 text-emerald-200" />
                      <span>Approve Live</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Review Comment */}
            <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed pl-12">
              "{rev.comment}"
            </p>
          </div>
        ))}
      </div>
      )}
    </div>
  )
}
