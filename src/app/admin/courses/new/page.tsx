import React from 'react'
import { CourseEditorClient } from '@/components/admin/CourseEditorClient'
import { Course } from '@/lib/db/queries'

export default function NewCoursePage() {
  const blankCourse: Course = {
    id: `course-${Date.now()}`,
    title: 'Untitled Course',
    slug: `course-${Date.now().toString().slice(-6)}`,
    summary: 'Brief description of this new course.',
    description: 'Detailed curriculum and lesson guides.',
    thumbnail_url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
    promo_video_url: null,
    category_id: null,
    instructor_id: null,
    level: 'all',
    language: 'English',
    price: 99.0,
    currency: 'USD',
    status: 'draft',
    is_featured: false,
    published_at: null,
    what_you_will_learn: ['Understand foundational concepts', 'Build real projects'],
    requirements: ['No prior experience required'],
    faqs: [],
    seo_title: 'New Course Title',
    seo_description: 'Enroll in our newest comprehensive course.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  const blankSections = [
    {
      id: `sec-${Date.now()}`,
      course_id: blankCourse.id,
      title: 'Module 1: Orientation & Basics',
      description: 'Introduction to the course goals.',
      sort_order: 1,
      lessons: [
        {
          id: `les-${Date.now()}`,
          section_id: `sec-${Date.now()}`,
          course_id: blankCourse.id,
          title: 'Welcome to the Course',
          slug: 'welcome',
          lesson_type: 'video' as const,
          content: 'Course overview and outcomes.',
          video_url: '',
          mux_playback_id: null,
          duration_seconds: 300,
          is_free_preview: true,
          sort_order: 1,
        },
      ],
    },
  ]

  return <CourseEditorClient initialCourse={blankCourse} initialSections={blankSections} />
}
