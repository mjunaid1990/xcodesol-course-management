'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { getSqlClient } from '@/lib/db'

// ============================================================================
// Response Type
// ============================================================================
export interface ActionResponse<T = any> {
  success: boolean
  data?: T
  error?: string
}

// ============================================================================
// 1. Course CRUD Actions
// ============================================================================
const CourseSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  slug: z.string().min(2, 'Slug must be at least 2 characters'),
  summary: z.string().optional(),
  description: z.string().optional(),
  category_id: z.string().nullable().optional(),
  level: z.enum(['beginner', 'intermediate', 'advanced', 'all']),
  price: z.number().min(0, 'Price must be positive'),
  currency: z.string().default('USD'),
  status: z.enum(['draft', 'published', 'scheduled', 'archived']),
  thumbnail_url: z.string().optional().nullable(),
  seo_title: z.string().optional().nullable(),
  seo_description: z.string().optional().nullable(),
})

export async function createCourseAction(formData: any): Promise<ActionResponse> {
  const result = CourseSchema.safeParse(formData)
  if (!result.success) {
    return { success: false, error: result.error.errors[0]?.message || 'Validation failed' }
  }

  const client = getSqlClient()
  if (client) {
    try {
      const [inserted] = await client`
        INSERT INTO courses (
          title, slug, summary, description, category_id,
          level, price, currency, status, thumbnail_url,
          seo_title, seo_description
        )
        VALUES (
          ${result.data.title}, ${result.data.slug}, ${result.data.summary || null},
          ${result.data.description || null}, ${result.data.category_id || null},
          ${result.data.level}, ${result.data.price}, ${result.data.currency},
          ${result.data.status}, ${result.data.thumbnail_url || null},
          ${result.data.seo_title || null}, ${result.data.seo_description || null}
        )
        RETURNING id, slug, title;
      `
      revalidatePath('/admin')
      revalidatePath('/admin/courses')
      return { success: true, data: inserted }
    } catch (err: any) {
      if (err.code === '23505') {
        return { success: false, error: 'A course with this slug already exists.' }
      }
      return { success: false, error: err.message || 'Database error occurred' }
    }
  }

  // Mock success when DB is offline
  revalidatePath('/admin')
  revalidatePath('/admin/courses')
  return { success: true, data: { ...result.data, id: `course-${Date.now()}` } }
}

export async function updateCourseAction(courseId: string, formData: any): Promise<ActionResponse> {
  const result = CourseSchema.safeParse(formData)
  if (!result.success) {
    return { success: false, error: result.error.errors[0]?.message || 'Validation failed' }
  }

  const client = getSqlClient()
  if (client) {
    try {
      await client`
        UPDATE courses
        SET
          title = ${result.data.title},
          slug = ${result.data.slug},
          summary = ${result.data.summary || null},
          description = ${result.data.description || null},
          category_id = ${result.data.category_id || null},
          level = ${result.data.level},
          price = ${result.data.price},
          currency = ${result.data.currency},
          status = ${result.data.status},
          thumbnail_url = ${result.data.thumbnail_url || null},
          seo_title = ${result.data.seo_title || null},
          seo_description = ${result.data.seo_description || null},
          updated_at = NOW()
        WHERE id = ${courseId} OR slug = ${courseId};
      `
      revalidatePath('/admin')
      revalidatePath('/admin/courses')
      revalidatePath(`/admin/courses/${result.data.slug}`)
      return { success: true, data: result.data }
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to update course' }
    }
  }

  revalidatePath('/admin/courses')
  return { success: true, data: result.data }
}

export async function deleteCourseAction(courseId: string): Promise<ActionResponse> {
  const client = getSqlClient()
  if (client) {
    try {
      await client`DELETE FROM courses WHERE id = ${courseId} OR slug = ${courseId};`
      revalidatePath('/admin')
      revalidatePath('/admin/courses')
      return { success: true }
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to delete course' }
    }
  }

  revalidatePath('/admin/courses')
  return { success: true }
}

// ============================================================================
// 2. Sections & Lessons CRUD Actions
// ============================================================================
export async function createSectionAction(
  courseId: string,
  title: string,
  description?: string
): Promise<ActionResponse> {
  if (!title?.trim()) {
    return { success: false, error: 'Module title is required.' }
  }

  const client = getSqlClient()
  if (client) {
    try {
      const [inserted] = await client`
        INSERT INTO sections (course_id, title, description, sort_order)
        VALUES (${courseId}, ${title}, ${description || null}, (
          SELECT COALESCE(MAX(sort_order), 0) + 1 FROM sections WHERE course_id = ${courseId}
        ))
        RETURNING id, title, sort_order;
      `
      revalidatePath('/admin/courses')
      return { success: true, data: inserted }
    } catch (err: any) {
      return { success: false, error: err.message }
    }
  }

  return { success: true, data: { id: `sec-${Date.now()}`, title, sort_order: 1 } }
}

export async function deleteSectionAction(sectionId: string): Promise<ActionResponse> {
  const client = getSqlClient()
  if (client) {
    try {
      await client`DELETE FROM sections WHERE id = ${sectionId};`
      revalidatePath('/admin/courses')
      return { success: true }
    } catch (err: any) {
      return { success: false, error: err.message }
    }
  }
  return { success: true }
}

export async function createLessonAction(
  sectionId: string,
  courseId: string,
  lessonData: {
    title: string
    slug: string
    lesson_type: 'video' | 'text' | 'pdf' | 'quiz'
    duration_seconds: number
    is_free_preview: boolean
    content?: string
    video_url?: string
  }
): Promise<ActionResponse> {
  if (!lessonData.title?.trim()) {
    return { success: false, error: 'Lesson title is required.' }
  }

  const client = getSqlClient()
  if (client) {
    try {
      const [inserted] = await client`
        INSERT INTO lessons (
          section_id, course_id, title, slug, lesson_type,
          duration_seconds, is_free_preview, content, video_url, sort_order
        )
        VALUES (
          ${sectionId}, ${courseId}, ${lessonData.title}, ${lessonData.slug},
          ${lessonData.lesson_type}, ${lessonData.duration_seconds}, ${lessonData.is_free_preview},
          ${lessonData.content || null}, ${lessonData.video_url || null},
          (SELECT COALESCE(MAX(sort_order), 0) + 1 FROM lessons WHERE section_id = ${sectionId})
        )
        RETURNING id, title, slug;
      `
      revalidatePath('/admin/courses')
      return { success: true, data: inserted }
    } catch (err: any) {
      return { success: false, error: err.message }
    }
  }

  return { success: true, data: { id: `les-${Date.now()}`, ...lessonData } }
}

export async function toggleLessonPreviewAction(
  lessonId: string,
  is_free_preview: boolean
): Promise<ActionResponse> {
  const client = getSqlClient()
  if (client) {
    try {
      await client`
        UPDATE lessons
        SET is_free_preview = ${is_free_preview}, updated_at = NOW()
        WHERE id = ${lessonId};
      `
      revalidatePath('/admin/courses')
      return { success: true, data: { is_free_preview } }
    } catch (err: any) {
      return { success: false, error: err.message }
    }
  }
  return { success: true, data: { is_free_preview } }
}

export async function deleteLessonAction(lessonId: string): Promise<ActionResponse> {
  const client = getSqlClient()
  if (client) {
    try {
      await client`DELETE FROM lessons WHERE id = ${lessonId};`
      revalidatePath('/admin/courses')
      return { success: true }
    } catch (err: any) {
      return { success: false, error: err.message }
    }
  }
  return { success: true }
}

// ============================================================================
// 3. Category CRUD Actions
// ============================================================================
const CategorySchema = z.object({
  name: z.string().min(2, 'Category name must be at least 2 characters'),
  slug: z.string().min(2, 'Slug must be at least 2 characters'),
  description: z.string().optional(),
  icon: z.string().default('Folder'),
})

export async function createCategoryAction(data: any): Promise<ActionResponse> {
  const result = CategorySchema.safeParse(data)
  if (!result.success) {
    return { success: false, error: result.error.errors[0]?.message }
  }

  const client = getSqlClient()
  if (client) {
    try {
      const [inserted] = await client`
        INSERT INTO categories (name, slug, description, icon)
        VALUES (${result.data.name}, ${result.data.slug}, ${result.data.description || null}, ${result.data.icon})
        RETURNING id, name, slug;
      `
      revalidatePath('/admin/categories')
      return { success: true, data: inserted }
    } catch (err: any) {
      if (err.code === '23505') {
        return { success: false, error: 'A category with this name or slug already exists.' }
      }
      return { success: false, error: err.message }
    }
  }

  revalidatePath('/admin/categories')
  return { success: true, data: { id: `cat-${Date.now()}`, ...result.data } }
}

export async function deleteCategoryAction(categoryId: string): Promise<ActionResponse> {
  const client = getSqlClient()
  if (client) {
    try {
      await client`DELETE FROM categories WHERE id = ${categoryId};`
      revalidatePath('/admin/categories')
      return { success: true }
    } catch (err: any) {
      return { success: false, error: err.message }
    }
  }
  revalidatePath('/admin/categories')
  return { success: true }
}

// ============================================================================
// 4. Student Enrollment Actions
// ============================================================================
export async function enrollStudentAction(data: {
  name: string
  email: string
  courseId?: string
}): Promise<ActionResponse> {
  if (!data.name?.trim() || !data.email?.trim()) {
    return { success: false, error: 'Name and email are required.' }
  }

  const client = getSqlClient()
  if (client) {
    try {
      const [user] = await client`
        INSERT INTO users (name, email, password_hash, role)
        VALUES (${data.name}, ${data.email}, 'TempPassword123!', 'student')
        ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name
        RETURNING id, name, email;
      `

      if (data.courseId) {
        await client`
          INSERT INTO enrollments (user_id, course_id, status)
          VALUES (${user.id}, ${data.courseId}, 'active')
          ON CONFLICT (user_id, course_id) DO UPDATE SET status = 'active';
        `
      }

      revalidatePath('/admin')
      revalidatePath('/admin/students')
      return { success: true, data: user }
    } catch (err: any) {
      return { success: false, error: err.message }
    }
  }

  revalidatePath('/admin/students')
  return { success: true, data: { id: `usr-${Date.now()}`, ...data } }
}

// ============================================================================
// 5. Review Moderation Action
// ============================================================================
export async function moderateReviewAction(reviewId: string, is_approved: boolean): Promise<ActionResponse> {
  const client = getSqlClient()
  if (client) {
    try {
      await client`
        UPDATE reviews
        SET is_approved = ${is_approved}, updated_at = NOW()
        WHERE id = ${reviewId};
      `
      revalidatePath('/admin')
      revalidatePath('/admin/reviews')
      return { success: true, data: { is_approved } }
    } catch (err: any) {
      return { success: false, error: err.message }
    }
  }

  revalidatePath('/admin/reviews')
  return { success: true, data: { is_approved } }
}

// ============================================================================
// 6. Global Site Settings Action
// ============================================================================
export async function updateSiteSettingsAction(settings: any): Promise<ActionResponse> {
  const client = getSqlClient()
  if (client) {
    try {
      await client`
        UPDATE site_settings
        SET
          site_name = ${settings.site_name},
          site_tagline = ${settings.site_tagline},
          primary_color = ${settings.primary_color},
          announcement_text = ${settings.announcement_text || null},
          announcement_enabled = ${Boolean(settings.announcement_enabled)},
          announcement_link = ${settings.announcement_link || null},
          currency = ${settings.currency},
          updated_at = NOW()
        WHERE id = 1;
      `
      revalidatePath('/admin')
      revalidatePath('/admin/settings')
      return { success: true, data: settings }
    } catch (err: any) {
      return { success: false, error: err.message }
    }
  }

  revalidatePath('/admin/settings')
  return { success: true, data: settings }
}
